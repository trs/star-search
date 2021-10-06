import styles from './Button.module.css';

export function Button({children, onClick}) {
  return (
    <>
      <button
        className={styles.button}
        style={{
          fontSize: '1.25rem',
          border: 'none',
          borderRadius: '2rem',
          color: '#FFFFFF',
          padding: '1rem 2rem',
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          cursor: 'pointer'
        }}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
}
