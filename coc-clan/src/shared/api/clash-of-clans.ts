import axios from 'axios';
import { Clan, Player, ClanWar, ClanWarLeague, ClanGames } from './types';

// Базовый URL для Clash of Clans API
const BASE_URL = 'https://api.clashofclans.com/v1';

// Базовый URL для локального прокси
const PROXY_URL = '/api/proxy';

// Токен доступа к API
// ВНИМАНИЕ: Для работы с API вам нужно будет получить свой API-ключ
// на сайте https://developer.clashofclans.com/
const API_TOKEN = process.env.NEXT_PUBLIC_CLASH_OF_CLANS_API_TOKEN || '';

// Проверка наличия токена
if (!API_TOKEN) {
  console.error('NEXT_PUBLIC_CLASH_OF_CLANS_API_TOKEN не настроен. Получите токен на https://developer.clashofclans.com/');
}

// Создаем инстанс axios с предустановленными заголовками и базовым URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  // Настройки для запросов
  timeout: 15000, // 15 секунд таймаут
});

// Создаем инстанс axios для прокси
const proxyApi = axios.create({
  baseURL: PROXY_URL,
  timeout: 15000, // 15 секунд таймаут
});

// Добавляем перехватчик для обработки ошибок прямого API
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API error details:', {
      message: error.message,
      url: error.config?.url,
      hasResponse: !!error.response,
      statusCode: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      hasRequest: !!error.request,
    });
    
    if (error.response) {
      // Ошибка от сервера
      switch (error.response.status) {
        case 403:
          throw new Error('Неверный токен API. Проверьте NEXT_PUBLIC_CLASH_OF_CLANS_API_TOKEN');
        case 404:
          throw new Error('Клан не найден. Проверьте тег клана');
        case 429:
          throw new Error('Превышен лимит запросов к API. Попробуйте позже');
        case 503:
          throw new Error('Сервис временно недоступен. Попробуйте позже');
        default:
          throw new Error(`Ошибка сервера: ${error.response.status} ${error.response.data?.message || error.response.statusText}`);
      }
    } else if (error.request) {
      // Ошибка сети
      throw new Error('Не удалось подключиться к серверу. Проверьте интернет-соединение и проксирование API Clash of Clans');
    } else {
      throw new Error(`Ошибка запроса: ${error.message}`);
    }
  }
);

/**
 * Выполняет запрос к API с использованием фолбека на прокси
 * @param path Путь к API
 * @returns Данные от API
 */
async function fetchWithFallback<T>(path: string): Promise<T> {
  try {
    // Сначала пробуем через прямой запрос к API
    console.log(`Прямой запрос к API: ${path}`);
    const response = await api.get<T>(path);
    return response.data;
  } catch (error) {
    console.error('Ошибка прямого запроса, переключаемся на прокси:', error);
    
    try {
      // Если прямой запрос не удался, используем прокси
      console.log(`Запрос через прокси: ${path}`);
      const proxyResponse = await proxyApi.get<T>('', {
        params: { path }
      });
      return proxyResponse.data;
    } catch (proxyError) {
      console.error('Ошибка запроса через прокси:', proxyError);
      throw proxyError;
    }
  }
}

/**
 * Получить информацию о клане по тегу
 * @param clanTag - тег клана (например, "#20GL2UPP2")
 */
export const getClanInfo = async (clanTag: string): Promise<Clan> => {
  // Заменяем # на %23, так как # является спецсимволом в URL
  const encodedTag = encodeURIComponent(clanTag);
  const path = `/clans/${encodedTag}`;
  
  console.log('Запрос данных о клане:', {
    path,
    tag: clanTag,
    encodedTag,
    hasToken: !!API_TOKEN,
    tokenLength: API_TOKEN.length
  });
  
  try {
    return await fetchWithFallback<Clan>(path);
  } catch (error) {
    console.error('Ошибка при получении информации о клане:', error);
    throw error;
  }
};

/**
 * Получить информацию об игроке по тегу
 * @param playerTag - тег игрока
 */
