export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="animate-pulse">
      <div className="bg-muted aspect-square w-full md:aspect-[1920/650]" />
      <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8">
        <div className="bg-muted mx-auto h-10 w-2/3 max-w-xl rounded-md" />
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i}>
              <div className="bg-muted aspect-[4/5] rounded-md" />
              <div className="bg-muted mt-3 h-4 w-3/4 rounded-sm" />
              <div className="bg-muted mt-2 h-4 w-1/3 rounded-sm" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
