import { useEffect } from 'react';
import { useTenantStore } from '@/store/tenantStore';

export const useTenantInitializer = () => {
  const { loadTenant, currentTenantId, config } = useTenantStore();

  useEffect(() => {
    // 1. Попытка определить тенант из URL (query param ?org=...)
    const params = new URLSearchParams(window.location.search);
    const orgParam = params.get('org');
    
    // 2. Если в URL ничего нет, берем дефолтный (default)
    const targetTenant = orgParam || 'default';

    // 3. Загружаем, если еще не загружен или отличается
    if (!config || currentTenantId !== targetTenant) {
      loadTenant(targetTenant);
    }
  }, []);

  return {
    isLoading: !config,
    tenantConfig: config
  };
};
