export interface Student {
  id: string;
  name: string;
  attendance_number: number;
  gender: 'L' | 'P';
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export type ClassPosition =
  | 'Wali Kelas'
  | 'Ketua'
  | 'Wakil Ketua'
  | 'Sekretaris'
  | 'Bendahara'
  | 'Bumas 1'
  | 'Bumas 2'
  | 'MPK 1'
  | 'MPK 2';

export interface OrganizationMember {
  id: string;
  position: ClassPosition;
  student_id: string;
  custom_name?: string;
  student?: Student;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat';

export interface ScheduleItem {
  id: string;
  day: DayOfWeek;
  student_id: string;
  student?: Student;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export type ContentStatus = 'draft' | 'published';

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  body: string;
  image_url?: string;
  status: ContentStatus;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: string;
  class_name: string;
  description: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  footer_text: string;
  updated_at?: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size?: number;
  created_at?: string;
}
