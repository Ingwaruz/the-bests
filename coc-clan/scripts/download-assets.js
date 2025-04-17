// Скрипт для скачивания статических ресурсов
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Создаем директории, если они не существуют
const fontDir = path.join(__dirname, '../public/fonts');
const imageDir = path.join(__dirname, '../public/images');

if (!fs.existsSync(fontDir)) {
  fs.mkdirSync(fontDir, { recursive: true });
  console.log('Создана директория:', fontDir);
}

if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
  console.log('Создана директория:', imageDir);
}

// Функция для скачивания файла
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    // Проверяем, существует ли уже файл
    if (fs.existsSync(dest)) {
      console.log(`Файл уже существует: ${dest}`);
      return resolve();
    }

    console.log(`Скачивание ${url} в ${dest}...`);
    
    // Выбираем протокол в зависимости от URL
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, response => {
      // Проверяем успешность запроса
      if (response.statusCode !== 200) {
        reject(new Error(`Ошибка при скачивании ${url}: ${response.statusCode}`));
        return;
      }

      // Создаем поток для записи файла
      const file = fs.createWriteStream(dest);
      
      // Пишем в файл и завершаем
      response.pipe(file);
      
      file.on('finish', () => {
        file.close(() => {
          console.log(`Успешно скачан: ${dest}`);
          resolve();
        });
      });
      
      file.on('error', err => {
        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest);
        }
        reject(err);
      });
    });
    
    request.on('error', err => {
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
      }
      reject(err);
    });
  });
}

// Файлы, которые нужно скачать
const filesToDownload = [
  {
    url: 'https://raw.githubusercontent.com/niklasramo/supercell-fonts/master/fonts/supercell-magic-webfont.woff2',
    dest: path.join(fontDir, 'supercell-magic.woff2')
  },
  {
    url: 'https://clashofclans.com/uploaded-images-blog/clash-wars-league-thumb.jpg',
    dest: path.join(imageDir, 'war_bg.jpg')
  },
  {
    url: 'https://clashofclans.com/uploaded-images-blog/_1200x630_crop_center-center_82_none/cwl-war-leagues-header.jpg',
    dest: path.join(imageDir, 'league_bg.jpg')
  },
  {
    url: 'https://clashofclans.com/uploaded-images-blog/_1200x630_crop_center-center_82_none/ClanGames_June_blog.jpg',
    dest: path.join(imageDir, 'games_bg.jpg')
  },
  {
    url: 'https://clashofclans.com/uploaded-images-blog/_1200x630_crop_center-center_82_none/clash_of_clans.jpg',
    dest: path.join(imageDir, 'players_bg.jpg')
  }
];

// Последовательно скачиваем все файлы
async function downloadAll() {
  for (const file of filesToDownload) {
    try {
      await downloadFile(file.url, file.dest);
    } catch (error) {
      console.error(`Ошибка при скачивании ${file.url}:`, error.message);
    }
  }
  console.log('Все файлы скачаны!');
}

// Запускаем скачивание
downloadAll(); 