import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PropertyType } from '@/lib/generated/prisma';

// Search query interface
export interface SearchQuery {
  id: string;
  query: string;
  location?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  timestamp: number;
  resultCount?: number;
}

// Filter preset interface
export interface FilterPreset {
  id: string;
  name: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  isDefault: boolean;
  createdAt: number;
}

// Search suggestion interface
export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'location' | 'property_type' | 'agent' | 'keyword';
  frequency: number;
  lastUsed: number;
}

interface SearchState {
  // Search History
  recentSearches: SearchQuery[];
  searchSuggestions: SearchSuggestion[];
  
  // Filter Presets
  filterPresets: FilterPreset[];
  
  // Current Search State
  currentQuery: string;
  currentFilters: Partial<SearchQuery>;
  isSearching: boolean;
  
  // Settings
  maxHistoryItems: number;
  enableSuggestions: boolean;
  enableHistory: boolean;
  
  // Actions
  addSearch: (query: SearchQuery) => void;
  removeSearch: (id: string) => void;
  clearSearchHistory: () => void;
  
  // Filter Preset Actions
  saveFilterPreset: (preset: Omit<FilterPreset, 'id' | 'createdAt'>) => void;
  deleteFilterPreset: (id: string) => void;
  applyFilterPreset: (id: string) => void;
  
  // Search Suggestions
  addSuggestion: (suggestion: Omit<SearchSuggestion, 'id' | 'frequency' | 'lastUsed'>) => void;
  updateSuggestionFrequency: (text: string) => void;
  clearSuggestions: () => void;
  
  // Current Search State
  setCurrentQuery: (query: string) => void;
  setCurrentFilters: (filters: Partial<SearchQuery>) => void;
  setIsSearching: (searching: boolean) => void;
  clearCurrentSearch: () => void;
  
  // Settings
  updateSettings: (settings: Partial<{
    maxHistoryItems: number;
    enableSuggestions: boolean;
    enableHistory: boolean;
  }>) => void;
  
  // Helper getters
  getRecentLocations: () => string[];
  getPopularFilters: () => FilterPreset[];
  getSearchSuggestions: (query: string) => SearchSuggestion[];
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // Initial state
      recentSearches: [],
      searchSuggestions: [],
      filterPresets: [
        // Default presets
        {
          id: 'preset-apartments',
          name: 'Apartments Under ₦10M',
          type: 'APARTMENT' as PropertyType,
          maxPrice: 10000000,
          isDefault: true,
          createdAt: Date.now(),
        },
        {
          id: 'preset-houses',
          name: 'Family Houses',
          type: 'HOUSE' as PropertyType,
          bedrooms: 3,
          bathrooms: 2,
          isDefault: true,
          createdAt: Date.now(),
        },
      ],
      currentQuery: '',
      currentFilters: {},
      isSearching: false,
      maxHistoryItems: 50,
      enableSuggestions: true,
      enableHistory: true,
      
      // Search History Actions
      addSearch: (query) => 
        set((state) => {
          if (!state.enableHistory) return state;
          
          // Remove duplicate if exists
          const filteredSearches = state.recentSearches.filter(s => 
            s.query !== query.query || 
            s.location !== query.location ||
            s.type !== query.type
          );
          
          // Add new search to beginning
          const newSearches = [
            { ...query, id: generateId(), timestamp: Date.now() },
            ...filteredSearches
          ].slice(0, state.maxHistoryItems);
          
          // Update suggestions
          if (state.enableSuggestions && query.query.trim()) {
            get().addSuggestion({
              text: query.query.trim(),
              type: 'keyword',
            });
          }
          
          if (query.location && state.enableSuggestions) {
            get().addSuggestion({
              text: query.location,
              type: 'location',
            });
          }
          
          return { recentSearches: newSearches };
        }),
      
