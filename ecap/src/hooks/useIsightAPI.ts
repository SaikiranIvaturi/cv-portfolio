import { useState, useEffect } from 'react';
import { FlashCard } from '../types';
import { API_CONFIG } from '../config';

const API_BASE_URL = API_CONFIG.BACKEND_URL;

export function useInsightsAPI() {
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlashCards() {
      try {
        setLoading(true);
        console.log(' Fetching insights from:', `${API_BASE_URL}/api/auto-detected-cost-insights`);
        
        const response = await fetch(`${API_BASE_URL}/api/auto-detected-cost-insights`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(' API Response:', data);

        // Extract insights array from response
        const insights = data.insights || [];
        console.log(` Loaded ${insights.length} insights from API`);
        
        setFlashCards(insights);
        setError(null);
      } catch (err) {
        console.error(' Error fetching flash cards:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch insights');
        // Fallback to empty array on error
        setFlashCards([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFlashCards();
  }, []);

  const toggleFavorite = async (cardId: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/flash-cards/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcard_id: cardId,
          is_favorite: isFavorite,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setFlashCards(prev => 
        prev.map(card => 
          card.id === cardId ? { ...card, is_favorite: isFavorite } : card
        )
      );

      return true;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      return false;
    }
  };

  return { flashCards, loading, error, toggleFavorite };
}
