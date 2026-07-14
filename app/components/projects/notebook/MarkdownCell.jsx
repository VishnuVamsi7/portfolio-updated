'use client';

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

export default function MarkdownCell({ content }) {
  const blocks = content.trim().split('\n\n');

  return (
    <div className="border-b border-line-subtle/60 bg-base/30 px-6 py-5 font-body text-sm leading-relaxed text-ink-secondary">
      {blocks.map((block, i) => {
        if (block.startsWith('### ')) {
          return (
            <h4 key={i} className="mb-2 font-display text-base font-bold text-ink-primary">
              {block.replace('### ', '')}
            </h4>
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
