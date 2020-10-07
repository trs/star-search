import React, { useState, useContext, useEffect } from 'react';

import { getSession } from 'next-auth/client';
import { useQuery, ClientContext } from 'graphql-hooks'
import createPersistedState from 'use-persisted-state';

import { Repository } from '../components/Repository';

const useRepos = createPersistedState('repos');
const useCursor = createPersistedState('repo-cursor');

const STARRED_REPOSITORIES = `
  query StarredRespositories($limit: Int, $cursor: String) {
    viewer {
      starredRepositories(
        first:$limit,
        orderBy:{field:STARRED_AT,direction:ASC},
        after:$cursor
      ) {
        pageInfo {
          endCursor
        }
        totalCount
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
  const [cursor, setCursor] = useCursor(null);

  const [repos, setRepos] = useState(localStorageRepos);
  const [totalCount, setTotalCount] = useState(0);

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

    const {endCursor} = data.viewer.starredRepositories.pageInfo;
    if (endCursor !== null) {
      setCursor(endCursor);
    }

    setTotalCount(data.viewer.starredRepositories.totalCount);

    const eligibleRepos = data.viewer.starredRepositories.nodes
      .filter(({repositoryTopics}) => repositoryTopics.nodes.some(
        ({topic}) => topic.name.toLocaleLowerCase() === 'hacktoberfest'
      ));

    setRepos((repos) => repos
      .map((repo) => eligibleRepos.find((r) => r.id === repo.id) || repo)
      .concat(eligibleRepos.filter((repo) => !repos.some((r) => r.id === repo.id))
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
        display: 'grid',
        gridTemplateColumns: '1fr min(75ch, 90%) 1fr'
      }}
    >
      <div
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          backgroundColor: 'rgb(24, 61, 93)',
          border: '1px solid rgba(147, 194, 219, 0.25)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '0.25rem',
          boxShadow: '0 1px 3px 0 rgba(147, 194, 219, 0.1), 0 1px 2px 0 rgba(147, 194, 219, 0.06)'
        }}
      >
        {loading
          ? <img
              src="/loading.svg"
              alt="Loading"
              width="40px"
              style={{
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            />
          : <button
              onClick={() => {
                setRepos([]);
                setCursor(null);
              }}
              style={{
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                display: 'block',
                width: '40px',
                height: '40px'
              }}
            >
            <img
              src="/refresh.svg"
              alt="Refresh"
              width="20px"
            />
          </button>
        }
      </div>

      <div
        style={{
          color: 'rgb(147, 194, 219)',
          fontSize: '1rem',
          lineHeight: '2.5rem',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: '0.25rem'
        }}
      >
        <span>⭐</span>
        <span style={{
          color: 'rgb(247, 250, 252)',
          fontWeight: '600',
          fontSize: '1.25rem'
        }}
        >{repos.length}</span>
        /
        <span style={{
          fontWeight: '300'
        }}
        >{totalCount > 0 ? totalCount : '...'}</span>
      </div>

      { repos.length > 0 &&
      <div
        style={{
          backgroundColor: '#183d5d',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '0.25rem',
          border: '1px solid rgba(147, 194, 219, 0.25)',
          boxShadow: '0 1px 3px 0 rgba(147, 194, 219, 0.1), 0 1px 2px 0 rgba(147, 194, 219, 0.06)'
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
      }
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
