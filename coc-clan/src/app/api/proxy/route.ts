import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Базовый URL для Clash of Clans API
const BASE_URL = 'https://api.clashofclans.com/v1';

export async function GET(request: NextRequest) {
  // Получаем API токен из переменных окружения
  const apiToken = process.env.NEXT_PUBLIC_CLASH_OF_CLANS_API_TOKEN;
  
  if (!apiToken) {
    return NextResponse.json(
      { error: 'API-ключ не настроен. Добавьте NEXT_PUBLIC_CLASH_OF_CLANS_API_TOKEN в .env.local' },
      { status: 500 }
    );
  }
  
  // Получаем параметры запроса
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get('path');
  
  if (!path) {
    return NextResponse.json(
      { error: 'Параметр path обязателен' },
      { status: 400 }
    );
  }
  
  try {
    // Формируем URL для запроса к API Clash of Clans
    const url = `${BASE_URL}${path}`;
    
    console.log(`Прокси-запрос к: ${url}`);
    
    // Выполняем запрос к API
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Возвращаем полученные данные
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Ошибка прокси-запроса:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data?.message || error.message;
      
      return NextResponse.json(
        { error: errorMessage },
        { status }
      );
    }
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 