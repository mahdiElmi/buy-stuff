import { prisma } from "@/lib/db";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

async function layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  const user = await prisma.user.findUnique({
    where: { email: session!.user!.email! },
    include: { vendor: true },
  });
  if (user?.vendor) redirect(`/vendors/${user.vendor.id}`);

  return <>{children}</>;
}

export default layout;
