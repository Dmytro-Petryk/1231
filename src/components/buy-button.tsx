import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export async function BuyButton({ productId }: { productId: string }) {
  const session = await auth();
  const checkoutUrl = `/checkout?productId=${encodeURIComponent(productId)}`;
  const href = session?.user ? checkoutUrl : `/login?callbackUrl=${encodeURIComponent(checkoutUrl)}`;

  return (
    <Link href={href} className="block">
      <Button className="w-full">Buy now</Button>
    </Link>
  );
}
