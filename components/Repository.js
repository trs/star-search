export function Repository({repo}) {
  return (
    <article>
      <a target="_blank" rel="noopener noreferrer" href={repo.url}
        style={{
          color: 'rgb(247, 250, 252)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          padding: '1.5rem 1rem',
          transitionProperty: 'background-color',
          transitionDuration: '250ms',
          border: '1px solid transparent'
        }}
      >
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}>{repo.name}</h2>

        <div
          style={{
            fontSize: '1.1rem',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
        >{repo.description}</div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '0.5rem'
          }}
        >
        {
          repo.languages.edges.map(({size, node}) => {
            return (
              <span
                key={node.id}
                style={{
                  backgroundColor: node.color,
                  width: `${(size / repo.languages.totalSize) * 100}%`,
                  height: '100%'
                }}
              ></span>
            );
          })
        }
        </div>
      </a>
    </article>
  );
}
