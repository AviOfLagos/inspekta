'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchSuggestions } from './search-suggestions';
import { 
  useSearchActions, 
  useCurrentSearch, 
  useSearchHelpers,
  SearchQuery,
  FilterPreset 
} from '@/stores/search';
import { Search, X } from 'lucide-react';

interface EnhancedSearchInputProps {
  placeholder?: string;
  onSearch: (query: string, filters: Record<string, any>) => void;
  className?: string;
  showSuggestions?: boolean;
  size?: 'sm' | 'md' | 'lg';
  autoFocus?: boolean;
}

export function EnhancedSearchInput({
  placeholder = "Search properties, locations, or agents...",
  onSearch,
  className = "",
  showSuggestions = true,
  size = 'md',
  autoFocus = false
}: EnhancedSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { query, filters, isSearching } = useCurrentSearch();
  const { 
    setCurrentQuery, 
    setCurrentFilters, 
    setIsSearching, 
    addSearch,
    applyFilterPreset 
  } = useSearchActions();
  const { updateSuggestionFrequency } = useSearchHelpers();

  // Sync with store state
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  // Auto-focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    setCurrentQuery(value);
    
    if (showSuggestions) {
      setIsOpen(value.length > 0 || true); // Always show when focused
    }
  };

  const handleInputFocus = () => {
    if (showSuggestions) {
      setIsOpen(true);
    }
  };

  const handleSearch = (searchQuery?: string) => {
    const queryToSearch = searchQuery || localQuery;
    
    if (!queryToSearch.trim() && !Object.keys(filters).length) return;

    setIsSearching(true);
    
    // Create search record
    const searchRecord: SearchQuery = {
      id: '',
      query: queryToSearch,
      location: filters.location,
      type: filters.type,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      timestamp: Date.now(),
    };

    // Add to search history
    addSearch(searchRecord);
    
    // Update suggestion frequency
    if (queryToSearch.trim()) {
      updateSuggestionFrequency(queryToSearch);
    }

    // Execute search
    onSearch(queryToSearch, filters);
    
    // Close suggestions
    setIsOpen(false);
    
    // Blur input on mobile
    if (inputRef.current) {
      inputRef.current.blur();
    }
    
    setTimeout(() => setIsSearching(false), 500);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setLocalQuery(suggestion);
    setCurrentQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleRecentSearchSelect = (search: SearchQuery) => {
    setLocalQuery(search.query);
    setCurrentQuery(search.query);
    setCurrentFilters({
      location: search.location,
      type: search.type,
      minPrice: search.minPrice,
      maxPrice: search.maxPrice,
      bedrooms: search.bedrooms,
      bathrooms: search.bathrooms,
    });
    handleSearch(search.query);
  };

  const handlePresetSelect = (preset: FilterPreset) => {
    applyFilterPreset(preset.id);
    // Trigger search with preset filters
    setTimeout(() => {
      onSearch(localQuery, {
        type: preset.type,
        minPrice: preset.minPrice,
        maxPrice: preset.maxPrice,
        location: preset.location,
        bedrooms: preset.bedrooms,
        bathrooms: preset.bathrooms,
      });
    }, 100);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalQuery('');
    setCurrentQuery('');
    setCurrentFilters({});
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 text-sm';
      case 'lg':
        return 'h-12 text-lg';
      default:
        return 'h-10';
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`pl-10 pr-12 ${getSizeClasses()} ${localQuery ? 'pr-20' : ''}`}
          disabled={isSearching}
        />
        
        {localQuery && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Button
            onClick={() => handleSearch()}
            disabled={isSearching}
            size="sm"
            className="h-7 px-3"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            ) : (
              'Search'
            )}
          </Button>
        </div>
      </div>

      {showSuggestions && (
        <SearchSuggestions
          query={localQuery}
          onSelectSuggestion={handleSuggestionSelect}
          onSelectSearch={handleRecentSearchSelect}
          onSelectPreset={handlePresetSelect}
          isVisible={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}