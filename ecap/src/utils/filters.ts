import { FlashCard } from '../types';

export interface FilterState {
  market: string;
  lob: string;
  product: string;
  provider: string;
  search: string;
  priority: string[];
  category: string[];
  status: string[];
  lineOfBusiness: string[];
  minConfidence: number;
  searchQuery: string;
}

export function filterFlashCards(cards: FlashCard[], filters: FilterState, showFavoritesOnly: boolean = false): FlashCard[] {
  return cards.filter(card => {
    // Favorites filter - check localStorage
    if (showFavoritesOnly) {
      const favorites = JSON.parse(localStorage.getItem('favoriteInsights') || '[]');
      // Only show cards that are in the favorites list
      if (!favorites.includes(card.id)) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority.length > 0 && !filters.priority.includes(card.priority)) {
      return false;
    }

    // Category filter
    if (filters.category.length > 0 && !filters.category.includes(card.category)) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(card.status)) {
      return false;
    }

    // Line of Business filter
    if (filters.lineOfBusiness.length > 0 && !filters.lineOfBusiness.includes(card.line_of_business)) {
      return false;
    }

    // Confidence filter
    if (card.confidence < filters.minConfidence) {
      return false;
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = `${card.title} ${card.description} ${card.category}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Market filter
    if (filters.market !== 'all' && card.data_points?.state?.toLowerCase() !== filters.market.toLowerCase()) {
      return false;
    }

    // LOB filter
    if (filters.lob !== 'all' && !card.line_of_business.toLowerCase().includes(filters.lob.toLowerCase())) {
      return false;
    }

    // Product filter
    if (filters.product !== 'all' && card.data_points?.product?.toLowerCase() !== filters.product.toLowerCase()) {
      return false;
    }

    // Provider filter
    if (filters.provider !== 'all' && !card.data_points?.provider?.toLowerCase().includes(filters.provider.toLowerCase())) {
      return false;
    }

    return true;
  });
}

export const defaultFilters: FilterState = {
  market: 'all',
  lob: 'all',
  product: 'all',
  provider: 'all',
  search: '',
  priority: [],
  category: [],
  status: [],
  lineOfBusiness: [],
  minConfidence: 0,
  searchQuery: ''
};
