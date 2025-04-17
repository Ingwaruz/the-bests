/**
 * Полифилы для функций, которые могут быть недоступны в Next.js
 * Например, atob и btoa не работают на стороне сервера
 */

export function safeAtob(base64: string): string {
  if (!base64) return '';
  
  // Удаляем возможные символы-подстановки, которые могут присутствовать в base64
  const cleanedBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  
  try {
    // Проверяем, выполняется ли код на стороне клиента
    if (typeof window !== 'undefined') {
      // Используем нативный atob в браузере
      return window.atob(cleanedBase64);
    } else {
      // На сервере используем полифил
      return Buffer.from(cleanedBase64, 'base64').toString('binary');
    }
  } catch (e) {
    console.error('Ошибка при декодировании base64:', e);
    return '';
  }
}

export function safeBtoa(text: string): string {
  if (!text) return '';
  
  try {
    // Проверяем, выполняется ли код на стороне клиента
    if (typeof window !== 'undefined') {
      // Используем нативный btoa в браузере
      return window.btoa(text);
    } else {
      // На сервере используем полифил
      return Buffer.from(text, 'binary').toString('base64');
    }
  } catch (e) {
    console.error('Ошибка при кодировании base64:', e);
    return '';
  }
} 