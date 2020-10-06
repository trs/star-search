import { getSession, signIn } from 'next-auth/client';

export default function GithubLogin({session}) {
  if (session) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'cetner'
      }}
    >
      <button
        style={{
          fontSize: '1rem',
          border: 'none',
          borderRadius: '0.75rem',
          color: '#F7FAFC',
          padding: '1rem 1.25rem',
          textTransform: 'uppercase',
          backgroundColor: '#0069ff'
        }}
        onClick={() => signIn('github')}
      >Sign in with Github</button>
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    context.res.writeHead(302, {Location: '/'});
    context.res.end();
  }

  return {
    props: { session }
  }
}
