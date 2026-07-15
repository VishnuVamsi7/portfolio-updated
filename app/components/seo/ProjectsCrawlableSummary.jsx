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
          {project.approach && (
            <p>
              <strong>Approach:</strong> {project.approach}
            </p>
          )}
          {project.whyApproach && (
            <p>
              <strong>Why this approach:</strong> {project.whyApproach}
            </p>
          )}
          {project.howBuilt && (
            <p>
              <strong>How it was built:</strong> {project.howBuilt}
            </p>
          )}
          {project.pipeline?.length > 0 && (
            <div>
              <strong>Pipeline:</strong>
              <ol>
                {project.pipeline.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          )}
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
