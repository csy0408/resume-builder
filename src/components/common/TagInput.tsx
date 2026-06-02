import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ tags, onChange, placeholder = '添加标签...' }: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = input.trim();
      if (tag && !tags.includes(tag)) {
        onChange([...tags, tag]);
      }
      setInput('');
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-lg bg-white min-h-[40px] items-center">
      {tags.map((tag) => (
        <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-[var(--color-bg)] rounded text-xs text-gray-700">
          {tag}
          <button
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="text-gray-400 hover:text-red-500 leading-none"
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
      />
    </div>
  );
}
