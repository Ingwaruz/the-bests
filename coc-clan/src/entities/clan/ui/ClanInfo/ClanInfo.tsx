import React from 'react';
import Image from 'next/image';
import { Clan } from '@/shared/api/types';
import styles from './ClanInfo.module.scss';

interface ClanInfoProps {
  clan: Clan;
}

export const ClanInfo: React.FC<ClanInfoProps> = ({ clan }) => {
  if (!clan) {
    return <div>Загрузка данных о клане...</div>;
  }

  return (
    <div className={styles.clanInfo}>
      <div className={styles.header}>
        <div className={styles.badge}>
          <img src={clan.badgeUrls.large} alt={`Эмблема клана ${clan.name}`} />
        </div>
        <div className={styles.details}>
          <h1 className={styles.name}>{clan.name}</h1>
          <div className={styles.tag}>{clan.tag}</div>
          {clan.location && (
            <div className={styles.location}>
              <span>Местоположение:</span> {clan.location.name}
            </div>
          )}
          <p className={styles.description}>{clan.description}</p>
          
          {clan.labels && clan.labels.length > 0 && (
            <div className={styles.labels}>
              {clan.labels.map((label) => (
                <div key={label.id} className={styles.label}>
                  <img src={label.iconUrls.small} alt={label.name} />
                  <span>{label.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statName}>Уровень клана</div>
          <div className={styles.statValue}>{clan.clanLevel}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statName}>Очки клана</div>
          <div className={styles.statValue}>{clan.clanPoints}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statName}>Очки противостояния</div>
          <div className={styles.statValue}>{clan.clanVersusPoints}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statName}>Участники</div>
          <div className={styles.statValue}>{clan.memberList.length}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statName}>Победы в войнах</div>
          <div className={styles.statValue}>{clan.warWins}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statName}>Серия побед</div>
          <div className={styles.statValue}>{clan.warWinStreak}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statName}>Ничьи в войнах</div>
          <div className={styles.statValue}>{clan.warTies}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statName}>Поражения в войнах</div>
          <div className={styles.statValue}>{clan.warLosses}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statName}>Требуемые трофеи</div>
          <div className={styles.statValue}>{clan.requiredTrophies}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statName}>Требуемый TH</div>
          <div className={styles.statValue}>{clan.requiredTownhallLevel}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statName}>Частота войн</div>
          <div className={styles.statValue}>{clan.warFrequency}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statName}>Лига войн</div>
          <div className={styles.statValue}>{clan.warLeague?.name || 'Нет'}</div>
        </div>
      </div>
    </div>
  );
};

export default ClanInfo; 