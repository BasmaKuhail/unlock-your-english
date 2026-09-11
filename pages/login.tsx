import Head from "next/head";

import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Log in | Uye</title>
        <meta content="Log in to continue learning English with Uye." name="description" />
      </Head>
      <AuthShell>
        <AuthForm />
      </AuthShell>
    </>
  );
}
