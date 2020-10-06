import React, { useState, useContext, useEffect } from 'react';

import Head from 'next/head';
import Link from 'next/link';

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
          issues(
            first: 10,
            states:OPEN,
            filterBy:{labels:["hacktoberfest", "good-first-issue"]},
            orderBy:{field:CREATED_AT,direction:DESC}
          ) {
            nodes {
              id
              title
              url
              labels(
                first: 10,
                orderBy:{field:NAME, direction:ASC}
              ) {
                nodes {
                  id
                  color
                  name
                }
              }
            }
          }
          languages(
            first:10,
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

  const loading = true;

  const { error, data} = useQuery(STARRED_REPOSITORIES, {
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

  // if (error) return <p>Error</p>;

  return (
    <main className="
      container
      mx-auto
      flex
      flex-col
      items-center
    ">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading &&
        <div className="
          fixed
          bottom-0
          right-0
          m-8
          bg-transparent
        ">
          <img src="/loading.svg" alt="Loading" width="50px" />
        </div>
      }

      {/* <header className="
        flex
        flex-row
      ">
        <div>
          <h1>Hacktoberfest Stars</h1>
          <p>Your starred repositories that are eligible for Hacktoberfest</p>
        </div>

        <Link href="/auth/logout"><a>Logout</a></Link>
      </header> */}

      <div
        style={{
          backgroundColor: '#183d5d'
        }}
        className="
          flex
          flex-col
          gap-2
          rounded
          shadow-xl
          border
          border-gray-700
          text-white
        "
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
