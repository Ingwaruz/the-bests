import React, { ReactNode } from 'react';
import styles from './Card.module.scss';

export type CardVariant = 'primary' | 'war' | 'league' | 'games';

interface CardProps {
  title?: string;
  children: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
  variant?: CardVariant;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  icon,
  footer,
  variant = 'primary',
  className,
}) => {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className || ''}`}>
      {(title || icon) && (
        <div className={styles.header}>
          {icon && <div className={styles.icon}>{icon}</div>}
          {title && <h3 className={styles.title}>{title}</h3>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
};

export default Card; 