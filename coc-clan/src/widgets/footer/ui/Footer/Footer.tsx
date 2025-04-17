import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss';

// Прямая ссылка на эмблему клана
const CLAN_BADGE_URL = 'https://api-assets.clashofclans.com/badges/512/pO5TQBRlXCw63FWOGbBbvCHjH89Tnh_E-pkzzALQHjQ.png';
const CLAN_NAME = 'Лучшие';
const CLAN_TAG = '#20GL2UPP2';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.logo}>
              <img src={CLAN_BADGE_URL} alt={`Эмблема клана ${CLAN_NAME}`} />
              <div className={styles.logoText}>
                <span className={styles.name}>{CLAN_NAME}</span>
                <span className={styles.tag}>{CLAN_TAG}</span>
              </div>
            </div>
            <p className={styles.description}>
              Статистический портал, посвященный клану {CLAN_TAG} в игре Clash of Clans.
              Здесь вы найдете актуальную информацию о клане, его участниках, войнах и событиях.
            </p>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.title}>Разделы сайта</h3>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link href="/" className={styles.navLink}>Главная</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/wars" className={styles.navLink}>Войны клана</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/league" className={styles.navLink}>Лига войн</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/games" className={styles.navLink}>Игры клана</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/players" className={styles.navLink}>Сравнение игроков</Link>
              </li>
            </ul>
          </div>
          
          <div className={styles.section}>
            <h3 className={styles.title}>Полезные ресурсы</h3>
            <ul className={styles.resourcesList}>
              <li className={styles.resourceItem}>
                <a 
                  href="https://developer.clashofclans.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.resourceLink}
                >
                  API Clash of Clans
                </a>
              </li>
              <li className={styles.resourceItem}>
                <a 
                  href="https://clashofclans.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.resourceLink}
                >
                  Официальный сайт игры
                </a>
              </li>
              <li className={styles.resourceItem}>
                <a 
                  href="https://github.com/user/coc-clan-stats" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.resourceLink}
                >
                  GitHub репозиторий
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <div className={styles.copyright}>
            © {currentYear} Статистика клана {CLAN_TAG}. Все права защищены.
          </div>
          <div className={styles.disclaimer}>
            Этот сайт не связан с Supercell. Clash of Clans является торговой маркой Supercell Oy.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 