'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';
import Image from 'next/image';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Войны клана', href: '/wars' },
  { label: 'Лига войн', href: '/league' },
  { label: 'Игры клана', href: '/games' },
  { label: 'Сравнение игроков', href: '/players' },
];

const CLAN_TAG = '#20GL2UPP2';
const CLAN_NAME = 'Лучшие';
// Прямая ссылка на эмблему клана
const CLAN_BADGE_URL = 'https://api-assets.clashofclans.com/badges/512/pO5TQBRlXCw63FWOGbBbvCHjH89Tnh_E-pkzzALQHjQ.png';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  
  useEffect(() => {
    // Проверка наличия куки согласия
    const hasConsentCookie = document.cookie.split(';').some(cookie => 
      cookie.trim().startsWith('cookie-consent=')
    );
    
    if (hasConsentCookie) {
      setShowCookieConsent(false);
    }
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const acceptCookies = () => {
    // Устанавливаем куки на 1 год
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    document.cookie = `cookie-consent=true; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    setShowCookieConsent(false);
  };
  
  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <div className={styles.clanEmblem}>
              <img 
                src={CLAN_BADGE_URL} 
                alt={`Эмблема клана ${CLAN_NAME}`} 
                width="70" 
                height="70" 
              />
            </div>
          </Link>
          
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li 
                  key={item.href} 
                  className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                >
                  <Link 
                    href={item.href} 
                    className={`${styles.navLink} ${pathname === item.href ? styles.active : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <button className={styles.mobileButton} onClick={toggleMobileMenu}>
            ☰
          </button>
          
          <div className={`${styles.mobileNav} ${mobileMenuOpen ? styles.open : ''}`}>
            <button className={styles.mobileNavClose} onClick={closeMobileMenu}>
              ✕
            </button>
            <ul className={styles.mobileNavList}>
              {navItems.map((item) => (
                <li 
                  key={item.href} 
                  className={styles.mobileNavItem}
                >
                  <Link 
                    href={item.href} 
                    className={`${styles.mobileNavLink} ${pathname === item.href ? styles.active : ''}`}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
      
      {showCookieConsent && (
        <div className={styles.cookieConsent}>
          <div className={styles.cookieContent}>
            <p>Мы используем cookies для улучшения работы сайта и анализа трафика. Продолжая использовать сайт, вы соглашаетесь с нашей политикой использования cookies.</p>
            <button className={styles.cookieButton} onClick={acceptCookies}>
              Принять
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 