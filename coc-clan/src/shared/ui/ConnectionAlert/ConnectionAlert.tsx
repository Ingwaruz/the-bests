import React from 'react';
import styles from './ConnectionAlert.module.scss';

interface ConnectionAlertProps {
  message: string;
  onRetry: () => void;
}

export const ConnectionAlert: React.FC<ConnectionAlertProps> = ({ message, onRetry }) => {
  return (
    <div className={styles.connectionAlert}>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        <button 
          className={styles.retryButton}
          onClick={onRetry}
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}; 