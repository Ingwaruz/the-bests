'use client';

import { useState, useEffect } from 'react';
import { safeAtob } from '@/shared/utils/polyfills';

export default function DebugPage() {
  const [token, setToken] = useState<string>('');
  const [decodedPayload, setDecodedPayload] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Получаем токен из переменных окружения при загрузке страницы
  useEffect(() => {
    const envToken = process.env.NEXT_PUBLIC_CLASH_OF_CLANS_API_TOKEN || '';
    setToken(envToken);
    
    if (envToken) {
      decodeToken(envToken);
    }
  }, []);

  // Декодируем токен
  const decodeToken = (tokenValue: string) => {
    try {
      setError(null);
      
      const parts = tokenValue.split('.');
      if (parts.length !== 3) {
        setError('Неверный формат токена API (должен содержать 3 части, разделенные точками)');
        return;
      }

      const decoded = JSON.parse(safeAtob(parts[1]));
      setDecodedPayload(decoded);
    } catch (err) {
      setError(`Ошибка при декодировании токена: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
      setDecodedPayload(null);
    }
  };

  // Обработчик изменения токена
  const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newToken = e.target.value;
    setToken(newToken);
    
    if (newToken) {
      decodeToken(newToken);
    } else {
      setDecodedPayload(null);
    }
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Отладка API-ключа Clash of Clans</h1>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Ваш токен API:</h2>
        <textarea
          value={token}
          onChange={handleTokenChange}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '10px',
            fontFamily: 'monospace',
            marginBottom: '15px',
            borderRadius: '5px',
            border: '1px solid #ddd'
          }}
          placeholder="Вставьте ваш JWT токен API Clash of Clans"
        />
      </div>
      
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '5px',
          marginBottom: '15px'
        }}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}
      
      {decodedPayload && (
        <div style={{ marginTop: '20px' }}>
          <h2>Декодированные данные:</h2>
          <div style={{
            backgroundColor: '#f3f3f3',
            padding: '15px',
            borderRadius: '5px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            overflowX: 'auto'
          }}>
            {JSON.stringify(decodedPayload, null, 2)}
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h3>Разрешенные IP-адреса:</h3>
            {decodedPayload.limits?.find((l: any) => l.type === 'client')?.cidrs ? (
              <ul style={{ fontFamily: 'monospace' }}>
                {decodedPayload.limits.find((l: any) => l.type === 'client').cidrs.map((ip: string, index: number) => (
                  <li key={index}>{ip}</li>
                ))}
              </ul>
            ) : (
              <p>Не найдены разрешенные IP-адреса в токене</p>
            )}
          </div>
          
          <div style={{ marginTop: '30px' }}>
            <h3>Срок действия токена:</h3>
            <p>
              {decodedPayload.iat && (
                <div>Создан: {new Date(decodedPayload.iat * 1000).toLocaleString()}</div>
              )}
              {decodedPayload.exp && (
                <div>Истекает: {new Date(decodedPayload.exp * 1000).toLocaleString()}</div>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 