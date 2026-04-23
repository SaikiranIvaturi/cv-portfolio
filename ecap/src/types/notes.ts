export type NoteType = 'card_specific' | 'global' | 'executive' | 'analysis' | 'decision' | 'action_item';
export type NoteVisibility = 'public' | 'role_based' | 'private';
export type NotePriority = 'high' | 'medium' | 'low';

export interface NoteAuthor {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_initials: string;
  avatar_color: string;
}

export interface NoteAttachment {
  id: string;
  filename: string;
  url: string;
  type: string;
  size: number;
}

export interface Note {
  id: string;
  type: NoteType;
  title?: string;
  content: string;
  author: NoteAuthor;
  flash_card_id?: string;
  flash_card_title?: string;
  visibility: NoteVisibility;
  tags: string[];
  priority: NotePriority;
  pinned: boolean;
  is_leadership: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  attachments?: NoteAttachment[];
  mentions?: string[];
  related_notes?: string[];
}

export interface NotesResponse {
  notes: Note[];
  error?: string;
}
