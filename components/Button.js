import styles from './Button.module.css';

export function Button({children, onClick}) {
  return (
    <>
      <button
        className={styles.button}
        style={{
          fontSize: '1rem',
          border: 'none',
          borderRadius: '0.75rem',
          color: '#F7FAFC',
          padding: '1rem 1.25rem',
          textTransform: 'uppercase',
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          cursor: 'pointer'
        }}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
}
