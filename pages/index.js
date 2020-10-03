import React, { useState, useContext, useEffect } from 'react';
import color from 'color';

import Head from 'next/head';
import Link from 'next/link';

import { getSession } from 'next-auth/client';
import { useQuery, ClientContext } from 'graphql-hooks'

const STARRED_REPOSITORIES = `
  query StarredRespositories($limit: Int, $cursor: String) {
    viewer {
      starredRepositories(
        first:$limit,
        orderBy:{field:STARRED_AT,direction:DESC},
        after:$cursor
      ) {
        pageInfo {
          endCursor,
          hasNextPage
        }
        nodes {
          id
          name
          url
          description,
          descriptionHTML
          labels(first: 1, query:"hacktoberfest") {
            nodes {
              name
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

  const [cursor, setCursor] = useState(null);
  const [repos, setRepos] = useState([]);

  const client = useContext(ClientContext);
  client.setHeader('authorization', `bearer ${session.accessToken}`);

  const {loading, error, data} = useQuery(STARRED_REPOSITORIES, {
    variables: {
      limit: 10,
      cursor
    }
  });

  useEffect(() => {
    if (!data) return;

    const {endCursor} = data.viewer.starredRepositories.pageInfo;
    if (endCursor !== null) {
      setCursor(endCursor);
    }
    setRepos((repos) => repos.concat(data.viewer.starredRepositories.nodes.filter(({labels}) => labels.nodes.length > 0)));
  }, [data]);

  if (error) return <p>Error</p>;

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

      <header className="
        flex
        flex-row
      ">
        <div>
          <h1>Hacktoberfest Stars</h1>
          <p>Your starred repositories that are eligible for Hacktoberfest</p>
        </div>
        {loading && <p>Loading...</p>}
        <Link href="/auth/logout"><a>Logout</a></Link>
      </header>

      <div className="
        flex
        flex-col
        gap-4
      ">
      {
        repos.map((repo) => {
          console.log(repo)
          return (
            <article key={repo.id} className="
              p-2
              rounded
              border
              border-gray-400
              shadow
              max-w-screen-sm
            ">
              <div
                className="
                  pb-2
                  px-2
                  grid
                "
                style={{
                  gridTemplateColumns: '1fr auto',
                  gridTemplateRows: 'auto auto auto'
                }}
              >

                <span className="">
                  <h2 className="
                    text-2xl
                    font-sans
                    font-medium
                  ">{repo.name}</h2>
                </span>

                <span className="">
                  <a target="_blank" rel="noopener noreferrer" href={repo.url}>
                    <img src="/github.svg" className=""/>
                  </a>
                </span>

                <span className="
                  break-words
                  col-span-2
                ">{repo.description}</span>

                <span className="
                  flex
                  flex-row
                  rounded
                  col-span-2
                ">
                {
                  repo.languages.edges.map(({size, node}) => {
                    return (
                      <span
                        key={node.id}
                        style={{
                          backgroundColor: node.color,
                          width: `${(size / repo.languages.totalSize) * 100}%`,
                          height: '12px'
                        }}
                        className="
                          first:rounded-l
                          last:rounded-r
                        "
                      ></span>
                    );
                  })
                }
                </span>
              </div>

              <div className="
                flex
                flex-col
                gap-2
              ">
              {
                repo.issues.nodes.map((issue) => {
                  return (
                    <a target="_blank" rel="noopener noreferrer" href={issue.url}>
                      <div key={issue.id} className="
                        flex
                        flex-col
                        gap-2
                        py-2
                        px-2
                        rounded
                        border
                        border-transparent
                        hover:border-gray-400
                        hover:shadow-inner
                      ">

                        <div className="
                          flex
                          flex-row
                          gap-2
                        ">
                          <img src="/issue.svg" alt="Issue" />
                          <h3>{issue.title}</h3>
                        </div>

                        <div className="
                          flex
                          flex-row
                          gap-2
                        ">
                        {
                          issue.labels.nodes.map((issue) => {
                            return (
                              <span
                                key={issue.id}
                                style={{
                                  backgroundColor: `#${issue.color}`
                                }}
                                className={`
                                  rounded
                                  py-1
                                  px-2
                                  ${
                                    color(`#${issue.color}`).isLight()
                                    ? 'text-gray-900'
                                    : 'text-gray-100'
                                  }
                                `}
                              >
                                {issue.name}
                              </span>
                            )
                          })
                        }
                        </div>
                      </div>
                    </a>
                  );
                })
              }
              </div>
            </article>
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
    return {};
  }

  return {
    props: { session }
  }
}
