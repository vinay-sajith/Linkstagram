export default function ResourceCard({ resource }) {
  return (
    <article>
      <h3>{resource.title}</h3>

      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit Resource
      </a>
      <button onClick={""}>Edit</button>
      <button onClick={""}>Delete</button>
    </article>
  );
}