import Link from "next/link";
import type { ComponentProps } from "react";
import { ACCOUNTS_ENABLED } from "@/lib/product/features";

/** Remove convites de login do lançamento público sem alterar as trilhas. */
export function AccountLink(props: ComponentProps<typeof Link>) {
  if (!ACCOUNTS_ENABLED) return null;
  return <Link {...props} />;
}
