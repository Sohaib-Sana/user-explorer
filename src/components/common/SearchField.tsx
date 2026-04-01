import { Button, Flex, Input } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LuX } from 'react-icons/lu';

interface SearchFieldProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear: () => void;
  debounceDelay?: number;
}

export default function SearchField({
  placeholder = 'Search...',
  onSearch,
  onClear,
  debounceDelay = 500,
}: SearchFieldProps) {
  const [value, setValue] = useState('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer for debounced search
      debounceTimerRef.current = setTimeout(() => {
        if (newValue.trim()) {
          onSearch(newValue.trim());
        } else {
          onClear();
        }
      }, debounceDelay);
    },
    [onSearch, onClear, debounceDelay]
  );

  const handleClear = useCallback(() => {
    setValue('');
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onClear();
  }, [onClear]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <Flex gap={3} width="100%">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        flex={1}
      />
      <Button
        onClick={handleClear}
        colorPalette="gray"
        variant="outline"
        disabled={!value}
      >
        <LuX />
        Clear
      </Button>
    </Flex>
  );
}
