"use client";
import React from "react";

async function getBossStats() {
  const res = await fetch("http://localhost:3000/api/hello");
  console.log(res);
  if (!res.ok) {
    throw new Error("Request failed");
  }
  return res.json();
}
async function BossStats() {
  const data = await getBossStats();

  return (
    <div>
      <h2 className="mb-4 text-center text-3xl font-bold">
        some stats about our overlord
      </h2>
      <ul className="list-disc">
        <li>{data.stats.name}</li>
        <li>{data.stats.age}</li>
        <li>{data.stats.footLengthInCm}</li>
      </ul>
    </div>
  );
}

export default BossStats;
