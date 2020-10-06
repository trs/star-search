import { getSession, signOut } from 'next-auth/client';

export default function GithubLogout({session}) {
  if (!session) return null;

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
