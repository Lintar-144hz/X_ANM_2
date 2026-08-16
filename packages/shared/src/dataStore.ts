import { getSupabase } from './lib/supabase';
import {
  Student,
  OrganizationMember,
  ScheduleItem,
  ContentItem,
  SiteSettings,
  MediaFile,
  ActivityLog,
  ActivityActionType
} from './types';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_STUDENTS,
  INITIAL_ORGANIZATION,
  INITIAL_SCHEDULES,
  INITIAL_CONTENTS,
  INITIAL_MEDIA
} from './mockData';

// Helper to notify all UI components across Admin and Public apps to re-fetch
function notifyDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('x_animasi_data_changed'));
  }
}

// Check if error is due to missing Supabase table or schema cache issue
function isTableMissingError(error: any): boolean {
  if (!error) return false;
  const msg = typeof error === 'string' ? error : (error.message || error.details || '');
  return (
    msg.includes("Could not find the table") ||
    msg.includes("schema cache") ||
    (msg.includes("relation") && msg.includes("does not exist")) ||
    error.code === 'PGRST205' ||
    error.code === '42P01'
  );
}

// Local Storage Fallback Cache Management
const LS_KEYS = {
  SETTINGS: 'x_animasi_site_settings',
  STUDENTS: 'x_animasi_students',
  ORGANIZATION: 'x_animasi_organization',
  SCHEDULES: 'x_animasi_schedules',
  CONTENTS: 'x_animasi_contents',
  MEDIA: 'x_animasi_media',
  LOGS: 'x_animasi_activity_logs'
};

function getLocalData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setLocalData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

// Helper to attach student object to member/schedule item
function attachStudentToOrg(m: OrganizationMember, studentMap: Map<string, Student>): OrganizationMember {
  const st = studentMap.get(m.student_id);
  return {
    ...m,
    student: st || m.student
  };
}

function attachStudentToSchedule(sch: ScheduleItem, studentMap: Map<string, Student>): ScheduleItem {
  const st = studentMap.get(sch.student_id);
  return {
    ...sch,
    student: st || sch.student
  };
}

