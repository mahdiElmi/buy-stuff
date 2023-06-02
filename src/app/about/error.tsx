"use client";
function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="m-2 rounded-md bg-red-500 p-4">
      <h3>Error message:</h3>
      <p>{error.message}</p>
      <button
        className="rounded-sm bg-red-950 p-1 text-lg font-bold"
        onClick={() => reset()}
      >
        try again
      </button>
    </div>
  );
}
export default Error;
