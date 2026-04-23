import { useState, useEffect } from 'react';
import { FlashCard } from '../types';
import { api } from '../services/api';

export function useFlashCards(showFavoritesOnly: boolean = false) {
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFlashCards = async () => {
      try {
        setLoading(true);
        const data = await api.getFlashCards({ favorites_only: showFavoritesOnly });
        if (data?.flashcards && Array.isArray(data.flashcards)) {
          setFlashCards(data.flashcards);
        }
      } catch (error) {
        console.error('Failed to fetch flash cards:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashCards();
  }, [showFavoritesOnly]);

  return { flashCards, loading, setFlashCards };
}
