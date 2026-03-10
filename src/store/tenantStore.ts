import { create } from 'zustand';
import { Scenario } from '@/schemas/scenarioConfig';

// Типы для конфигурации тенанта
export interface TenantConfig {
  id: string;
  name: string;
  logo: string;
  products: {
    [productId: string]: {
      theme: {
        primary: string;
        secondary: string;
        surface: string;
      };
      features: {
        shadow_mode: boolean;
      };
    };
  };
}

export interface PresentationContent {
  meta: any;
  blocks: any[];
}

interface TenantState {
  currentTenantId: string;
  currentProductId: string;
  config: TenantConfig | null;
  presentation: PresentationContent | null;
  scenarios: Scenario[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadTenant: (tenantId: string, productId?: string) => Promise<void>;
}

// Дефолтный конфиг (теперь указывает на общий продукт)
const DEFAULT_TENANT_ID = 'default';
const DEFAULT_PRODUCT_ID = 'magic_cube';

export const useTenantStore = create<TenantState>((set, get) => ({
  currentTenantId: DEFAULT_TENANT_ID,
  currentProductId: DEFAULT_PRODUCT_ID,
  config: null,
  presentation: null,
  scenarios: [],
  isLoading: false,
  error: null,

  loadTenant: async (tenantId: string, productId: string = DEFAULT_PRODUCT_ID) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log(`[TenantManager] Loading tenant: ${tenantId}, product: ${productId}`);

      let configData;
      let presentationData;
      let scenariosModule;

      // Динамический импорт в зависимости от tenantId
      // В Vite динамические импорты должны быть явными или использовать glob
      if (tenantId === 'ues') {
        configData = await import('@/data/tenants/ues/config.json');
        presentationData = await import('@/data/tenants/ues/magic_cube/presentation.json');
        scenariosModule = await import('@/data/tenants/ues/magic_cube/scenarios.ts');
      } else if (tenantId === 'default') {
        configData = await import('@/data/tenants/default/config.json');
        presentationData = await import('@/data/tenants/default/magic_cube/presentation.json');
        scenariosModule = await import('@/data/tenants/default/magic_cube/scenarios.ts');
      } else {
        // Fallback to default if tenant not found
        console.warn(`Tenant '${tenantId}' not found, falling back to default`);
        configData = await import('@/data/tenants/default/config.json');
        presentationData = await import('@/data/tenants/default/magic_cube/presentation.json');
        scenariosModule = await import('@/data/tenants/default/magic_cube/scenarios.ts');
      }

      set({
        currentTenantId: tenantId,
        currentProductId: productId,
        config: configData.default || configData,
        presentation: presentationData.default || presentationData,
        scenarios: scenariosModule.scenarios,
        isLoading: false
      });

      console.log(`[TenantManager] Successfully loaded ${tenantId}`);

    } catch (err: any) {
      console.error('[TenantManager] Failed to load tenant:', err);
      set({ 
        isLoading: false, 
        error: `Failed to load configuration for ${tenantId}: ${err.message}` 
      });
    }
  }
}));
