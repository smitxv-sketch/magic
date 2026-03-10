import React, { useState, useEffect } from 'react';
import { useTenantStore } from '@/store/tenantStore';

interface TenantLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export const TenantLogo: React.FC<TenantLogoProps> = ({ fallbackText, ...props }) => {
  const { currentTenantId, tenantConfig } = useTenantStore();
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [attemptIndex, setAttemptIndex] = useState(0);

  // Если в конфиге жестко прописан внешний URL (http/https), используем его
  const isExternalUrl = tenantConfig?.logo?.startsWith('http');
  
  // Извлекаем имя файла из конфига, если оно там есть (например, "/logo-ues.svg" -> "logo-ues")
  // Если нет, по умолчанию ищем "logo"
  const configFilename = tenantConfig?.logo ? tenantConfig.logo.split('/').pop()?.split('.')[0] : 'logo';
  const baseName = configFilename || 'logo';

  // Очередь путей для проверки
  const pathsToTry = isExternalUrl 
    ? [tenantConfig.logo]
    : [
        // Сначала ищем в папке текущего тенанта с разными расширениями
        `/tenants/${currentTenantId}/images/${baseName}.svg`,
        `/tenants/${currentTenantId}/images/${baseName}.png`,
        `/tenants/${currentTenantId}/images/${baseName}.jpg`,
        // Если не нашли, ищем стандартное имя logo.* у текущего тенанта
        `/tenants/${currentTenantId}/images/logo.svg`,
        `/tenants/${currentTenantId}/images/logo.png`,
        `/tenants/${currentTenantId}/images/logo.jpg`,
        // Если не нашли, ищем в папке дефолтного тенанта
        `/tenants/default/images/${baseName}.svg`,
        `/tenants/default/images/${baseName}.png`,
        `/tenants/default/images/${baseName}.jpg`,
        `/tenants/default/images/logo.svg`,
        `/tenants/default/images/logo.png`,
        `/tenants/default/images/logo.jpg`,
      ];

  useEffect(() => {
    setAttemptIndex(0);
    setCurrentSrc(pathsToTry[0]);
  }, [currentTenantId, tenantConfig?.logo]);

  const handleError = () => {
    const nextIndex = attemptIndex + 1;
    if (nextIndex < pathsToTry.length) {
      setAttemptIndex(nextIndex);
      setCurrentSrc(pathsToTry[nextIndex]);
    } else {
      // Если ни один файл не найден, показываем заглушку
      const text = fallbackText || tenantConfig?.name || 'Logo';
      setCurrentSrc(`https://placehold.co/200x80/e2e8f0/64748b?text=${encodeURIComponent(text)}`);
    }
  };

  if (!currentSrc) return null;

  return (
    <img
      src={currentSrc}
      onError={handleError}
      {...props}
    />
  );
};
