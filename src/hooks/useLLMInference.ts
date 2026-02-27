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

const GIGACHAT_API_URL = '/api/gigachat/chat/completions'; // Proxy or direct if allowed (usually needs backend)
// For this demo, we will mock GigaChat response since we don't have a backend proxy set up in this environment for GigaChat auth.
// In a real app, this would call a backend endpoint that handles GigaChat OAuth.

async function callGigaChat(prompt: string): Promise<LLMResponse> {
  // Mock delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simple heuristic-based mock response based on prompt content
  const isContract = prompt.includes('договор');
  const isLetter = prompt.includes('письмо');
  
  let mockResponse: LLMResponse;

  if (isContract) {
    mockResponse = {
      status: 'success',
      ai_analysis: {
        severity_score: 2,
        findings: [
          'Сумма договора соответствует лимитам',
          'Реквизиты контрагента проверены (GigaChat)',
          'Рисков не обнаружено'
        ],
        artifact: 'Согласовано GigaChat'
      },
      execution_command: {
        action_id: 'approve',
        comment_to_user: 'Договор проверен GigaChat. Замечаний нет.'
      },
      time_saved_minutes: 12
    };
  } else if (isLetter) {
    mockResponse = {
      status: 'success',
      ai_analysis: {
        severity_score: 8,
        findings: [
          'Найдены грубые ошибки в тоне письма',
          'Отсутствует обязательное приветствие',
          'Грамматические ошибки (GigaChat)'
        ],
        artifact: 'Требуется доработка'
      },
      execution_command: {
        action_id: 'return_to_author',
        comment_to_user: 'Письмо слишком грубое. Пожалуйста, перепишите вежливее.'
      },
      time_saved_minutes: 5
    };
  } else {
    // Default fallback
     mockResponse = {
      status: 'success',
      ai_analysis: {
        severity_score: 0,
        findings: ['Анализ выполнен GigaChat'],
        artifact: 'OK'
      },
      execution_command: {
        action_id: 'approve',
        comment_to_user: 'Все отлично.'
      },
      time_saved_minutes: 1
    };
  }

  return mockResponse;
}

export function useLLMInference() {
  const { geminiApiKey, activeCube } = useAppStore();
  const provider = activeCube.selectedProvider || 'gigachat';

  const infer = useCallback(async (prompt: string): Promise<LLMResponse> => {
    
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 30000)
    );

    try {
      if (provider === 'gigachat') {
         return await Promise.race([callGigaChat(prompt), timeout]);
      } else {
         if (!geminiApiKey) throw new Error('API key not set for Gemini');
         return await Promise.race([callGemini(prompt, geminiApiKey), timeout]);
      }
    } catch (e) {
      // Retry once if not timeout
      if (e instanceof Error && e.message !== 'TIMEOUT') {
        console.warn('LLM call failed, retrying...', e);
        if (provider === 'gigachat') {
             return await Promise.race([callGigaChat(prompt), timeout]);
        } else if (geminiApiKey) {
             return await Promise.race([callGemini(prompt, geminiApiKey), timeout]);
        }
      }
      throw e;
    }
  }, [geminiApiKey, provider]);

  return { infer };
}
