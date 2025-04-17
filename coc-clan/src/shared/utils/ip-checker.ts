import axios from 'axios';
import { safeAtob } from './polyfills';

/**
 * Получает текущий внешний IP-адрес
 * @returns Promise с текущим внешним IP-адресом
 */
export async function getExternalIp(): Promise<string> {
  try {
    // Проверяем, выполняется ли код на стороне клиента
    if (typeof window === 'undefined') {
      return '0.0.0.0'; // Заглушка для SSR
    }
    
    // Используем публичное API для определения IP
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Ошибка при получении внешнего IP:', error);
    return '0.0.0.0'; // Заглушка при ошибке
  }
}

/**
 * Проверяет, совпадает ли текущий IP с тем, что указан в белом списке API-ключа
 * @param token JWT токен API Clash of Clans
 * @returns Объект с результатом проверки
 */
export function checkIpInToken(token: string): { 
  isValid: boolean;
  allowedIps: string[];
  currentIp?: string;
  message: string;
} {
  if (!token) {
    return {
      isValid: false,
      allowedIps: [],
      message: 'API-ключ отсутствует'
    };
  }
  
  try {
    // Разбираем JWT токен (он состоит из трех частей, разделенных точками)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { 
        isValid: false, 
        allowedIps: [],
        message: 'Неверный формат токена API' 
      };
    }

    // Декодируем вторую часть (payload) токена
    const payload = JSON.parse(safeAtob(parts[1]));
    
    // Ищем информацию о разрешенных IP-адресах
    const limits = payload.limits || [];
    const ipLimit = limits.find((limit: any) => limit.type === 'client');
    
    if (!ipLimit || !ipLimit.cidrs || ipLimit.cidrs.length === 0) {
      return { 
        isValid: false, 
        allowedIps: [],
        message: 'В токене не указаны разрешенные IP-адреса' 
      };
    }

    return {
      isValid: true,
      allowedIps: ipLimit.cidrs,
      message: 'Разрешенные IP-адреса получены'
    };
  } catch (error) {
    console.error('Ошибка при проверке IP в токене:', error);
    return { 
      isValid: false, 
      allowedIps: [],
      message: 'Ошибка при анализе токена API' 
    };
  }
}

/**
 * Полная проверка IP-адреса с токеном
 * @returns Объект с результатом проверки
 */
export async function validateIpWithToken(): Promise<{
  isValid: boolean;
  currentIp: string;
  allowedIps: string[];
  message: string;
}> {
  // Проверяем, выполняется ли код на стороне клиента
  if (typeof window === 'undefined') {
    return {
      isValid: false,
      currentIp: '0.0.0.0',
      allowedIps: [],
      message: 'Проверка возможна только на стороне клиента'
    };
  }
  
  try {
    // Получаем текущий IP
    const currentIp = await getExternalIp();
    
    // Получаем токен из переменных окружения
    const token = process.env.NEXT_PUBLIC_CLASH_OF_CLANS_API_TOKEN || '';
    
    // Проверяем токен
    const tokenCheck = checkIpInToken(token);
    
    // Проверяем, есть ли текущий IP в списке разрешенных
    const isIpAllowed = tokenCheck.allowedIps.includes(currentIp);
    
    return {
      isValid: isIpAllowed,
      currentIp,
      allowedIps: tokenCheck.allowedIps,
      message: isIpAllowed 
        ? 'IP-адрес валиден и находится в белом списке' 
        : `Текущий IP-адрес (${currentIp}) не найден в белом списке (${tokenCheck.allowedIps.join(', ')})`
    };
  } catch (error) {
    console.error('Ошибка при валидации IP с токеном:', error);
    return {
      isValid: false,
      currentIp: 'неизвестно',
      allowedIps: [],
      message: `Ошибка при проверке IP: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
    };
  }
} 