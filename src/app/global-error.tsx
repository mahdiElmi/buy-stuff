"use client";
function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="h-screen bg-red-900 text-red-200">
        <h1 className="text-red-200">
          Something went wrong, try refreshing the page using <kbd>Ctrl</kbd> +{" "}
          <kbd>Shift</kbd> + <kbd>R</kbd>
        </h1>
      </body>
    </html>
  );
}

export default GlobalError;
