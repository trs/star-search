import { Provider as AuthProvider } from 'next-auth/client';
import { GraphQLClient, ClientContext } from 'graphql-hooks';
import memCache from 'graphql-hooks-memcache';

import '../styles/tailwind.css';

const client = new GraphQLClient({
  url: 'https://api.github.com/graphql',
  cache: memCache()
})

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ClientContext.Provider value={client}>
      <AuthProvider
        session={pageProps.session}
      >
        <Component {...pageProps} />
      </AuthProvider>
    </ClientContext.Provider>
  );
}

export default MyApp
