import { getSession, signOut } from 'next-auth/client';

export default function GithubLogout({session}) {
  if (!session) return null;

  return <>
    <button onClick={() => signOut('github')}>Sign out</button>
  </>
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
