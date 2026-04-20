import { useState, useEffect } from 'react';

interface ReadWork {
  thinkerId: string;
  workTitle: string;
  timestamp: number;
}

export function useReadingProgress() {
  const [readWorks, setReadWorks] = useState<ReadWork[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('political-thinkers-read-works');
    if (stored) {
      try {
        setReadWorks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored reading progress', e);
      }
    }
  }, []);

  const toggleWork = (thinkerId: string, workTitle: string) => {
    setReadWorks(prev => {
      const existing = prev.find(
        w => w.thinkerId === thinkerId && w.workTitle === workTitle
      );

      let newWorks: ReadWork[];
      if (existing) {
        newWorks = prev.filter(
          w => !(w.thinkerId === thinkerId && w.workTitle === workTitle)
        );
      } else {
        newWorks = [...prev, { thinkerId, workTitle, timestamp: Date.now() }];
      }

      localStorage.setItem('political-thinkers-read-works', JSON.stringify(newWorks));
      return newWorks;
    });
  };

  const isWorkRead = (thinkerId: string, workTitle: string): boolean => {
    return readWorks.some(
      w => w.thinkerId === thinkerId && w.workTitle === workTitle
    );
  };

  const clearAll = () => {
    setReadWorks([]);
    localStorage.removeItem('political-thinkers-read-works');
  };

  return {
    readWorks,
    toggleWork,
    isWorkRead,
    clearAll
  };
}
