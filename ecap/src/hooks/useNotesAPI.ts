import { useState, useEffect } from 'react';
import { Note, NotesResponse } from '../types/notes';
import { API_CONFIG } from '../config';

const API_BASE_URL = API_CONFIG.BACKEND_URL;

export async function saveNoteToBackend(note: Partial<Note>): Promise<{ success: boolean; message: string; note?: Note }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error saving note:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to save note',
    };
  }
}

export function useGlobalNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/notes/global`);
        if (!response.ok) throw new Error('Failed to fetch global notes');
        const data: NotesResponse = await response.json();
        setNotes(data.notes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return { notes, loading, error };
}

export function useCardNotes(cardId: string | undefined) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) {
      setNotes([]);
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/notes/card/${cardId}`);
        if (!response.ok) throw new Error('Failed to fetch card notes');
        const data: NotesResponse = await response.json();
        setNotes(data.notes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [cardId]);

  return { notes, loading, error };
}

export function useRecentNotes(limit: number = 10) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/notes/recent?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch recent notes');
        const data: NotesResponse = await response.json();
        setNotes(data.notes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [limit]);

  return { notes, loading, error, refetch: () => setLoading(true) };
}

export function usePinnedNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/notes/pinned`);
        if (!response.ok) throw new Error('Failed to fetch pinned notes');
        const data: NotesResponse = await response.json();
        setNotes(data.notes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return { notes, loading, error };
}

export function useAllNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const [globalRes, recentRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/notes/global`),
          fetch(`${API_BASE_URL}/api/notes/recent?limit=100`)
        ]);
        
        if (!globalRes.ok || !recentRes.ok) {
          throw new Error('Failed to fetch notes');
        }
        
        const globalData: NotesResponse = await globalRes.json();
        const recentData: NotesResponse = await recentRes.json();
        
        // Combine and deduplicate by id
        const allNotesMap = new Map<string, Note>();
        globalData.notes.forEach(note => allNotesMap.set(note.id, note));
        recentData.notes.forEach(note => allNotesMap.set(note.id, note));
        
        // Sort by created_at descending
        const combinedNotes = Array.from(allNotesMap.values())
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        setNotes(combinedNotes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAllNotes();
  }, []);

  const refetch = () => setLoading(true);

  return { notes, loading, error, refetch };
}
