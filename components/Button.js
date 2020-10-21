export function Button({children, onClick}) {
  return (
    <>
      <button
        style={{
          fontSize: '1rem',
          border: 'none',
          borderRadius: '0.75rem',
          color: '#F7FAFC',
          padding: '1rem 1.25rem',
          textTransform: 'uppercase',
          backgroundColor: '#0069ff',
          backgroundImage: 'linear-gradient(#3387ff, #0069ff, #0052c7)',
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
