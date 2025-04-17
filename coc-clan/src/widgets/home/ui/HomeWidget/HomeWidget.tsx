'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getClanInfo } from '@/shared/api/clash-of-clans';
import { Clan } from '@/shared/api/types';
import { ClanInfo, ClanMembers } from '@/entities/clan';
import styles from './HomeWidget.module.scss';
import { ApiTokenInfo } from '@/shared/ui/ApiTokenInfo';
import { ConnectionAlert } from '@/shared/ui/ConnectionAlert';

const CLAN_TAG = '#20GL2UPP2';
const CLAN_NAME = 'Лучшие';

export const HomeWidget: React.FC = () => {
  const [clan, setClan] = useState<Clan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchClanData = async () => {
      try {
        setLoading(true);
        setError(null);
        const clanData = await getClanInfo(CLAN_TAG);
        clanData.name = CLAN_NAME;
        setClan(clanData);
      } catch (err) {
        console.error('Ошибка при получении данных о клане:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Не удалось загрузить данные о клане. Пожалуйста, проверьте ваше интернет-соединение и попробуйте снова.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClanData();
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className={styles.homeWidget}>
        <div className={styles.container}>
          <div className={styles.loading}>
            Загрузка данных клана...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.homeWidget}>
        <div className={styles.container}>
          <ConnectionAlert 
            message={error}
            onRetry={handleRetry}
          />
          
          <ApiTokenInfo />
          
          <div className={styles.hero}>
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Добро пожаловать на сайт клана {CLAN_NAME}!</h1>
              <p className={styles.heroSubtitle}>
                Здесь вы сможете найти статистику клана {CLAN_TAG} и его участников.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!clan) {
    return null;
  }

  return (
    <div className={styles.homeWidget}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Добро пожаловать на сайт клана {CLAN_NAME}!</h1>
            <p className={styles.heroSubtitle}>
              Здесь вы найдете полную статистику клана, историю войн и информацию о всех игроках.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/wars" className={`${styles.heroButton} ${styles.primary}`}>
                Войны клана
              </Link>
              <Link href="/players" className={`${styles.heroButton} ${styles.secondary}`}>
                Игроки
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img src={clan.badgeUrls.large} alt={`Эмблема клана ${CLAN_NAME}`} />
          </div>
        </div>

        <section className={styles.statsSection}>
          <h2 className={styles.sectionTitle}>Краткая статистика</h2>
          <div className={styles.quickStats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{clan.memberList.length}</div>
              <div className={styles.statLabel}>Участников</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{clan.clanLevel}</div>
              <div className={styles.statLabel}>Уровень клана</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{clan.warWins}</div>
              <div className={styles.statLabel}>Побед в войнах</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{clan.clanPoints}</div>
              <div className={styles.statLabel}>Очки клана</div>
            </div>
          </div>
        </section>

        <section className={styles.clanInfoSection}>
          <h2 className={styles.sectionTitle}>Информация о клане</h2>
          <ClanInfo clan={clan} />
        </section>

        <section className={styles.membersSection}>
          <h2 className={styles.sectionTitle}>Участники клана</h2>
          <ClanMembers members={clan.memberList} />
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Разделы сайта</h2>
          <div className={styles.navigationCards}>
            <Link href="/wars" className={`${styles.navigationCard} ${styles.wars}`}>
              <div className={styles.cardIcon}>⚔️</div>
              <h3 className={styles.cardTitle}>Клановые войны</h3>
              <p className={styles.cardDescription}>История войн, статистика и достижения</p>
            </Link>
            <Link href="/league" className={`${styles.navigationCard} ${styles.league}`}>
              <div className={styles.cardIcon}>🏆</div>
              <h3 className={styles.cardTitle}>Лига войн кланов</h3>
              <p className={styles.cardDescription}>Текущий сезон и результаты</p>
            </Link>
            <Link href="/games" className={`${styles.navigationCard} ${styles.games}`}>
              <div className={styles.cardIcon}>🎮</div>
              <h3 className={styles.cardTitle}>Игры клана</h3>
              <p className={styles.cardDescription}>Результаты, вклад участников</p>
            </Link>
            <Link href="/players" className={`${styles.navigationCard} ${styles.players}`}>
              <div className={styles.cardIcon}>👥</div>
              <h3 className={styles.cardTitle}>Сравнение игроков</h3>
              <p className={styles.cardDescription}>Статистика, рейтинги, сравнение</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeWidget; 