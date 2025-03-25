import Fuse, { FuseOptionKey, IFuseOptions } from 'fuse.js';

// Default search options
const defaultOptions = {
  isCaseSensitive: false,
  includeScore: true,
  shouldSort: true,
  includeMatches: true,
  findAllMatches: false,
  minMatchCharLength: 1,
  location: 0,
  threshold: 0.3,
  distance: 100,
  useExtendedSearch: false,
  ignoreLocation: false,
  ignoreFieldNorm: false,
  fieldNormWeight: 1,
};

// Generic fuzzy search function
export function createFuzzySearch<T>(
  items: T[],
  keys: FuseOptionKey<T>[],
  customOptions: Partial<IFuseOptions<T>> = {}
) {
  const options: IFuseOptions<T> = {
    ...defaultOptions,
    keys,
    ...customOptions,
  };

  return new Fuse(items, options);
}

// Search with highlighting
export function searchWithHighlight<T>(
  fuse: Fuse<T>,
  pattern: string,
  limit?: number
): {
  item: T;
  highlights: { key: string; matches: string[] }[];
  score: number;
}[] {
  const results = fuse.search(pattern, { limit });
  
  return results.map(({ item, matches, score }) => ({
    item,
    highlights: matches?.map(match => ({
      key: match.key as string,
      matches: match.indices.map(([start, end]) => {
        const text = match.value as string;
        return text.substring(start, end + 1);
      }),
    })) || [],
    score: score || 1,
  }));
}

// Helper to highlight matched text
export function highlightText(text: string, matches: string[]): string {
  let highlighted = text;
  matches.forEach(match => {
    highlighted = highlighted.replace(
      new RegExp(match, 'gi'),
      `<mark class="bg-yellow-200 dark:bg-yellow-800">${match}</mark>`
    );
  });
  return highlighted;
}

// Create search index for common fields
export function createSearchIndex<T extends Record<string, any>>(
  items: T[],
  searchableFields: string[]
): Fuse<T> {
  return createFuzzySearch(
    items,
    searchableFields.map(field => ({ name: field, weight: 1 }))
  );
} 