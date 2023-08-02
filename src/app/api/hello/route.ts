import { NextResponse } from "next/server";

const stats = {
  name: "mahdi",
  age: 22,
  footLengthInCm: 31,
};
// export async function GET() {
//   return new Response(JSON.stringify(stats));
// }
export async function GET() {
  const response = NextResponse.json({ stats });
  console.log(response);
  return response;
}