export const getPlayerInfo = async (playerTag: string): Promise<Player> => {
  const encodedTag = encodeURIComponent(playerTag);
  const path = `/players/${encodedTag}`;
  
  try {
    return await fetchWithFallback<Player>(path);
  } catch (error) {
    console.error('Ошибка при получении информации об игроке:', error);
    throw error;
  }
};

/**
 * Получить информацию о текущей войне клана
 * @param clanTag - тег клана
 */
export const getCurrentWar = async (clanTag: string): Promise<ClanWar> => {
  const encodedTag = encodeURIComponent(clanTag);
  const path = `/clans/${encodedTag}/currentwar`;
  
  try {
    return await fetchWithFallback<ClanWar>(path);
  } catch (error) {
    console.error('Ошибка при получении информации о текущей войне:', error);
    throw error;
  }
};

/**
 * Получить информацию о военном журнале клана
 * @param clanTag - тег клана
 */
export const getWarLog = async (clanTag: string): Promise<{ items: ClanWar[] }> => {
  const encodedTag = encodeURIComponent(clanTag);
  const path = `/clans/${encodedTag}/warlog`;
  
  try {
    return await fetchWithFallback<{ items: ClanWar[] }>(path);
  } catch (error) {
    console.error('Ошибка при получении военного журнала:', error);
    throw error;
  }
};

/**
 * Получить информацию о текущей лиге войн кланов
 * @param clanTag - тег клана
 */
export const getCurrentWarLeague = async (clanTag: string): Promise<ClanWarLeague> => {
  const encodedTag = encodeURIComponent(clanTag);
  const path = `/clans/${encodedTag}/currentwarleague`;
  
  try {
    return await fetchWithFallback<ClanWarLeague>(path);
  } catch (error) {
    console.error('Ошибка при получении информации о лиге войн:', error);
    throw error;
  }
};

/**
 * Получить информацию об играх клана
 * @param clanTag - тег клана
 */
export const getClanGames = async (clanTag: string): Promise<ClanGames> => {
  // Примечание: на момент написания API Clash of Clans 
  // не предоставляет прямого эндпоинта для игр клана.
  // Эта функция является заглушкой и должна быть заменена,
  // если такой эндпоинт появится в будущем.
  
  const encodedTag = encodeURIComponent(clanTag);
  try {
    // В реальности такого эндпоинта нет, поэтому это заглушка
    // const response = await api.get<ClanGames>(`/clans/${encodedTag}/clanGames`);
    // Симулируем ответ для демонстрационных целей
    const mockResponse: ClanGames = {
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      clan: {
        tag: clanTag,
        name: 'Загрузка...',
        badgeUrls: {
          small: '',
          medium: '',
          large: ''
        },
        members: [],
        score: 0
      }
    };
    
    // Получаем реальные данные о клане для заполнения некоторых полей
    const clanInfo = await getClanInfo(clanTag);
    mockResponse.clan.name = clanInfo.name;
    mockResponse.clan.badgeUrls = clanInfo.badgeUrls;
    mockResponse.clan.members = clanInfo.memberList.map(member => ({
      tag: member.tag,
      name: member.name,
      score: Math.floor(Math.random() * 4000) // Случайное количество очков для примера
    }));
    mockResponse.clan.score = mockResponse.clan.members.reduce((sum, member) => sum + member.score, 0);
    
    return mockResponse;
  } catch (error) {
    console.error('Ошибка при получении информации об играх клана:', error);
    throw error;
  }
};

/**
 * Получить список всех участников клана с подробной информацией
 * @param clanTag - тег клана
 */
export const getClanMembers = async (clanTag: string): Promise<Player[]> => {
  try {
    const clan = await getClanInfo(clanTag);
    // Ограничим запросы для тестирования
    const memberPromises = clan.memberList.slice(0, 5).map(member => getPlayerInfo(member.tag));
    return await Promise.all(memberPromises);
  } catch (error) {
    console.error('Ошибка при получении информации об участниках клана:', error);
    throw error;
  }
}; 