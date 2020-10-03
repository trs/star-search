import { getSession, signIn } from 'next-auth/client';

export default function GithubLogin({session}) {
  if (session) return null;

  return <>
    <button onClick={() => signIn('github')}>Sign in with Github</button>
  </>
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
