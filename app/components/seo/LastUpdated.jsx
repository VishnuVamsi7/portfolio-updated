export default function LastUpdated() {
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString().split('T')[0];

  return (
    <p className="text-center text-xs text-gray-400" aria-label={`Portfolio last updated ${buildDate}`}>
      Last updated: {buildDate}
    </p>
  );
}
