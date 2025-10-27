import { useEffect, useRef } from 'react';

export function useAutosave<T>(
  data: T,
  onSave: (data: T) => Promise<void>,
  delay: number = 30000
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isDirtyRef = useRef(false);

  useEffect(() => {
    isDirtyRef.current = true;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (isDirtyRef.current) {
        onSave(data);
        isDirtyRef.current = false;
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, onSave]);

  return { isDirty: isDirtyRef.current };
}
