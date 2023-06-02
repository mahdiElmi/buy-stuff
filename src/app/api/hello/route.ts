const object = {
  name: "mahdi",
  age: 22,
  footLengthInCm: 31,
};
export async function GET(request: Request) {
  return new Response(JSON.stringify(object));
}
