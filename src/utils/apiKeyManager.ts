export const getApiKey = (): string | null => {
  return localStorage.getItem('GEMINI_API_KEY');
};

export const setApiKey = (key: string): void => {
  localStorage.setItem('GEMINI_API_KEY', key);
};

export const removeApiKey = (): void => {
  localStorage.removeItem('GEMINI_API_KEY');
};
