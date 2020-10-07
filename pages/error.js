export default function Error() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '2rem',
        gap: '0.5rem'
      }}
    >
      <p
        style={{
          color: 'rgb(247, 250, 252)',
        }}
      >Something went wrong...</p>

      <a href='/'
        style={{
          color: 'rgb(147, 194, 219)',
          textDecoration: 'underline'
        }}
      >Go back</a>
    </div>
  )
}
