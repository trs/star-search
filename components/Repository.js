export function Repository({repo}) {
  return (
    <article
      style={{
        color: 'rgb(247, 250, 252)',
        padding: '0.5rem',
        transitionProperty: 'border-color',
        borderRadius: '0.25rem',
        border: '1px solid transparent',
        maxWidth: '640px'
      }}
    >
      <a target="_blank" rel="noopener noreferrer" href={repo.url}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          padding: '0 0.5rem',
          paddingBottom: '0.25rem',
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
