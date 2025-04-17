'use client';

import React, { useEffect } from 'react';

// Изображения для разделов сайта
const IMAGES = [
  {
    name: 'war_bg.jpg',
    url: 'https://clashofclans.com/uploaded-images-blog/clash-wars-league-thumb.jpg',
  },
  {
    name: 'league_bg.jpg',
    url: 'https://clashofclans.com/uploaded-images-blog/_1200x630_crop_center-center_82_none/cwl-war-leagues-header.jpg',
  },
  {
    name: 'games_bg.jpg',
    url: 'https://clashofclans.com/uploaded-images-blog/_1200x630_crop_center-center_82_none/ClanGames_June_blog.jpg',
  },
  {
    name: 'players_bg.jpg',
    url: 'https://clashofclans.com/uploaded-images-blog/_1200x630_crop_center-center_82_none/clash_of_clans.jpg',
  },
];

export const LoadImagesFallback: React.FC = () => {
  useEffect(() => {
    const loadImages = async () => {
      // Проверяем наличие изображений и загружаем их при необходимости
      for (const image of IMAGES) {
        try {
          // Проверяем, есть ли уже CSS переменная с URL изображения
          const styleValue = getComputedStyle(document.documentElement)
            .getPropertyValue(`--bg-image-${image.name.replace('.jpg', '')}`)
            .trim();

          // Если переменной нет или она пустая, добавляем стиль с URL изображения
          if (!styleValue) {
            document.documentElement.style.setProperty(
              `--bg-image-${image.name.replace('.jpg', '')}`,
              `url(${image.url})`
            );
            
            console.log(`Загружено изображение: ${image.name}`);
          }
        } catch (error) {
          console.error(`Ошибка при загрузке изображения ${image.name}:`, error);
        }
      }
    };

    loadImages();
  }, []);

  return null; // Этот компонент не рендерит ничего визуально
}; 