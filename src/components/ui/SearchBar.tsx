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