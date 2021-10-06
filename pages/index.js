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
            first:100,
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
          backgroundColor: '#2B3531',
          border: '1px solid #677662',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgba(147, 194, 219, 0.1), 0 1px 2px 0 rgba(147, 194, 219, 0.06)'
        }}
      >
        {loading
          ?
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style="filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7));"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid"
              style={{
                pointerEvents: 'none',
                userSelect: 'none',
                width: '40px'
              }}
            >
              <circle cx="50" cy="50" r="0" fill="none" stroke="#F74700" stroke-width="6">
                <animate attributeName="r" repeatCount="indefinite" dur="1s" values="0;40" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline" begin="-0.5s"></animate>
                <animate attributeName="opacity" repeatCount="indefinite" dur="1s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline" begin="-0.5s"></animate>
              </circle>
              <circle cx="50" cy="50" r="0" fill="none" stroke="#8FA68A" stroke-width="6">
                <animate attributeName="r" repeatCount="indefinite" dur="1s" values="0;40" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline"></animate>
                <animate attributeName="opacity" repeatCount="indefinite" dur="1s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline"></animate>
              </circle>
              </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F4F0E1"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              width="20px"
            >
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>

          </button>
        }
      </div>

      <div
        style={{
          color: 'inherit',
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
          color: 'inherit',
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
          backgroundColor: '#B53A25',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '0.75rem',
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
    context.res.writeHead(302, {Location: '/login'});
    context.res.end();
    return {props: {}};
  }

  return {
    props: { session }
  }
}
