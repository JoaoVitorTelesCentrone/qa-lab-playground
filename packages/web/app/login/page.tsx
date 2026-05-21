import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Login — QA Lab Playground" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  return <AuthForm mode="login" redirectTo={searchParams.redirect ?? "/"} />;
}
