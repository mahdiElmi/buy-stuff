import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="h-fit overflow-x-clip px-5">
      <h1 className="mb-10 me-auto self-start text-4xl font-black">
        Purchase History
      </h1>

      <Link href="/products/add">
        <Button variant="outline">Add Products</Button>
      </Link>
    </div>
  );
}