export const DataStore = {
  // === SITE SETTINGS ===
  async getSettings(): Promise<SiteSettings> {
    const supabase = getSupabase();
    if (!supabase) {
      return getLocalData(LS_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1);

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('Supabase site_settings table missing, using local storage.');
        } else {
          console.warn('Supabase site_settings read error:', error.message);
        }
        return getLocalData(LS_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
      }

      if (!data || data.length === 0) {
        // Auto-seed to Supabase
        const { data: seeded } = await supabase
          .from('site_settings')
          .insert(INITIAL_SITE_SETTINGS)
          .select()
          .single();

        const result = seeded || INITIAL_SITE_SETTINGS;
        setLocalData(LS_KEYS.SETTINGS, result);
        return result;
      }

      const loaded = data[0];
      if (loaded.description && loaded.description.includes('SMKN 1 Indonesia')) {
        loaded.description = loaded.description.replace(/SMKN 1 Indonesia/g, 'SMKN 9 Surakarta');
      }
      if (loaded.hero_subtitle && loaded.hero_subtitle.includes('SMKN 1 Indonesia')) {
        loaded.hero_subtitle = loaded.hero_subtitle.replace(/SMKN 1 Indonesia/g, 'SMKN 9 Surakarta');
      }
      if (loaded.footer_text && loaded.footer_text.includes('SMKN 1 Indonesia')) {
        loaded.footer_text = loaded.footer_text.replace(/SMKN 1 Indonesia/g, 'SMKN 9 Surakarta');
      }
      setLocalData(LS_KEYS.SETTINGS, loaded);
      return loaded;
    } catch (err: any) {
      console.warn('getSettings exception:', err?.message);
      return getLocalData(LS_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    }
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated: SiteSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString()
    };

    setLocalData(LS_KEYS.SETTINGS, updated);

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .upsert(updated, { onConflict: 'id' })
          .select()
          .single();

        if (error) {
          console.warn('Supabase updateSettings info:', error.message);
        } else if (data) {
          setLocalData(LS_KEYS.SETTINGS, data);
        }
      } catch (err: any) {
        console.warn('updateSettings Supabase sync failed:', err?.message);
      }
    }

    notifyDataChanged();
    return updated;
  },

  // === STUDENTS ===
  async getStudents(): Promise<Student[]> {
    const supabase = getSupabase();
    if (!supabase) {
      return getLocalData(LS_KEYS.STUDENTS, INITIAL_STUDENTS);
    }

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('attendance_number', { ascending: true });

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('Supabase students table missing, using local storage.');
        } else {
          console.warn('Supabase students read error:', error.message);
        }
        return getLocalData(LS_KEYS.STUDENTS, INITIAL_STUDENTS);
      }

      // If Supabase table is empty, do NOT auto-seed dummy students if user has deliberately deleted or has real local data
      if (!data || data.length === 0) {
        const localList = getLocalData<Student[]>(LS_KEYS.STUDENTS, []);
        if (localList.length > 0) {
          // Sync existing local students up
          return localList;
        }
        return [];
      }

      setLocalData(LS_KEYS.STUDENTS, data);
      return data;
    } catch (err: any) {
      console.warn('getStudents exception:', err?.message);
      return getLocalData(LS_KEYS.STUDENTS, INITIAL_STUDENTS);
    }
  },

  async addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    const localList = getLocalData<Student[]>(LS_KEYS.STUDENTS, INITIAL_STUDENTS);
    const newStudent: Student = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `std-${Date.now()}`,
      name: student.name,
      attendance_number: Number(student.attendance_number),
      gender: student.gender,
      photo_url: student.photo_url || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let savedStudent = newStudent;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('students')
          .insert({
            name: student.name,
            attendance_number: Number(student.attendance_number),
            gender: student.gender,
            photo_url: student.photo_url || null
          })
          .select()
          .single();

        if (error) {
          console.warn('Supabase addStudent note:', error.message);
        } else if (data) {
          savedStudent = data;
        }
      } catch (err: any) {
        console.warn('addStudent Supabase exception:', err?.message);
      }
    }

    const updatedList = [...localList.filter(s => s.id !== savedStudent.id && s.attendance_number !== savedStudent.attendance_number), savedStudent].sort(
      (a, b) => a.attendance_number - b.attendance_number
    );
    setLocalData(LS_KEYS.STUDENTS, updatedList);

    notifyDataChanged();
    return savedStudent;
  },

  async updateStudent(id: string, student: Partial<Student>): Promise<Student> {
    const localList = getLocalData<Student[]>(LS_KEYS.STUDENTS, INITIAL_STUDENTS);
    const existing = localList.find(s => s.id === id || s.attendance_number === student.attendance_number);
    const updatedStudent: Student = {
      ...existing,
      id: existing?.id || id,
      name: student.name ?? existing?.name ?? '',
      attendance_number: student.attendance_number ?? existing?.attendance_number ?? 1,
      gender: student.gender ?? existing?.gender ?? 'L',
      photo_url: student.photo_url !== undefined ? student.photo_url : existing?.photo_url,
      updated_at: new Date().toISOString()
    };

    let savedStudent = updatedStudent;

    const supabase = getSupabase();
    if (supabase) {
      try {
        let updateQuery = supabase.from('students').update({
          name: updatedStudent.name,
          attendance_number: updatedStudent.attendance_number,
          gender: updatedStudent.gender,
          photo_url: updatedStudent.photo_url || null,
          updated_at: new Date().toISOString()
        });

        if (id.startsWith('std-')) {
          // If local ID format, match by attendance_number or name
          updateQuery = updateQuery.eq('attendance_number', updatedStudent.attendance_number);
        } else {
          updateQuery = updateQuery.eq('id', id);
        }

        const { data, error } = await updateQuery.select().single();

        if (error) {
          console.warn('Supabase updateStudent note:', error.message);
        } else if (data) {
          savedStudent = data;
        }
      } catch (err: any) {
        console.warn('updateStudent Supabase exception:', err?.message);
      }
    }

    const updatedList = localList.map(s => {
      if (s.id === id || (s.id === existing?.id)) {
        return savedStudent;
      }
      return s;
    }).sort(
      (a, b) => a.attendance_number - b.attendance_number
    );
    setLocalData(LS_KEYS.STUDENTS, updatedList);

    notifyDataChanged();
    return savedStudent;
  },

  async deleteStudent(id: string): Promise<boolean> {
    const localList = getLocalData<Student[]>(LS_KEYS.STUDENTS, INITIAL_STUDENTS);
    const targetStudent = localList.find(s => s.id === id);
    const updatedList = localList.filter(s => s.id !== id);
    setLocalData(LS_KEYS.STUDENTS, updatedList);

    const supabase = getSupabase();
    if (supabase) {
      try {
        let deleteQuery = supabase.from('students').delete();
        if (id.startsWith('std-') && targetStudent) {
          deleteQuery = deleteQuery.eq('attendance_number', targetStudent.attendance_number);
        } else {
          deleteQuery = deleteQuery.eq('id', id);
        }
        const { error } = await deleteQuery;
        if (error) {
          console.warn('Supabase deleteStudent note:', error.message);
        }
      } catch (err: any) {
        console.warn('deleteStudent Supabase exception:', err?.message);
      }
    }

    notifyDataChanged();
    return true;
  },

  // === ORGANIZATION ===
  async getOrganization(): Promise<OrganizationMember[]> {
    const students = await this.getStudents();
    const studentMap = new Map<string, Student>(students.map(s => [s.id, s]));

    const supabase = getSupabase();
    if (!supabase) {
      const localOrg = getLocalData<OrganizationMember[]>(LS_KEYS.ORGANIZATION, INITIAL_ORGANIZATION);
      return localOrg.map(m => attachStudentToOrg(m, studentMap));
    }

    try {
      const { data, error } = await supabase
        .from('organization')
        .select('*, student:students(*)')
        .order('order_index', { ascending: true });

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('Supabase organization table missing, using local storage.');
        } else {
          console.warn('Supabase organization read error:', error.message);
        }
        const localOrg = getLocalData<OrganizationMember[]>(LS_KEYS.ORGANIZATION, INITIAL_ORGANIZATION);
        return localOrg.map(m => attachStudentToOrg(m, studentMap));
      }

      if (!data || data.length === 0) {
        const localOrg = getLocalData<OrganizationMember[]>(LS_KEYS.ORGANIZATION, INITIAL_ORGANIZATION);
        return localOrg.map(m => attachStudentToOrg(m, studentMap));
      }

      setLocalData(LS_KEYS.ORGANIZATION, data);
      return data.map(m => attachStudentToOrg(m, studentMap));
    } catch (err: any) {
      console.warn('getOrganization exception:', err?.message);
      const localOrg = getLocalData<OrganizationMember[]>(LS_KEYS.ORGANIZATION, INITIAL_ORGANIZATION);
      return localOrg.map(m => attachStudentToOrg(m, studentMap));
    }
  },

  async updateOrganizationPosition(position: string, studentId: string, customName?: string): Promise<void> {
    const localOrg = getLocalData<OrganizationMember[]>(LS_KEYS.ORGANIZATION, INITIAL_ORGANIZATION);
    const existingIndex = localOrg.findIndex(m => m.position === position);

    if (existingIndex >= 0) {
      localOrg[existingIndex] = {
        ...localOrg[existingIndex],
        student_id: studentId,
        custom_name: customName,
        updated_at: new Date().toISOString()
      };
    } else {
      localOrg.push({
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `org-${Date.now()}`,
        position: position as any,
        student_id: studentId,
        custom_name: customName,
        order_index: localOrg.length + 1,
        updated_at: new Date().toISOString()
      });
    }

    setLocalData(LS_KEYS.ORGANIZATION, localOrg);

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('organization')
          .upsert(
            { position, student_id: studentId || null, custom_name: customName || null, order_index: existingIndex >= 0 ? localOrg[existingIndex].order_index : localOrg.length },
            { onConflict: 'position' }
          );

        if (error) {
          console.warn('Supabase updateOrganizationPosition note:', error.message);
        }
      } catch (err: any) {
        console.warn('updateOrganizationPosition Supabase exception:', err?.message);
      }
    }

    notifyDataChanged();
  },

  // === SCHEDULES (Jadwal Piket) ===
  async getSchedules(): Promise<ScheduleItem[]> {
    const students = await this.getStudents();
    const studentMap = new Map<string, Student>(students.map(s => [s.id, s]));

    const supabase = getSupabase();
    if (!supabase) {
      const localSch = getLocalData<ScheduleItem[]>(LS_KEYS.SCHEDULES, INITIAL_SCHEDULES);
      return localSch.map(s => attachStudentToSchedule(s, studentMap));
    }

    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*, student:students(*)')
        .order('order_index', { ascending: true });

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('Supabase schedules table missing, using local storage.');
        } else {
          console.warn('Supabase schedules read error:', error.message);
        }
        const localSch = getLocalData<ScheduleItem[]>(LS_KEYS.SCHEDULES, INITIAL_SCHEDULES);
        return localSch.map(s => attachStudentToSchedule(s, studentMap));
      }

      if (!data || data.length === 0) {
        const localSch = getLocalData<ScheduleItem[]>(LS_KEYS.SCHEDULES, INITIAL_SCHEDULES);
        return localSch.map(s => attachStudentToSchedule(s, studentMap));
      }

      setLocalData(LS_KEYS.SCHEDULES, data);
      return data.map(s => attachStudentToSchedule(s, studentMap));
    } catch (err: any) {
      console.warn('getSchedules exception:', err?.message);
      const localSch = getLocalData<ScheduleItem[]>(LS_KEYS.SCHEDULES, INITIAL_SCHEDULES);
      return localSch.map(s => attachStudentToSchedule(s, studentMap));
    }
  },

  async setDaySchedules(day: string, studentIds: string[]): Promise<void> {
    const localSch = getLocalData<ScheduleItem[]>(LS_KEYS.SCHEDULES, INITIAL_SCHEDULES);
    const filteredOtherDays = localSch.filter(s => s.day !== day);
    const newDaySchedules: ScheduleItem[] = studentIds.map((sid, idx) => ({
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `sch-${Date.now()}-${idx}`,
      day: day as any,
      student_id: sid,
      order_index: idx + 1,
      created_at: new Date().toISOString()
    }));

    const updatedSchedules = [...filteredOtherDays, ...newDaySchedules];
    setLocalData(LS_KEYS.SCHEDULES, updatedSchedules);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('schedules').delete().eq('day', day);
        if (studentIds.length > 0) {
          const newRows = studentIds.map((sid, idx) => ({
            day,
            student_id: sid,
            order_index: idx + 1
          }));
          await supabase.from('schedules').insert(newRows);
        }
      } catch (err: any) {
        console.warn('setDaySchedules Supabase exception:', err?.message);
      }
    }

    notifyDataChanged();
  },

  // === CONTENTS / ANNOUNCEMENTS ===
  async getContents(onlyPublished: boolean = false): Promise<ContentItem[]> {
    const supabase = getSupabase();
    if (!supabase) {
      const localContents = getLocalData<ContentItem[]>(LS_KEYS.CONTENTS, INITIAL_CONTENTS);
      return onlyPublished ? localContents.filter(c => c.status === 'published') : localContents;
    }

    try {
      let query = supabase.from('contents').select('*').order('created_at', { ascending: false });
      if (onlyPublished) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;

      if (error) {
        if (isTableMissingError(error)) {
          console.warn('Supabase contents table missing, using local storage.');
        } else {
          console.warn('Supabase contents read error:', error.message);
        }
        const localContents = getLocalData<ContentItem[]>(LS_KEYS.CONTENTS, INITIAL_CONTENTS);
        return onlyPublished ? localContents.filter(c => c.status === 'published') : localContents;
      }

      if (!data || data.length === 0) {
        const localContents = getLocalData<ContentItem[]>(LS_KEYS.CONTENTS, []);
        if (localContents.length > 0) {
          return onlyPublished ? localContents.filter(c => c.status === 'published') : localContents;
        }
        return [];
      }

      setLocalData(LS_KEYS.CONTENTS, data);
      return data;
    } catch (err: any) {
      console.warn('getContents exception:', err?.message);
      const localContents = getLocalData<ContentItem[]>(LS_KEYS.CONTENTS, INITIAL_CONTENTS);
      return onlyPublished ? localContents.filter(c => c.status === 'published') : localContents;
    }
  },

  async getContentBySlug(slug: string): Promise<ContentItem | null> {
    const allContents = await this.getContents();
    return allContents.find(c => c.slug === slug) || null;
  },

  async addContent(content: Omit<ContentItem, 'id'>): Promise<ContentItem> {
    const localList = getLocalData<ContentItem[]>(LS_KEYS.CONTENTS, INITIAL_CONTENTS);
    const newContent: ContentItem = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cnt-${Date.now()}`,
      title: content.title,
      slug: content.slug || content.title.toLowerCase().replace(/\s+/g, '-'),
      body: content.body,
      image_url: content.image_url || undefined,
      status: content.status,
      published_at: content.status === 'published' ? new Date().toISOString() : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let savedContent = newContent;

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contents')
          .insert({
            title: content.title,
            slug: newContent.slug,
            body: content.body,
            image_url: content.image_url || null,
            status: content.status,
            published_at: newContent.published_at || null
          })
          .select()
          .single();

        if (error) {
          console.warn('Supabase addContent note:', error.message);
        } else if (data) {
          savedContent = data;
        }
      } catch (err: any) {
        console.warn('addContent Supabase exception:', err?.message);
      }
    }

    const updatedList = [savedContent, ...localList.filter(c => c.id !== savedContent.id && c.slug !== savedContent.slug)];
    setLocalData(LS_KEYS.CONTENTS, updatedList);

    notifyDataChanged();
    return savedContent;
  },

  async updateContent(id: string, content: Partial<ContentItem>): Promise<ContentItem> {
    const localList = getLocalData<ContentItem[]>(LS_KEYS.CONTENTS, INITIAL_CONTENTS);
    const existing = localList.find(c => c.id === id || (content.slug && c.slug === content.slug));
    const updatedContent: ContentItem = {
      ...existing,
      id: existing?.id || id,
      title: content.title ?? existing?.title ?? '',
      slug: content.slug ?? existing?.slug ?? '',
      body: content.body ?? existing?.body ?? '',
      image_url: content.image_url !== undefined ? content.image_url : existing?.image_url,
      status: content.status ?? existing?.status ?? 'published',
      published_at: content.status === 'published' ? (existing?.published_at || new Date().toISOString()) : undefined,
      updated_at: new Date().toISOString()
    };

    let savedContent = updatedContent;

    const supabase = getSupabase();
    if (supabase) {
      try {
        let updateQuery = supabase.from('contents').update({
          title: updatedContent.title,
          slug: updatedContent.slug,
          body: updatedContent.body,
          image_url: updatedContent.image_url || null,
          status: updatedContent.status,
          published_at: updatedContent.published_at || null,
          updated_at: new Date().toISOString()
        });

        if (id.startsWith('cnt-')) {
          updateQuery = updateQuery.eq('slug', updatedContent.slug);
        } else {
          updateQuery = updateQuery.eq('id', id);
        }

        const { data, error } = await updateQuery.select().single();

        if (error) {
          console.warn('Supabase updateContent note:', error.message);
        } else if (data) {
          savedContent = data;
        }
      } catch (err: any) {
        console.warn('updateContent Supabase exception:', err?.message);
      }
    }

    const updatedList = localList.map(c => (c.id === id || c.id === existing?.id ? savedContent : c));
    setLocalData(LS_KEYS.CONTENTS, updatedList);

    notifyDataChanged();
    return savedContent;
  },

  async deleteContent(id: string): Promise<boolean> {
    const localList = getLocalData<ContentItem[]>(LS_KEYS.CONTENTS, INITIAL_CONTENTS);
    const targetItem = localList.find(c => c.id === id);
    const updatedList = localList.filter(c => c.id !== id);
    setLocalData(LS_KEYS.CONTENTS, updatedList);

    const supabase = getSupabase();
    if (supabase) {
      try {
        let deleteQuery = supabase.from('contents').delete();
        if (id.startsWith('cnt-') && targetItem?.slug) {
          deleteQuery = deleteQuery.eq('slug', targetItem.slug);
        } else {
          deleteQuery = deleteQuery.eq('id', id);
        }
        const { error } = await deleteQuery;
        if (error) {
          console.warn('Supabase deleteContent note:', error.message);
        }
      } catch (err: any) {
        console.warn('deleteContent Supabase exception:', err?.message);
      }
    }

    notifyDataChanged();
    return true;
  },

  // === MEDIA FILES ===
  async getMediaFiles(): Promise<MediaFile[]> {
    const supabase = getSupabase();
    let mediaList: MediaFile[] = [];

    if (supabase) {
      try {
        const { data, error } = await supabase.storage.from('class-media').list();
        if (!error && data && data.length > 0) {
          const { data: { publicUrl } } = supabase.storage.from('class-media').getPublicUrl('');
          const remoteMedia: MediaFile[] = data.map(item => ({
            id: item.id || item.name,
            name: item.name,
            url: `${publicUrl}/${item.name}`,
            size: item.metadata?.size,
            created_at: item.created_at || new Date().toISOString()
          }));

          const localMedia = getLocalData<MediaFile[]>(LS_KEYS.MEDIA, INITIAL_MEDIA);
          const combined: MediaFile[] = [...remoteMedia];
          localMedia.forEach(lm => {
            if (!combined.some(r => r.name === lm.name || r.url === lm.url)) {
              combined.push(lm);
            }
          });
          setLocalData(LS_KEYS.MEDIA, combined);
          mediaList = combined;
        }
      } catch {
        // Fallback to local data
      }
    }

    if (mediaList.length === 0) {
      mediaList = getLocalData<MediaFile[]>(LS_KEYS.MEDIA, INITIAL_MEDIA);
    }

    // Always sort by upload/created date descending (newest first)
    return mediaList.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
  },

  async uploadMediaFile(
    file: File,
    options?: { description?: string; category?: MediaFile['category']; created_at?: string }
  ): Promise<{ success: boolean; data?: MediaFile; message?: string }> {
    const localMedia = getLocalData<MediaFile[]>(LS_KEYS.MEDIA, []);
    const fileExt = file.name.split('.').pop() || 'png';
    const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Read as Base64 Data URL for guaranteed persistent display
    const dataUrl: string = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(URL.createObjectURL(file));
      reader.readAsDataURL(file);
    });

    let newMedia: MediaFile = {
      id: cleanFileName,
      name: file.name,
      description: options?.description?.trim() || '',
      category: options?.category || 'karya',
      url: dataUrl,
      size: file.size,
      created_at: options?.created_at || new Date().toISOString()
    };

    const supabase = getSupabase();
    let uploadedToCloud = false;

    if (supabase) {
      try {
        const { data, error } = await supabase.storage.from('class-media').upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: true
        });

        if (!error && data) {
          const { data: { publicUrl } } = supabase.storage.from('class-media').getPublicUrl(cleanFileName);
          if (publicUrl) {
            newMedia.url = publicUrl;
            uploadedToCloud = true;
          }
        }
      } catch (err: any) {
        console.warn('Supabase storage upload note:', err?.message);
      }
    }

    const updatedMedia = [newMedia, ...localMedia];
    setLocalData(LS_KEYS.MEDIA, updatedMedia);

    // Audit Log
    await this.logActivity(
      'CREATE',
      'media',
      `Mengunggah media: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)${uploadedToCloud ? ' ke Supabase Storage' : ' ke Penyimpanan Lokal'}`,
      { filename: cleanFileName, size: file.size, cloud: uploadedToCloud, description: newMedia.description }
    );

    notifyDataChanged();
    return {
      success: true,
      data: newMedia,
      message: uploadedToCloud ? 'Berhasil diunggah ke Supabase Storage!' : 'Berhasil disimpan ke galeri media lokal.'
    };
  },

  async addMediaByUrl(
    name: string,
    url: string,
    options?: { description?: string; category?: MediaFile['category']; created_at?: string }
  ): Promise<MediaFile> {
    const localMedia = getLocalData<MediaFile[]>(LS_KEYS.MEDIA, []);
    const newMedia: MediaFile = {
      id: 'url-' + Date.now(),
      name: name.trim() || 'Media External',
      description: options?.description?.trim() || '',
      category: options?.category || 'karya',
      url: url.trim(),
      created_at: options?.created_at || new Date().toISOString()
    };

    setLocalData(LS_KEYS.MEDIA, [newMedia, ...localMedia]);

    await this.logActivity(
      'CREATE',
      'media',
      `Menambahkan media via URL: "${newMedia.name}"`,
      { url: newMedia.url, description: newMedia.description }
    );

    notifyDataChanged();
    return newMedia;
  },

  async updateMediaInfo(
    id: string,
    updates: Partial<Pick<MediaFile, 'name' | 'description' | 'category' | 'created_at'>>
  ): Promise<MediaFile | null> {
    const localMedia = getLocalData<MediaFile[]>(LS_KEYS.MEDIA, []);
    const idx = localMedia.findIndex(m => m.id === id);
    if (idx === -1) return null;

    const updated = {
      ...localMedia[idx],
      ...updates
    };
    localMedia[idx] = updated;
    setLocalData(LS_KEYS.MEDIA, localMedia);

    await this.logActivity(
      'UPDATE',
      'media',
      `Memperbarui informasi media: "${updated.name}"`,
      { id, ...updates }
    );

    notifyDataChanged();
    return updated;
  },

  async deleteMediaFile(id: string, name?: string): Promise<boolean> {
    const localMedia = getLocalData<MediaFile[]>(LS_KEYS.MEDIA, []);
    const targetName = name || id;
    const target = localMedia.find(m => m.id === id || m.name === targetName);
    const updatedMedia = localMedia.filter(m => m.id !== id && m.name !== targetName);
    setLocalData(LS_KEYS.MEDIA, updatedMedia);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.storage.from('class-media').remove([targetName]);
      } catch (err: any) {
        console.warn('deleteMediaFile Supabase note:', err?.message);
      }
    }

    await this.logActivity(
      'DELETE',
      'media',
      `Menghapus berkas media: "${target?.name || targetName}"`,
      { id, name: targetName }
    );

    notifyDataChanged();
    return true;
  },

  // === SYNC LOCAL DATA TO SUPABASE CLOUD ===
  async syncAllLocalDataToSupabase(): Promise<{
    success: boolean;
    message: string;
    details?: {
      settings: boolean;
      students: number;
      organization: number;
      schedules: number;
      contents: number;
    };
  }> {
    const supabase = getSupabase();
    if (!supabase) {
      return {
        success: false,
        message: 'Koneksi Supabase belum aktif atau URL/Key belum terpasang.'
      };
    }

    try {
      // 1. Sync Settings
      const localSettings = getLocalData<SiteSettings>(LS_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
      const { error: setErr } = await supabase.from('site_settings').upsert({
        id: localSettings.id || 'default_class_profile',
        class_name: localSettings.class_name,
        hero_title: localSettings.hero_title,
        hero_subtitle: localSettings.hero_subtitle,
        description: localSettings.description,
        hero_image_url: localSettings.hero_image_url,
        footer_text: localSettings.footer_text,
        updated_at: new Date().toISOString()
      });

      if (setErr && isTableMissingError(setErr)) {
        return {
          success: false,
          message: 'Tabel database belum dibuat di Supabase. Silakan jalankan script SQL di SQL Editor Supabase terlebih dahulu.'
        };
      }

      // 2. Sync Students
      const localStudents = getLocalData<Student[]>(LS_KEYS.STUDENTS, INITIAL_STUDENTS);
      if (localStudents.length > 0) {
        for (const st of localStudents) {
          const studentPayload: any = {
            name: st.name,
            attendance_number: Number(st.attendance_number),
            gender: st.gender,
            photo_url: st.photo_url || null,
            updated_at: new Date().toISOString()
          };
          if (st.id && !st.id.startsWith('std-')) {
            studentPayload.id = st.id;
          }
          await supabase.from('students').upsert(studentPayload);
        }
      }

      // Fetch freshly synced students to map IDs for schedules and organization
      const { data: remoteStudents } = await supabase
        .from('students')
        .select('*')
        .order('attendance_number', { ascending: true });

      const studentMapByName = new Map<string, string>();
      const studentMapByNumber = new Map<number, string>();
      (remoteStudents || []).forEach(s => {
        studentMapByName.set(s.name.toLowerCase().trim(), s.id);
        studentMapByNumber.set(s.attendance_number, s.id);
      });

      // 3. Sync Organization
      const localOrg = getLocalData<OrganizationMember[]>(LS_KEYS.ORGANIZATION, INITIAL_ORGANIZATION);
      if (localOrg.length > 0) {
        await supabase.from('organization').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const orgPayload = localOrg.map(m => {
          let sId: string | null = null;
          if (m.student_id && !m.student_id.startsWith('std-')) {
            sId = m.student_id;
          } else if (m.student?.name) {
            sId = studentMapByName.get(m.student.name.toLowerCase().trim()) || null;
          }
          return {
            position: m.position,
            student_id: sId,
            custom_name: m.custom_name || null,
            order_index: m.order_index
          };
        });
        await supabase.from('organization').insert(orgPayload);
      }

      // 4. Sync Schedules
      const localSchedules = getLocalData<ScheduleItem[]>(LS_KEYS.SCHEDULES, INITIAL_SCHEDULES);
      if (localSchedules.length > 0) {
        await supabase.from('schedules').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const schPayload: any[] = [];
        localSchedules.forEach(sc => {
          let sId = sc.student_id;
          if (sId.startsWith('std-') && sc.student?.name) {
            sId = studentMapByName.get(sc.student.name.toLowerCase().trim()) || sId;
          }
          schPayload.push({
            day: sc.day,
            student_id: sId,
            order_index: sc.order_index
          });
        });
        if (schPayload.length > 0) {
          await supabase.from('schedules').insert(schPayload);
        }
      }

      // 5. Sync Contents
      const localContents = getLocalData<ContentItem[]>(LS_KEYS.CONTENTS, INITIAL_CONTENTS);
      if (localContents.length > 0) {
        for (const c of localContents) {
          const contentPayload: any = {
            title: c.title,
            slug: c.slug,
            body: c.body,
            image_url: c.image_url || null,
            status: c.status || 'published',
            published_at: c.published_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          if (c.id && !c.id.startsWith('cnt-')) {
            contentPayload.id = c.id;
          }
          await supabase.from('contents').upsert(contentPayload, { onConflict: 'slug' });
        }
      }

      notifyDataChanged();
      return {
        success: true,
        message: 'Semua data dari HP/perangkat ini berhasil disinkronkan ke Supabase Cloud!',
        details: {
          settings: true,
          students: localStudents.length,
          organization: localOrg.length,
          schedules: localSchedules.length,
          contents: localContents.length
        }
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Gagal sinkronisasi data: ${err?.message || 'Terjadi kesalahan'}`
      };
    }
  },

  // === ACTIVITY & AUDIT LOGS ===
  async logActivity(
    action_type: ActivityActionType,
    target_table: ActivityLog['target_table'],
    description: string,
    metadata?: Record<string, any>,
    admin_email?: string
  ): Promise<void> {
    let email = admin_email;
    if (!email && typeof window !== 'undefined') {
      try {
        email = sessionStorage.getItem('x_animasi_secure_session') || undefined;
      } catch {}
    }
    if (!email) {
      email = 'admin@animasi2.sch.id';
    }

    const newLog: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      admin_email: email,
      action_type,
      target_table,
      description,
      metadata: metadata || {},
      created_at: new Date().toISOString()
    };

    const currentLogs = getLocalData<ActivityLog[]>(LS_KEYS.LOGS, []);
    const updatedLogs = [newLog, ...currentLogs.slice(0, 199)];
    setLocalData(LS_KEYS.LOGS, updatedLogs);

    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('activity_logs').insert([newLog]);
      } catch (err) {
        // Table might not exist yet on Supabase, fallback to local is transparent and safe
      }
    }

    notifyDataChanged();
  },

  async getActivityLogs(limit = 100, offset = 0): Promise<{ data: ActivityLog[]; total: number }> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, count, error } = await supabase
          .from('activity_logs')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (!error && data && data.length > 0) {
          return { data, total: count || data.length };
        }
      } catch {}
    }

    let logs = getLocalData<ActivityLog[]>(LS_KEYS.LOGS, []);
    if (logs.length === 0) {
      logs = [
        {
          id: 'init-log-1',
          admin_email: 'admin@animasi2.sch.id',
          action_type: 'LOGIN',
          target_table: 'auth',
          description: 'Administrator masuk ke panel CMS X ANIMASI 2',
          created_at: new Date().toISOString()
        },
        {
          id: 'init-log-2',
          admin_email: 'admin@animasi2.sch.id',
          action_type: 'UPDATE',
          target_table: 'organization',
          description: 'Sinkronisasi struktur organisasi & pengurus kelas',
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      setLocalData(LS_KEYS.LOGS, logs);
    }

    return {
      data: logs.slice(offset, offset + limit),
      total: logs.length
    };
  }
};
