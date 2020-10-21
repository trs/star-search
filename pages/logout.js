import { getSession, signOut } from 'next-auth/client';

import {Button} from '../components/Button';

export default function GithubLogout({session}) {
  if (!session) return null;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '2rem'
      }}
    >
      <Button onClick={() => signOut('github')}>
        <span>Sign out</span>
      </Button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, {Location: '/login'});
    context.res.end();
  }

  return {
    props: { session }
  }
}
