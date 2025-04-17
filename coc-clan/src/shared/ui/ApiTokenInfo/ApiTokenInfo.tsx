'use client';

import { useEffect, useState } from 'react';
import { validateIpWithToken } from '@/shared/utils/ip-checker';
import styles from './ApiTokenInfo.module.scss';

interface TokenCheckResult {
  isValid: boolean;
  currentIp: string;
  allowedIps: string[];
  message: string;
  isLoading: boolean;
  error?: string;
}

export const ApiTokenInfo: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenCheckResult>({
    isValid: false,
    currentIp: '',
    allowedIps: [],
    message: '',
    isLoading: true
  });

  useEffect(() => {
    // Убедимся, что код запускается только в браузере
    if (typeof window === 'undefined') return;
    
    let isMounted = true;
    
    async function checkToken() {
      try {
        const result = await validateIpWithToken();
        
        if (isMounted) {
          setTokenInfo({
            ...result,
            isLoading: false
          });
        }
      } catch (error) {
        if (isMounted) {
          setTokenInfo({
            isValid: false,
            currentIp: '',
            allowedIps: [],
            message: 'Ошибка при проверке токена',
            error: error instanceof Error ? error.message : 'Неизвестная ошибка',
            isLoading: false
          });
        }
      }
    }

    checkToken();
    
    // Функция очистки предотвращает обновление состояния размонтированного компонента
    return () => {
      isMounted = false;
    };
  }, []);

  if (tokenInfo.isLoading) {
    return (
      <div className={styles.tokenInfo}>
        <p>Проверка API-ключа и IP-адреса...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.tokenInfo} ${tokenInfo.isValid ? styles.valid : styles.invalid}`}>
      <h3 className={styles.title}>Информация о API-ключе</h3>
      <div className={styles.content}>
        <p className={styles.message}>
          <strong>Статус:</strong> {tokenInfo.isValid ? 'Валидный' : 'Невалидный'}
        </p>
        <p>
          <strong>Текущий IP:</strong> {tokenInfo.currentIp}
        </p>
        <p>
          <strong>Разрешенные IP:</strong> {tokenInfo.allowedIps.length > 0 ? tokenInfo.allowedIps.join(', ') : 'Не указаны'}
        </p>
        <p className={styles.detailedMessage}>
          <strong>Сообщение:</strong> {tokenInfo.message}
        </p>
        
        {tokenInfo.error && (
          <p className={styles.error}>
            <strong>Ошибка:</strong> {tokenInfo.error}
          </p>
        )}
        
        {!tokenInfo.isValid && (
          <div className={styles.instructions}>
            <h4>Что делать, если ваш IP-адрес не в белом списке?</h4>
            <ol>
              <li>Перейдите на <a href="https://developer.clashofclans.com/" target="_blank" rel="noopener noreferrer">официальный сайт разработчиков Clash of Clans</a></li>
              <li>Войдите в свой аккаунт</li>
              <li>Перейдите в раздел "My Account" → "API Keys"</li>
              <li>Создайте новый ключ или отредактируйте существующий, добавив ваш текущий IP-адрес: <strong>{tokenInfo.currentIp}</strong></li>
              <li>Скопируйте новый ключ и замените значение в файле .env.local</li>
              <li>Перезапустите приложение</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}; 