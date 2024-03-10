import { prisma } from "@/lib/db";

async function page({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? <div>{user.name}</div> : <div>User not found</div>;
}

export default page;
