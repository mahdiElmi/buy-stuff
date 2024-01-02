import { prisma } from "@/lib/db";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/api/auth/signin");
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: { vendor: true },
  });
  if (user?.vendor) redirect(`/vendors/${user.vendor.id}`);

  return <>{children}</>;
}

export default layout;
