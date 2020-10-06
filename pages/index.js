import React, { useState, useContext, useEffect } from 'react';

import Head from 'next/head';

import { getSession } from 'next-auth/client';
import { useQuery, ClientContext } from 'graphql-hooks'
import createPersistedState from 'use-persisted-state';

import { Repository } from '../components/Repository';

const useRepos = createPersistedState('repos');

const STARRED_REPOSITORIES = `
  query StarredRespositories($limit: Int, $cursor: String) {
    viewer {
      starredRepositories(
        first:$limit,
        orderBy:{field:STARRED_AT,direction:ASC},
        after:$cursor
      ) {
        pageInfo {
          startCursor
        }
        nodes {
          id
          name
          url
          description
          repositoryTopics(first:100) {
            nodes{
              id
              topic {
                id
                name
              }
            }
          }
          languages(
            first:5,
            orderBy:{field:SIZE,direction:DESC}
          ) {
            totalSize
            edges {
              size
              node {
                id
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;

export default function StarredRepos({session}) {
  if (!session) return null;

  const [localStorageRepos, setLocalStorageRepos] = useRepos([]);

  const [cursor, setCursor] = useState(null);
  const [repos, setRepos] = useState(localStorageRepos);

  const client = useContext(ClientContext);
  client.setHeader('authorization', `bearer ${session.accessToken}`);

  const { loading, error, data} = useQuery(STARRED_REPOSITORIES, {
    variables: {
      limit: 100,
      cursor
    }
  });

  useEffect(() => {
    if (!data) return;

    const {startCursor} = data.viewer.starredRepositories.pageInfo;
    if (startCursor !== null) {
      setCursor(startCursor);
    }

    setRepos((repos) => repos.concat(
      data.viewer.starredRepositories.nodes
        .filter(({repositoryTopics}) => repositoryTopics.nodes.some(
          ({topic}) => topic.name.toLocaleLowerCase() === 'hacktoberfest'
        ))
        .filter((repo) => !repos.some((r) => r.id === repo.id))
    ));
  }, [data]);

  useEffect(() => {
    setLocalStorageRepos(repos);
  }, [repos]);

  if (error) {
    console.error(error);
  }

  return (
    <main
      style={{
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading &&
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem'
          }}
        >
          <img src="/loading.svg" alt="Loading" width="50px" />
        </div>
      }

      <div
        style={{
          backgroundColor: '#183d5d',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          borderRadius: '0.25rem',
          border: '1px solid rgb(147, 194, 219)'
        }}
      >
        {
          repos.map((repo) => {
            return (
              <Repository key={repo.id} repo={repo} />
            );
          })
        }
      </div>
    </main>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    context.res.writeHead(302, {Location: '/auth/login'});
    context.res.end();
    return {props: {}};
  }

  return {
    props: { session }
  }
}
