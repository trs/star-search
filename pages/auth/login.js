import { getSession, signIn } from 'next-auth/client';

export default function GithubLogin({session}) {
  if (session) return null;

  return (
    <div
      className="
        flex
        justify-center
        items-center
      "
    >
      <button
        className="
          rounded-lg
          text-gray-100
          px-6
          py-4
          uppercase
        "
        style={{
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
