import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';
import { useDebounce } from './useDebounce';

interface UseSearchableProps<T> {
  data: T[];
  options: IFuseOptions<T>;
  term?: string;
  debounceMs?: number;
}

export function useSearchable<T>({ 
  data, 
  options, 
  term = '', 
  debounceMs = 300 
}: UseSearchableProps<T>) {
  const [searchTerm, setSearchTerm] = useState(term);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  const fuse = useMemo(() => new Fuse(data, options), [data, options]);

  const results = useMemo(() => {
    if (!debouncedSearchTerm) return data;
    return fuse.search(debouncedSearchTerm).map(result => result.item);
  }, [fuse, debouncedSearchTerm, data]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    search: (term: string) => setSearchTerm(term),
    reset: () => setSearchTerm('')
  };
} 