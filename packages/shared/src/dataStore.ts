import { getSupabase } from './supabaseClient';
import {
  Student,
  OrganizationMember,
  ScheduleItem,
  ContentItem,
  SiteSettings,
  MediaFile
} from './types';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_STUDENTS,
  INITIAL_ORGANIZATION,
  INITIAL_SCHEDULES,
  INITIAL_CONTENTS
} from './mockData';

// Storage keys for local fallback state
const STORAGE_KEYS = {
  STUDENTS: 'x_animasi_students',
  ORGANIZATION: 'x_animasi_organization',
  SCHEDULES: 'x_animasi_schedules',
  CONTENTS: 'x_animasi_contents',
  SETTINGS: 'x_animasi_settings',
  MEDIA: 'x_animasi_media',
  VERSION: 'x_animasi_data_version'
};

const CURRENT_DATA_VERSION = 'v3_36_blank_students';

// Synchronize local storage to current default if version mismatch or initial load
if (typeof window !== 'undefined') {
  try {
    const savedVer = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (savedVer !== CURRENT_DATA_VERSION) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      localStorage.setItem(STORAGE_KEYS.ORGANIZATION, JSON.stringify(INITIAL_ORGANIZATION));
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(INITIAL_SCHEDULES));
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_DATA_VERSION);
    }
  } catch (err) {
    console.warn('LocalStorage version sync error:', err);
  }
}

function getLocal<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
    // Dispatch custom event for real-time reactivity across components
    window.dispatchEvent(new Event('x_animasi_data_changed'));
  } catch (err) {
    console.error('Failed to set local storage:', err);
  }
}

