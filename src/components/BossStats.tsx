import React from "react";

async function getBossStats() {
  const res = await fetch("http://localhost:3000/api/hello");
  return res.json();
}
async function BossStats() {
  const stats = await getBossStats();
  return (
    <div>
      <h2 className="mb-4 text-center text-3xl font-bold">
        some stats about our overlord
      </h2>
      <ul className="list-disc">
        <li>{stats.name}</li>
        <li>{stats.age}</li>
        <li>{stats.footLengthInCm}</li>
      </ul>
    </div>
  );
}

export default BossStats;
