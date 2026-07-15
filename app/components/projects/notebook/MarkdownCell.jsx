'use client';

export default function MarkdownCell({ content }) {
  const blocks = content.trim().split('\n\n');

  return (
    <div className="border-b border-line-subtle/60 bg-base/30 px-6 py-5 font-body text-sm leading-relaxed text-ink-secondary">
      {blocks.map((block, i) => {
        if (block.startsWith('### ')) {
          return (
            <h4
              key={i}
              className={`mb-2 font-display text-base font-bold text-ink-primary ${i > 0 ? 'mt-5' : ''}`}
            >
              {block.replace('### ', '')}
            </h4>
          );
        }

        const lines = block.split('\n');
        const isList = lines.every((line) => line.trim() === '' || line.trim().startsWith('- '));
        if (isList) {
          return (
            <ul key={i} className={`list-disc space-y-1.5 pl-5 ${i > 0 ? 'mt-3' : ''}`}>
              {lines
                .filter((line) => line.trim().startsWith('- '))
                .map((line, li) => (
                  <li key={li}>{renderInline(line.replace(/^\s*-\s*/, ''))}</li>
                ))}
            </ul>
          );
        }

        return (
          <p key={i} className={i > 0 ? 'mt-3' : ''}>
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-ink-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
