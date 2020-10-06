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
      <AuthProvider session={pageProps.session}>
        <header
          className="
            flex
            flex-row
            gap-4
            justify-center
            items-center
            m-4
            mb-6
          "
        >
          <img
            className="
              select-none
            "
            src="Hacktoberfest Stars"
            src="/icon.svg"
            width="100px"
          />
          <div
            className="
              flex
              flex-col
            "
          >
            <h1
              className="
                text-gray-100
                text-4xl
                font-bold
              "
            >Hacktoberfest Stars</h1>
            <p
              className="
                text-gray-200
              "
            >Your Hacktoberfest-eligible starred repositories ⭐</p>
          </div>
        </header>

        <Component {...pageProps} />

        <footer
          className="
            h-4
          "
        ></footer>
      </AuthProvider>
    </ClientContext.Provider>
  );
}

export default MyApp
