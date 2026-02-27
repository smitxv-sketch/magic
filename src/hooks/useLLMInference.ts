import { useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { LLMResponse, LLMResponseSchema } from '@/schemas/llmResponse';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function callGemini(prompt: string, apiKey: string): Promise<LLMResponse> {
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // Clean markdown
  const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();

  // Parse and Validate
  try {
    const json = JSON.parse(cleaned);
    return LLMResponseSchema.parse(json);
  } catch (e) {
    console.error('Failed to parse LLM response:', rawText);
    throw new Error('Invalid JSON response from LLM');
  }
}

export function useLLMInference() {
  const apiKey = useAppStore(s => s.geminiApiKey);

  const infer = useCallback(async (prompt: string): Promise<LLMResponse> => {
    if (!apiKey) throw new Error('API key not set');

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 30000)
    );

    try {
      return await Promise.race([callGemini(prompt, apiKey), timeout]);
    } catch (e) {
      // Retry once if not timeout
      if (e instanceof Error && e.message !== 'TIMEOUT') {
        console.warn('LLM call failed, retrying...', e);
        return await Promise.race([callGemini(prompt, apiKey), timeout]);
      }
      throw e;
    }
  }, [apiKey]);

  return { infer };
}
