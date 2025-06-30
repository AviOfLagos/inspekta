'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  MapPin, 
  Search, 
  Home, 
  Trash2, 
  Star,
  Filter,
  X
} from 'lucide-react';
import { useSearchHelpers, useRecentSearches, useFilterPresets, useSearchActions } from '@/stores/search';
import { SearchQuery, FilterPreset } from '@/stores/search';

interface SearchSuggestionsProps {
  query: string;
  onSelectSuggestion: (suggestion: string) => void;
  onSelectSearch: (search: SearchQuery) => void;
  onSelectPreset: (preset: FilterPreset) => void;
  isVisible: boolean;
  onClose: () => void;
}

export function SearchSuggestions({
  query,
  onSelectSuggestion,
  onSelectSearch,
  onSelectPreset,
  isVisible,
  onClose
}: SearchSuggestionsProps) {
  const { getSearchSuggestions, updateSuggestionFrequency } = useSearchHelpers();
  const recentSearches = useRecentSearches();
  const filterPresets = useFilterPresets();
  const { removeSearch, deleteFilterPreset } = useSearchActions();
  
  const [suggestions, setSuggestions] = useState<Array<{
    id: string;
    text: string;
    type: string;
    frequency: number;
  }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      setSuggestions(getSearchSuggestions(query));
    } else {
      setSuggestions([]);
    }
  }, [query, getSearchSuggestions]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const handleSuggestionClick = (suggestion: string) => {
    updateSuggestionFrequency(suggestion);
    onSelectSuggestion(suggestion);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      notation: price >= 1000000 ? 'compact' : 'standard',
    }).format(price);
  };

  const formatSearchDisplay = (search: SearchQuery) => {
    const parts = [];
    if (search.query) parts.push(search.query);
    if (search.location) parts.push(`in ${search.location}`);
    if (search.type) parts.push(search.type.toLowerCase());
    if (search.minPrice || search.maxPrice) {
      if (search.minPrice && search.maxPrice) {
        parts.push(`${formatPrice(search.minPrice)} - ${formatPrice(search.maxPrice)}`);
      } else if (search.minPrice) {
        parts.push(`from ${formatPrice(search.minPrice)}`);
      } else if (search.maxPrice) {
        parts.push(`up to ${formatPrice(search.maxPrice)}`);
      }
    }
    return parts.join(' ');
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'location':
        return <MapPin className="w-4 h-4 text-blue-500" />;
      case 'property_type':
        return <Home className="w-4 h-4 text-green-500" />;
      case 'agent':
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div ref={containerRef} className="absolute top-full left-0 right-0 z-50 mt-1">
      <Card className="shadow-lg border max-h-96 overflow-y-auto">
        <CardContent className="p-0">
          {/* Live Suggestions */}
          {suggestions.length > 0 && (
            <div className="border-b">
              <div className="px-4 py-2 text-sm font-medium text-muted-foreground border-b bg-muted/50">
                Suggestions
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full px-4 py-2 text-left hover:bg-muted/50 flex items-center space-x-3 transition-colors"
                >
                  {getSuggestionIcon(suggestion.type)}
                  <span className="flex-1">{suggestion.text}</span>
                  {suggestion.frequency > 1 && (
                    <Badge variant="secondary" className="text-xs">
                      {suggestion.frequency}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="border-b">
              <div className="px-4 py-2 text-sm font-medium text-muted-foreground border-b bg-muted/50 flex items-center justify-between">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Searches
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Clear all recent searches would need to be implemented
                  }}
                  className="text-xs h-6 px-2"
                >
                  Clear
                </Button>
              </div>
              {recentSearches.slice(0, 5).map((search) => (
                <div
                  key={search.id}
                  className="flex items-center hover:bg-muted/50 transition-colors"
                >
                  <button
                    onClick={() => onSelectSearch(search)}
                    className="flex-1 px-4 py-2 text-left flex items-center space-x-3"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm">{formatSearchDisplay(search)}</div>
                      {search.resultCount && (
                        <div className="text-xs text-muted-foreground">
                          {search.resultCount} results
                        </div>
                      )}
                    </div>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSearch(search.id);
                    }}
                    className="mr-2 h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Filter Presets */}
          {!query.trim() && filterPresets.length > 0 && (
            <div>
              <div className="px-4 py-2 text-sm font-medium text-muted-foreground border-b bg-muted/50 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Quick Filters
              </div>
              {filterPresets.slice(0, 4).map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center hover:bg-muted/50 transition-colors"
                >
                  <button
                    onClick={() => onSelectPreset(preset)}
                    className="flex-1 px-4 py-2 text-left flex items-center space-x-3"
                  >
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{preset.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {preset.type && `${preset.type} • `}
                        {preset.minPrice && `From ${formatPrice(preset.minPrice)} • `}
                        {preset.maxPrice && `Up to ${formatPrice(preset.maxPrice)} • `}
                        {preset.bedrooms && `${preset.bedrooms}+ beds`}
                      </div>
                    </div>
                    {preset.isDefault && (
                      <Badge variant="outline" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </button>
                  {!preset.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFilterPreset(preset.id);
                      }}
                      className="mr-2 h-6 w-6 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!suggestions.length && !recentSearches.length && !filterPresets.length && (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">Start typing to see suggestions</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}