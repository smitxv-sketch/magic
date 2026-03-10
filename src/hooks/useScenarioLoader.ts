import { useState, useCallback } from 'react';
import { Scenario } from '../schemas/scenarioConfig';
import { useTenantStore } from '@/store/tenantStore';

export function useScenarioLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadScenario = useCallback(async (scenarioId: string): Promise<Scenario | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { scenarios } = useTenantStore.getState();
      const scenario = scenarios.find(s => s.scenario_id === scenarioId);
      
      if (!scenario) {
        throw new Error(`Scenario not found: ${scenarioId}`);
      }
      
      return scenario;
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
