import { getSession, signOut } from 'next-auth/client';

export default function GithubLogout({session}) {
  if (!session) return null;

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
          borderRadius: '0.75rem',
          color: '#F7FAFC',
          padding: '1rem 1.25rem',
          textTransform: 'uppercase',
          backgroundColor: '#0069ff'
        }}
        onClick={() => signOut('github')}
      >Sign out</button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, {Location: '/auth/login'});
    context.res.end();
  }

  return {
    props: { session }
  }
}
