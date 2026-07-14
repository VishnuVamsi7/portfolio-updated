import { projects } from '../../data/projects';

export default function ProjectsCrawlableSummary() {
  return (
    <aside
      className="sr-only"
      aria-label="Full project descriptions for search engines and assistive technologies"
    >
      <h2>All Portfolio Projects</h2>
      {projects.map((project) => (
        <article key={project.id} id={`project-${project.id}`}>
          <h3>{project.title}</h3>
          <p>{project.subtitle}</p>
          <p>
            <strong>Tags:</strong> {project.tags.join(', ')}
          </p>
          <p>
            <strong>Technologies:</strong> {project.techStack.join(', ')}
          </p>
          <p>
            <strong>Goal:</strong> {project.goal}
          </p>
          <p>
            <strong>Outcome:</strong> {project.outcome}
          </p>
          {project.github && (
            <p>
              <strong>Repository:</strong>{' '}
              <a href={project.github}>{project.github}</a>
            </p>
          )}
        </article>
      ))}
    </aside>
  );
}
