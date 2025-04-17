import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ClanMember } from '@/shared/api/types';
import styles from './ClanMembers.module.scss';

interface ClanMembersProps {
  members: ClanMember[];
  itemsPerPage?: number;
}

export const ClanMembers: React.FC<ClanMembersProps> = ({ 
  members,
  itemsPerPage = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof ClanMember>('clanRank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];
      
      // Специальная логика для сортировки по соотношению донатов
      if (sortBy === 'donations') {
        // Используем соотношение донатов/полученных
        const ratioA = a.donations / (a.donationsReceived || 1);
        const ratioB = b.donations / (b.donationsReceived || 1);
        valueA = ratioA;
        valueB = ratioB;
      }
      
      // Специальная логика для ролей
      if (sortBy === 'role') {
        const roleOrder = { 'leader': 0, 'coLeader': 1, 'admin': 2, 'member': 3 };
        valueA = roleOrder[a.role as keyof typeof roleOrder];
        valueB = roleOrder[b.role as keyof typeof roleOrder];
      }
      
      if (valueA === valueB) {
        // Вторичная сортировка по рангу при равенстве
        return a.clanRank - b.clanRank;
      }
      
      // Основная сортировка
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else {
        const numA = Number(valueA);
        const numB = Number(valueB);
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }
    });
  }, [members, sortBy, sortDirection]);
  
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedMembers.slice(startIndex, endIndex);
  }, [sortedMembers, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(members.length / itemsPerPage);
  
  const handleSort = (column: keyof ClanMember) => {
    if (column === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  const getRoleClass = (role: string) => {
    switch (role) {
      case 'leader': return styles.leader;
      case 'coLeader': return styles.coLeader;
      case 'admin': return styles.admin;
      default: return styles.member;
    }
  };
  
  const getRoleName = (role: string) => {
    switch (role) {
      case 'leader': return 'Лидер';
      case 'coLeader': return 'Сооснователь';
      case 'admin': return 'Старейшина';
      default: return 'Участник';
    }
  };
  
  const getSortIndicator = (column: keyof ClanMember) => {
    if (column !== sortBy) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };
  
  const getDonationRatio = (donations: number, received: number) => {
    if (received === 0) return donations > 0 ? '∞' : '0';
    const ratio = donations / received;
    return ratio.toFixed(2);
  };
  
  const getDonationRatioClass = (donations: number, received: number) => {
    if (received === 0) return donations > 0 ? styles.positive : '';
    const ratio = donations / received;
    if (ratio >= 1) return styles.positive;
    if (ratio < 0.5) return styles.negative;
    return '';
  };
  
  if (!members || members.length === 0) {
    return <div>Нет доступных данных о членах клана</div>;
  }
  
  return (
    <div>
      <div className={styles.membersContainer}>
        <table className={styles.membersTable}>
          <thead>
            <tr>
              <th onClick={() => handleSort('clanRank')}>
                Ранг{getSortIndicator('clanRank')}
              </th>
              <th onClick={() => handleSort('name')}>
                Игрок{getSortIndicator('name')}
              </th>
              <th onClick={() => handleSort('role')}>
                Роль{getSortIndicator('role')}
              </th>
              <th onClick={() => handleSort('expLevel')}>
                Уровень{getSortIndicator('expLevel')}
              </th>
              <th onClick={() => handleSort('trophies')}>
                Трофеи{getSortIndicator('trophies')}
              </th>
              <th onClick={() => handleSort('donations')}>
                Донат/Получено{getSortIndicator('donations')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers.map((member) => (
              <tr key={member.tag} className={styles.memberRow}>
                <td>
                  <div className={`${styles.memberRank} ${member.clanRank <= 3 ? styles.top : ''}`}>
                    {member.clanRank}
                  </div>
                </td>
                <td>
                  <div className={styles.memberInfo}>
                    <span className={styles.memberName}>
                      <Link href={`/players/${encodeURIComponent(member.tag)}`}>
                        {member.name}
                      </Link>
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`${styles.memberRole} ${getRoleClass(member.role)}`}>
                    {getRoleName(member.role)}
                  </span>
                </td>
                <td className={styles.highlight}>{member.expLevel}</td>
                <td>
                  <div className={styles.trophiesCell}>
                    {member.trophies}
                    {member.league && (
                      <img 
                        src={member.league.iconUrls.small} 
                        alt={member.league.name} 
                        title={member.league.name}
                      />
                    )}
                  </div>
                </td>
                <td>
                  {member.donations} / {member.donationsReceived}
                  <span className={`${styles.donationRatio} ${getDonationRatioClass(member.donations, member.donationsReceived)}`}>
                    {' '}({getDonationRatio(member.donations, member.donationsReceived)})
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageButton}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button 
            className={styles.pageButton}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => 
              page === 1 || 
              page === totalPages || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            )
            .map((page, index, array) => {
              // Добавляем многоточие для пропусков
              if (index > 0 && page - array[index - 1] > 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <span className={styles.pageButton}>...</span>
                    <button
                      className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              }
              
              return (
                <button
                  key={page}
                  className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              );
            })}
          
          <button 
            className={styles.pageButton}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
          <button 
            className={styles.pageButton}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default ClanMembers; 