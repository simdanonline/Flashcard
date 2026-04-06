import { useEffect, useState } from 'react';
import { getDatabase } from '@/lib/database';

export function useDatabase() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    getDatabase().then(() => setIsReady(true));
  }, []);

  return { isReady };
}
