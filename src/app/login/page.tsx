import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginForm, RegisterForm } from "@/components/LoginForms";
import { getAuthOptions } from "@/lib/auth";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Log in | CIS",
};

export default async function LoginPage() {
  const session = await getServerSession(getAuthOptions());
  if (session) {
    redirect("/");
  }

  return (
    <main className={styles.main}>
      <div className={styles.panels}>
        <section className={styles.panel}>
          <div>
            <h1 className={styles.title}>Log in</h1>
            <p className={styles.subtitle}>
              Sign in to access upcoming features such as personal accuracy tracking and saved questions.
            </p>
          </div>
          <LoginForm />
        </section>

        <section className={styles.panel}>
          <div>
            <h2 className={styles.title}>Create an account</h2>
            <p className={styles.subtitle}>
              Register with any email address and password. All passwords are hashed before storage.
            </p>
          </div>
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}