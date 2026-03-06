import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    if (!text) return;

    const timer = setInterval(() => {
      setDisplayedText((prev) => {
        if (prev.length < text.length) {
          return prev + text.charAt(prev.length);
        }
        clearInterval(timer);
        setIsComplete(true);
        return prev;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isComplete };
};
