import { Provider as AuthProvider } from 'next-auth/client';
import { GraphQLClient, ClientContext } from 'graphql-hooks';

const client = new GraphQLClient({
  url: 'https://api.github.com/graphql'
})

import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ClientContext.Provider value={client}>
      <AuthProvider session={pageProps.session}>
        <header
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '1rem',
            marginBottom: '1.5rem'
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
                fontSize: '2.25rem',
                fontWeight: 'bold'
              }}
            >Hacktoberfest Stars</h1>
            <p
              style={{
                color: 'rgb(147, 194, 219)'
              }}
            >Your Hacktoberfest-eligible starred repositories ⭐</p>
          </div>
        </header>

        <Component {...pageProps} />

        <footer
          style={{
            height: '1rem'
          }}
        ></footer>
      </AuthProvider>
    </ClientContext.Provider>
  );
}

export default MyApp
