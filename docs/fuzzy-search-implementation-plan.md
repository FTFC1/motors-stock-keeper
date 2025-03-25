# Fuzzy Search Implementation Plan

## Overview

This document outlines the plan for implementing fuzzy search functionality into our application using Fuse.js, which is already included in our dependencies.

## What is Fuzzy Search?

Fuzzy search allows users to find relevant results even when their search terms don't exactly match the target content. It uses approximate string matching algorithms to handle:
- Misspellings
- Partial matches
- Out-of-order terms
- Related terms

## Implementation Steps

### 1. Create a Search Context (Optional)

Create a global search context to manage search state across components:

```tsx
// src/context/SearchContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: any[];
  setSearchResults: (results: any[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, searchResults, setSearchResults }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
```

### 2. Create a Reusable Search Hook

```tsx
// src/hooks/useSearchable.ts
import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

interface UseSearchableProps<T> {
  data: T[];
  options: Fuse.IFuseOptions<T>;
  term?: string;
}

export function useSearchable<T>({ data, options, term = '' }: UseSearchableProps<T>) {
  const [searchTerm, setSearchTerm] = useState(term);

  const fuse = useMemo(() => new Fuse(data, options), [data, options]);

  const results = useMemo(() => {
    if (!searchTerm) return data;
    return fuse.search(searchTerm).map(result => result.item);
  }, [fuse, searchTerm, data]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    search: (term: string) => setSearchTerm(term),
    reset: () => setSearchTerm('')
  };
}
```

### 3. Create a Search Component

```tsx
// src/components/ui/SearchBar.tsx
import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (term: string) => void;
  initialValue?: string;
  className?: string;
}

export function SearchBar({ 
  placeholder = 'Search...',
  onSearch,
  initialValue = '',
  className = ''
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="pl-8"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
```

### 4. Integration with Dashboard

The Dashboard page seems to be a good candidate for implementing fuzzy search as it likely displays lists of data. Let's integrate the search functionality:

```tsx
// Modified Dashboard.tsx (add search functionality)
import { SearchBar } from '@/components/ui/SearchBar';
import { useSearchable } from '@/hooks/useSearchable';

// Inside your Dashboard component
const searchOptions = {
  keys: ['name', 'description', 'category'], // Adjust based on your data model
  threshold: 0.3, // Lower threshold means more strict matching
  includeScore: true,
  includeMatches: true
};

const { searchTerm, setSearchTerm, results } = useSearchable({
  data: yourData, // Your data array
  options: searchOptions
});

// In your JSX
<SearchBar
  placeholder="Search items..."
  onSearch={setSearchTerm}
  initialValue={searchTerm}
  className="mb-4 w-full max-w-md"
/>

// Then use 'results' instead of 'yourData' in your rendering
```

### 5. Applying to Item Lists

For lists of items, you can create a SearchableList component:

```tsx
// src/components/SearchableList.tsx
import React from 'react';
import { useSearchable } from '@/hooks/useSearchable';
import { SearchBar } from '@/components/ui/SearchBar';

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
```

## Advanced Features (Future Implementations)

### 1. Debounced Search

If the data set is large, implement debounced search to improve performance:

```tsx
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

Then update the `useSearchable` hook to use debounced search:

```tsx
// Updated useSearchable.ts
import { useDebounce } from './useDebounce';

// Inside the hook
const debouncedSearchTerm = useDebounce(searchTerm, 300);

// Use debouncedSearchTerm in the results calculation
```

### 2. Highlighted Results

Enhance user experience by highlighting matching parts of search results:

```tsx
// src/components/HighlightedText.tsx
import React from 'react';

interface HighlightProps {
  text: string;
  highlight: string;
  className?: string;
  highlightClassName?: string;
}

export function HighlightedText({
  text,
  highlight,
  className = '',
  highlightClassName = 'bg-yellow-100 dark:bg-yellow-800'
}: HighlightProps) {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, i) => (
        regex.test(part) ? (
          <span key={i} className={highlightClassName}>{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      ))}
    </span>
  );
}
```

### 3. Filter Options

Allow users to refine searches with filters:

```tsx
// src/components/SearchFilter.tsx
import React from 'react';
import { Button } from './ui/button';

interface FilterOption {
  id: string;
  label: string;
}

interface SearchFilterProps {
  options: FilterOption[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

export function SearchFilter({
  options,
  selectedFilters,
  onFilterChange
}: SearchFilterProps) {
  const toggleFilter = (id: string) => {
    if (selectedFilters.includes(id)) {
      onFilterChange(selectedFilters.filter(filter => filter !== id));
    } else {
      onFilterChange([...selectedFilters, id]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 my-2">
      {options.map(option => (
        <Button
          key={option.id}
          variant={selectedFilters.includes(option.id) ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFilter(option.id)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
```

## Implementation Timeline

1. **Day 1**: Set up the search context and basic hooks
2. **Day 2**: Create the search components and integrate with one page as a test
3. **Day 3**: Refine the implementation and add to other parts of the application
4. **Day 4**: Add advanced features like debouncing and highlighted results
5. **Day 5**: Testing and refinement

## Conclusion

This implementation plan provides a comprehensive approach to adding fuzzy search capabilities to our application. By utilizing Fuse.js (which is already installed), we can create a powerful and flexible search system that improves user experience and makes finding content easier, even with imprecise search terms. 