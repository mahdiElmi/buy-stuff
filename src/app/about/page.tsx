import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/server/auth";

async function About() {
  // const data = await fetch('https://fakestoreapi.com/products')
  //         .then(res=>res.json())
  //         .then(json=>console.log(json))
  // console.log(data);
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");
  return (
    <div className="mt-5">
      <h1 className="mb-4 text-center text-3xl font-bold">About</h1>
      <p className="max-w-5xl text-xl">
        We here at BS believe not being able to Buy Stuff is BS 😉 so in 2023 we
        decided that it&apos;s enough. someone has to make a place for people to
        buy and sell STUFF and that&apos;s when our genius CEO, Mr. Mahdi Elmi
        had the audacity to try to tackle such a project and the rest is history
        as you know.
      </p>
      {/* <Suspense fallback={<>Loading Powerful Stats...</>}>
        <BossStats />
      </Suspense> */}
    </div>
  );
}

export default About;