      removeSearch: (id) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter(s => s.id !== id)
        })),
      
      clearSearchHistory: () =>
        set({ recentSearches: [], searchSuggestions: [] }),
      
      // Filter Preset Actions
      saveFilterPreset: (preset) =>
        set((state) => ({
          filterPresets: [
            ...state.filterPresets,
            {
              ...preset,
              id: generateId(),
              createdAt: Date.now(),
            }
          ]
        })),
      
      deleteFilterPreset: (id) =>
        set((state) => ({
          filterPresets: state.filterPresets.filter(p => p.id !== id && p.isDefault !== true)
        })),
      
      applyFilterPreset: (id) => {
        const preset = get().filterPresets.find(p => p.id === id);
        if (preset) {
          set({
            currentFilters: {
              type: preset.type,
              minPrice: preset.minPrice,
              maxPrice: preset.maxPrice,
              location: preset.location,
              bedrooms: preset.bedrooms,
              bathrooms: preset.bathrooms,
            }
          });
        }
      },
      
      // Search Suggestions
      addSuggestion: (suggestion) =>
        set((state) => {
          if (!state.enableSuggestions) return state;
          
          const existingIndex = state.searchSuggestions.findIndex(s => 
            s.text.toLowerCase() === suggestion.text.toLowerCase() && s.type === suggestion.type
          );
          
          if (existingIndex >= 0) {
            // Update existing suggestion
            const updated = [...state.searchSuggestions];
            updated[existingIndex] = {
              ...updated[existingIndex],
              frequency: updated[existingIndex].frequency + 1,
              lastUsed: Date.now(),
            };
            return { searchSuggestions: updated };
          } else {
            // Add new suggestion
            return {
              searchSuggestions: [
                ...state.searchSuggestions,
                {
                  ...suggestion,
                  id: generateId(),
                  frequency: 1,
                  lastUsed: Date.now(),
                }
              ].slice(0, 100) // Keep only 100 suggestions
            };
          }
        }),
      
      updateSuggestionFrequency: (text) => {
        const suggestion = get().searchSuggestions.find(s => 
          s.text.toLowerCase() === text.toLowerCase()
        );
        if (suggestion) {
          get().addSuggestion({
            text: suggestion.text,
            type: suggestion.type,
          });
        }
      },
      
      clearSuggestions: () =>
        set({ searchSuggestions: [] }),
      
      // Current Search State
      setCurrentQuery: (query) =>
        set({ currentQuery: query }),
      
      setCurrentFilters: (filters) =>
        set((state) => ({
          currentFilters: { ...state.currentFilters, ...filters }
        })),
      
      setIsSearching: (searching) =>
        set({ isSearching: searching }),
      
      clearCurrentSearch: () =>
        set({ 
          currentQuery: '', 
          currentFilters: {},
          isSearching: false 
        }),
      
      // Settings
      updateSettings: (settings) =>
        set((state) => ({ ...state, ...settings })),
      
      // Helper getters
      getRecentLocations: () => {
        const state = get();
        const locations = state.recentSearches
          .map(s => s.location)
          .filter(Boolean)
          .filter((location, index, arr) => arr.indexOf(location) === index)
          .slice(0, 10);
        return locations as string[];
      },
      
      getPopularFilters: () => {
        const state = get();
        return state.filterPresets
          .filter(p => p.isDefault || state.recentSearches.some(s => 
            s.type === p.type && s.minPrice === p.minPrice && s.maxPrice === p.maxPrice
          ))
          .slice(0, 5);
      },
      
      getSearchSuggestions: (query) => {
        const state = get();
        if (!state.enableSuggestions || !query.trim()) return [];
        
        const lowerQuery = query.toLowerCase();
        return state.searchSuggestions
          .filter(s => s.text.toLowerCase().includes(lowerQuery))
          .sort((a, b) => b.frequency - a.frequency || b.lastUsed - a.lastUsed)
          .slice(0, 8);
      },
    }),
    {
      name: 'inspekta-search',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        searchSuggestions: state.searchSuggestions,
        filterPresets: state.filterPresets,
        maxHistoryItems: state.maxHistoryItems,
        enableSuggestions: state.enableSuggestions,
        enableHistory: state.enableHistory,
      }),
      skipHydration: true, // SSR-safe
    }
  )
);

// Selector hooks to prevent unnecessary re-renders
export const useRecentSearches = () => useSearchStore((state) => state.recentSearches);
export const useFilterPresets = () => useSearchStore((state) => state.filterPresets);
export const useCurrentSearch = () => useSearchStore((state) => ({
  query: state.currentQuery,
  filters: state.currentFilters,
  isSearching: state.isSearching,
}));
export const useSearchSettings = () => useSearchStore((state) => ({
  maxHistoryItems: state.maxHistoryItems,
  enableSuggestions: state.enableSuggestions,
  enableHistory: state.enableHistory,
}));

// Action hooks
export const useSearchActions = () => useSearchStore((state) => ({
  addSearch: state.addSearch,
  removeSearch: state.removeSearch,
  clearSearchHistory: state.clearSearchHistory,
  saveFilterPreset: state.saveFilterPreset,
  deleteFilterPreset: state.deleteFilterPreset,
  applyFilterPreset: state.applyFilterPreset,
  setCurrentQuery: state.setCurrentQuery,
  setCurrentFilters: state.setCurrentFilters,
  setIsSearching: state.setIsSearching,
  clearCurrentSearch: state.clearCurrentSearch,
  updateSettings: state.updateSettings,
}));

// Helper hooks
export const useSearchHelpers = () => useSearchStore((state) => ({
  getRecentLocations: state.getRecentLocations,
  getPopularFilters: state.getPopularFilters,
  getSearchSuggestions: state.getSearchSuggestions,
  updateSuggestionFrequency: state.updateSuggestionFrequency,
}));