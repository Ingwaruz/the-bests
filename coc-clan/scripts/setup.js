const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Пути к директориям
const fontDir = path.join(__dirname, '../public/fonts');
const imageDir = path.join(__dirname, '../public/images');
const nextDir = path.join(__dirname, '../.next');

// Создаем необходимые директории
console.log('Создаю необходимые директории...');
[fontDir, imageDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Создана директория: ${dir}`);
  }
});

// Проверяем, существует ли .next и очищаем при необходимости
if (fs.existsSync(nextDir)) {
  try {
    console.log('Удаляю кэш Next.js...');
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('Кэш Next.js успешно удален');
  } catch (error) {
    console.error('Не удалось удалить .next:', error.message);
    console.log('Попробуйте закрыть все процессы Node.js и запустить снова');
  }
}

// Создаем заглушки для файлов
const placeholder = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

// Файлы для создания заглушек
const files = [
  path.join(fontDir, 'supercell-magic.woff2'),
  path.join(imageDir, 'war_bg.jpg'),
  path.join(imageDir, 'league_bg.jpg'),
  path.join(imageDir, 'games_bg.jpg'),
  path.join(imageDir, 'players_bg.jpg')
];

console.log('Создаю заглушки для статических файлов...');
files.forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, placeholder);
    console.log(`Создана заглушка: ${file}`);
  }
});

// Запускаем dev-сервер
console.log('Запускаю сервер разработки...');
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Ошибка при запуске сервера:', error.message);
} 