import React, { useState, useEffect } from 'react';
import { useTenantStore } from '@/store/tenantStore';

interface TenantImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string; // The base URL from JSON
  fallbackText?: string;
}

export const TenantImage: React.FC<TenantImageProps> = ({ src, fallbackText, ...props }) => {
  const { currentTenantId } = useTenantStore();
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [errorCount, setErrorCount] = useState(0);

  // Извлекаем только имя файла (например, "hero-ai-core.jpg")
  const filename = src.split('/').pop() || '';

  useEffect(() => {
    setErrorCount(0);
    // Сначала ищем картинку в папке конкретного тенанта
    setCurrentSrc(`/tenants/${currentTenantId}/images/${filename}`);
  }, [src, currentTenantId, filename]);

  const handleError = () => {
    if (errorCount === 0) {
      // Если у тенанта нет своей картинки, берем дефолтную
      setErrorCount(1);
      setCurrentSrc(`/tenants/default/images/${filename}`);
    } else if (errorCount === 1) {
      // Если и дефолтной нет, показываем заглушку
      setErrorCount(2);
      const text = fallbackText || filename.replace('.jpg', '').replace('.png', '');
      setCurrentSrc(`https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(text)}`);
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
