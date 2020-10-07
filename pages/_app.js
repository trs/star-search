import Head from 'next/head';
import { Provider as AuthProvider } from 'next-auth/client';
import { GraphQLClient, ClientContext } from 'graphql-hooks';

import '../styles/globals.css';

const client = new GraphQLClient({
  url: 'https://api.github.com/graphql'
});

function MyApp({ Component, pageProps }) {
  return (
    <ClientContext.Provider value={client}>
      <AuthProvider session={pageProps.session}>

        <Head>
          <title>Hacktoberfest Stars</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '1rem'
          }}
        >
          <img
            style={{
              userSelect: 'none'
            }}
            src="Hacktoberfest Stars"
            src="/icon.svg"
            width="100px"
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <h1
              style={{
                color: 'rgb(247, 250, 252)',
                fontSize: 'clamp(1.75rem, 1.1447rem + 2.1053vw, 2.25rem)',
                fontWeight: 'bold'
              }}
            >Hacktoberfest Stars</h1>
            <p
              style={{
                color: 'rgb(147, 194, 219)',
                fontSize: 'clamp(0.75rem, 0.1447rem + 2.1053vw, 1.25rem)',
              }}
            >Your Hacktoberfest-eligible starred repositories</p>
          </div>
        </header>

        <Component {...pageProps} />

        <footer
          style={{
            height: '2.5rem'
          }}
        ></footer>
      </AuthProvider>
    </ClientContext.Provider>
  );
}

export default MyApp
