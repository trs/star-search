export function Repository({repo}) {
  return (
    <article
      className="
        p-2
        max-w-screen-sm
        transition
        duration-100
        ease-in-out
        rounded
        border
        border-transparent
        hover:border-gray-200
      "
    >
      <a target="_blank" rel="noopener noreferrer" href={repo.url}
        className="
          pb-2
          px-4
          flex
          flex-col
          gap-2
        "
        style={{
          gridTemplateColumns: '1fr auto',
          gridTemplateRows: 'auto auto auto'
        }}
      >

        <div className="">
          <h2 className="
            text-2xl
            font-sans
            font-bold
          ">{repo.name}</h2>
        </div>

        <div
          className="
            text-lg
          "
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }}
        >{repo.description}</div>

        <div
          className="
            flex
            flex-row
            h-2
            shadow
          "
        >
        {
          repo.languages.edges.map(({size, node}) => {
            return (
              <span
                key={node.id}
                style={{
                  backgroundColor: node.color,
                  width: `${(size / repo.languages.totalSize) * 100}%`
                }}
                className="
                  first:rounded-l
                  last:rounded-r
                  h-full
                "
              ></span>
            );
          })
        }
        </div>
      </a>
    </article>
  );
}
