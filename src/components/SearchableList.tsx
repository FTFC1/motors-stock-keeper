import React from 'react';
import { useSearchable } from '@/hooks/useSearchable';
import { SearchBar } from './ui/SearchBar';

interface SearchableListProps<T> {
  data: T[];
  searchKeys: string[];
  renderItem: (item: T) => React.ReactNode;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function SearchableList<T>({
  data,
  searchKeys,
  renderItem,
  placeholder = 'Search...',
  emptyMessage = 'No items found',
  className = ''
}: SearchableListProps<T>) {
  const searchOptions = {
    keys: searchKeys,
    threshold: 0.3,
    includeScore: true
  };

  const { searchTerm, setSearchTerm, results } = useSearchable({
    data,
    options: searchOptions
  });

  return (
    <div className={className}>
      <SearchBar
        placeholder={placeholder}
        onSearch={setSearchTerm}
        initialValue={searchTerm}
        className="mb-4"
      />
      
      <div className="space-y-2">
        {results.length > 0 ? (
          results.map((item, index) => (
            <div key={index}>
              {renderItem(item)}
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
} 