// Data Store Service
export const DataStore = {
  // === SITE SETTINGS ===
  async getSettings(): Promise<SiteSettings> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase fetch error, using local state:', e);
      }
    }
    return getLocal<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings, updated_at: new Date().toISOString() };
    
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('site_settings')
          .upsert(updated, { onConflict: 'id' });
      } catch (e) {
        console.warn('Supabase update failed:', e);
      }
    }

    setLocal(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // === STUDENTS ===
  async getStudents(): Promise<Student[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .order('attendance_number', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase fetch error, using local state:', e);
      }
    }
    return getLocal<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  },

  async addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    const newStudent: Student = {
      ...student,
      id: `std-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('students')
          .insert({
            name: student.name,
            attendance_number: student.attendance_number,
            gender: student.gender,
            photo_url: student.photo_url || null
          })
          .select()
          .single();
        if (!error && data) {
          const list = await this.getStudents();
          setLocal(STORAGE_KEYS.STUDENTS, [...list, data]);
          return data;
        }
      } catch (e) {
        console.warn('Supabase add student error:', e);
      }
    }

    const current = await this.getStudents();
    const updated = [...current, newStudent].sort((a, b) => a.attendance_number - b.attendance_number);
    setLocal(STORAGE_KEYS.STUDENTS, updated);
    return newStudent;
  },

  async updateStudent(id: string, student: Partial<Student>): Promise<Student | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('students')
          .update({
            ...student,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const current = await this.getStudents();
          const updated = current.map(s => (s.id === id ? data : s));
          setLocal(STORAGE_KEYS.STUDENTS, updated);
          return data;
        }
      } catch (e) {
        console.warn('Supabase update student error:', e);
      }
    }

    const current = await this.getStudents();
    let updatedStudent: Student | null = null;
    const updated = current.map(s => {
      if (s.id === id) {
        updatedStudent = { ...s, ...student, updated_at: new Date().toISOString() };
        return updatedStudent;
      }
      return s;
    }).sort((a, b) => a.attendance_number - b.attendance_number);

    setLocal(STORAGE_KEYS.STUDENTS, updated);
    return updatedStudent;
  },

  async deleteStudent(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('students').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete student error:', e);
      }
    }

    const current = await this.getStudents();
    const updated = current.filter(s => s.id !== id);
    setLocal(STORAGE_KEYS.STUDENTS, updated);
    return true;
  },

  // === ORGANIZATION ===
  async getOrganization(): Promise<OrganizationMember[]> {
    const students = await this.getStudents();
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('organization')
          .select('*, student:students(*)')
          .order('order_index', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase org fetch error:', e);
      }
    }

    const rawOrg = getLocal<OrganizationMember[]>(STORAGE_KEYS.ORGANIZATION, INITIAL_ORGANIZATION);
    return rawOrg.map(org => ({
      ...org,
      student: students.find(s => s.id === org.student_id)
    }));
  },

  async updateOrganizationPosition(position: string, studentId: string): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('organization')
          .upsert({ position, student_id: studentId }, { onConflict: 'position' });
      } catch (e) {
        console.warn('Supabase org position update error:', e);
      }
    }

    const current = await this.getOrganization();
    const existingIndex = current.findIndex(o => o.position === position);
    if (existingIndex >= 0) {
      current[existingIndex].student_id = studentId;
    } else {
      current.push({
        id: `org-${Date.now()}`,
        position: position as any,
        student_id: studentId,
        order_index: current.length + 1
      });
    }
    setLocal(STORAGE_KEYS.ORGANIZATION, current);
  },

  // === SCHEDULES (Piket) ===
  async getSchedules(): Promise<ScheduleItem[]> {
    const students = await this.getStudents();
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('schedules')
          .select('*, student:students(*)')
          .order('order_index', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase schedules fetch error:', e);
      }
    }

    const rawSchedules = getLocal<ScheduleItem[]>(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
    return rawSchedules.map(sch => ({
      ...sch,
      student: students.find(s => s.id === sch.student_id)
    }));
  },

  async setDaySchedules(day: string, studentIds: string[]): Promise<void> {
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
      } catch (e) {
        console.warn('Supabase setDaySchedules error:', e);
      }
    }

    const current = await this.getSchedules();
    const otherDays = current.filter(s => s.day !== day);
    const newItems: ScheduleItem[] = studentIds.map((sid, idx) => ({
      id: `sch-${day}-${idx}-${Date.now()}`,
      day: day as any,
      student_id: sid,
      order_index: idx + 1
    }));

    setLocal(STORAGE_KEYS.SCHEDULES, [...otherDays, ...newItems]);
  },

  // === CONTENTS / ANNOUNCEMENTS ===
  async getContents(onlyPublished: boolean = false): Promise<ContentItem[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('contents').select('*').order('created_at', { ascending: false });
        if (onlyPublished) {
          query = query.eq('status', 'published');
        }
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase contents fetch error:', e);
      }
    }

    const list = getLocal<ContentItem[]>(STORAGE_KEYS.CONTENTS, INITIAL_CONTENTS);
    if (onlyPublished) {
      return list.filter(c => c.status === 'published');
    }
    return list;
  },

  async getContentBySlug(slug: string): Promise<ContentItem | null> {
    const contents = await this.getContents();
    return contents.find(c => c.slug === slug) || null;
  },

  async addContent(content: Omit<ContentItem, 'id'>): Promise<ContentItem> {
    const newContent: ContentItem = {
      ...content,
      id: `cnt-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: content.status === 'published' ? new Date().toISOString() : undefined
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contents')
          .insert({
            title: content.title,
            slug: content.slug,
            body: content.body,
            image_url: content.image_url || null,
            status: content.status,
            published_at: newContent.published_at
          })
          .select()
          .single();
        if (!error && data) {
          const list = await this.getContents();
          setLocal(STORAGE_KEYS.CONTENTS, [data, ...list]);
          return data;
        }
      } catch (e) {
        console.warn('Supabase add content error:', e);
      }
    }

    const list = await this.getContents();
    setLocal(STORAGE_KEYS.CONTENTS, [newContent, ...list]);
    return newContent;
  },

  async updateContent(id: string, content: Partial<ContentItem>): Promise<ContentItem | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contents')
          .update({
            ...content,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const list = await this.getContents();
          setLocal(
            STORAGE_KEYS.CONTENTS,
            list.map(c => (c.id === id ? data : c))
          );
          return data;
        }
      } catch (e) {
        console.warn('Supabase update content error:', e);
      }
    }

    const list = await this.getContents();
    let updated: ContentItem | null = null;
    const newList = list.map(c => {
      if (c.id === id) {
        updated = { ...c, ...content, updated_at: new Date().toISOString() };
        return updated;
      }
      return c;
    });

    setLocal(STORAGE_KEYS.CONTENTS, newList);
    return updated;
  },

  async deleteContent(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('contents').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete content error:', e);
      }
    }

    const list = await this.getContents();
    setLocal(
      STORAGE_KEYS.CONTENTS,
      list.filter(c => c.id !== id)
    );
    return true;
  },

  // === MEDIA FILES ===
  async getMediaFiles(): Promise<MediaFile[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.storage.from('class-media').list();
        if (!error && data) {
          const { data: { publicUrl } } = supabase.storage.from('class-media').getPublicUrl('');
          return data.map(item => ({
            id: item.id || item.name,
            name: item.name,
            url: `${publicUrl}/${item.name}`,
            size: item.metadata?.size,
            created_at: item.created_at
          }));
        }
      } catch (e) {
        console.warn('Supabase storage fetch error:', e);
      }
    }

    return getLocal<MediaFile[]>(STORAGE_KEYS.MEDIA, [
      {
        id: 'med-1',
        name: 'hero-banner.jpg',
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
        size: 1024000,
        created_at: new Date().toISOString()
      },
      {
        id: 'med-2',
        name: 'animation-studio.jpg',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        size: 850000,
        created_at: new Date().toISOString()
      }
    ]);
  },

  async uploadMediaFile(file: File): Promise<MediaFile> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const { error } = await supabase.storage.from('class-media').upload(fileName, file);
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('class-media').getPublicUrl(fileName);
          const newMedia: MediaFile = {
            id: fileName,
            name: file.name,
            url: publicUrl,
            size: file.size,
            created_at: new Date().toISOString()
          };
          const current = await this.getMediaFiles();
          setLocal(STORAGE_KEYS.MEDIA, [newMedia, ...current]);
          return newMedia;
        }
      } catch (e) {
        console.warn('Supabase storage upload error:', e);
      }
    }

    // Local Base64 fallback if storage not configured
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newMedia: MediaFile = {
          id: `med-${Date.now()}`,
          name: file.name,
          url: reader.result as string,
          size: file.size,
          created_at: new Date().toISOString()
        };
        this.getMediaFiles().then(current => {
          setLocal(STORAGE_KEYS.MEDIA, [newMedia, ...current]);
          resolve(newMedia);
        });
      };
      reader.readAsDataURL(file);
    });
  },

  async deleteMediaFile(id: string, name?: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase && name) {
      try {
        await supabase.storage.from('class-media').remove([name]);
      } catch (e) {
        console.warn('Supabase storage delete error:', e);
      }
    }

    const current = await this.getMediaFiles();
    setLocal(STORAGE_KEYS.MEDIA, current.filter(m => m.id !== id && m.name !== name));
    return true;
  }
};
