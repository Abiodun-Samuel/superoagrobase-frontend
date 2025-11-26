'use client'
import { useCallback, useState } from 'react';

const useQueryParams = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || defaultValue;
  });

  const updateValue = useCallback(
    (newValue) => {
      setValue(newValue);
      const params = new URLSearchParams(window.location.search);
      params.set(key, newValue);
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}?${params}`
      );
    },
    [key]
  );

  return [value, updateValue];
};
export default useQueryParams;
