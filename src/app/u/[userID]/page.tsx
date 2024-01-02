import { prisma } from "@/lib/db";

async function page({ params }: { params: { userID: string } }) {
  const { userID } = params;
  const user = await prisma.user.findUnique({ where: { id: userID } });
  return user ? <div>{user.name}</div> : <div>User not found</div>;
}

export default page;
