import { useState, useEffect } from 'react';

function useDebouncedSearch<T>(searchTerm: string, delay: number, searchCallback: (term: string) => T) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchCallback(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchCallback]);

  return debouncedSearchTerm;
}

export default useDebouncedSearch;
