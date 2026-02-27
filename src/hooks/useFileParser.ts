import { useState, useCallback } from 'react';
import mammoth from 'mammoth';
// import * as pdfjsLib from 'pdfjs-dist'; // PDF.js setup is complex in browser without worker config. 
// For this demo, we will focus on .docx (mammoth) and plain text.
// If PDF is needed, we can add a simple text extractor or mock it.
// The TZ mentions pdf.js. Let's try to support it if possible, or fallback to text.

export function useFileParser() {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback(async (file: File): Promise<string> => {
    setIsParsing(true);
    setError(null);
    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
      } else if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        return await file.text();
      } else {
        // Fallback or error
        throw new Error('Unsupported file type. Please use .docx or .txt');
      }
    } catch (e) {
      console.error('File parsing error:', e);
      setError(e instanceof Error ? e.message : 'Unknown parsing error');
      throw e;
    } finally {
      setIsParsing(false);
    }
  }, []);

  return { parseFile, isParsing, error };
}
