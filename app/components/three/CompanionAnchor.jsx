/**
 * Invisible spatial target for the floating companion avatar.
 * Drop inside any section: <CompanionAnchor id="about" className="absolute right-[8%] top-32" />
 */
export default function CompanionAnchor({ id, className = '' }) {
  return (
    <div
      data-companion-anchor={id}
      className={`pointer-events-none h-28 w-28 ${className}`}
      aria-hidden="true"
    />
  );
}
