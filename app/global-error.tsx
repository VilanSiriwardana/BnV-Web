'use client';

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 16,
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#faf7f2',
          color: '#1c1b1a',
        }}
      >
        <title>Something went wrong | B&amp;V</title>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 32 }}>
          Something went wrong
        </h1>
        <p>Please try again in a moment.</p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          style={{
            height: 48,
            padding: '0 28px',
            border: 0,
            borderRadius: 8,
            background: '#6a5296',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
