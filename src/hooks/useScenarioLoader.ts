import { useState, useCallback } from 'react';
import { ScenarioSchema, Scenario } from '../schemas/scenarioConfig';

export function useScenarioLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScenario = useCallback(async (scenarioId: string): Promise<Scenario | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/scenarios/${scenarioId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load scenario: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Validate with Zod
      const parsed = ScenarioSchema.parse(data);
      return parsed;
    } catch (err) {
      console.error('Scenario load error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { loadScenario, isLoading, error };
}
