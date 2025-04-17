'use client';

import { useState, useEffect } from 'react';
import { getExternalIp } from '@/shared/utils/ip-checker';

export default function IpCheckPage() {
  const [ip, setIp] = useState<string>('Загрузка...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIp() {
      try {
        const currentIp = await getExternalIp();
        setIp(currentIp);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
        setIp('Не удалось определить');
      }
    }

    fetchIp();
  }, []);

  return (
    <div style={{
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Проверка IP-адреса</h1>
      <div style={{
        marginTop: '20px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#f8f8f8'
      }}>
        <h2>Ваш текущий IP-адрес:</h2>
        <p style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: error ? 'red' : 'green'
        }}>
          {ip}
        </p>
        
        {error && (
          <p style={{ color: 'red' }}>
            Ошибка: {error}
          </p>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <h3>Что делать дальше:</h3>
          <ol>
            <li>Скопируйте ваш IP-адрес: <strong>{ip}</strong></li>
            <li>Перейдите на <a href="https://developer.clashofclans.com/" target="_blank" rel="noopener noreferrer">сайт разработчиков Clash of Clans</a></li>
            <li>Войдите в свой аккаунт</li>
            <li>Перейдите в раздел "My Account" → "API Keys"</li>
            <li>Создайте новый ключ или отредактируйте существующий, добавив ваш текущий IP-адрес</li>
            <li>Скопируйте новый ключ и замените значение в файле .env.local</li>
            <li>Перезапустите приложение</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 