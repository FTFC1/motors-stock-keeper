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