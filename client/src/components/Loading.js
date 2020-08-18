import React from 'react';
import styles from 'components/Loading.module.css';

function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loading}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Loading;
