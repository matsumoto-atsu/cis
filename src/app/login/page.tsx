import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { LoginForm, RegisterForm } from "@/components/LoginForms";
import { authOptions } from "@/lib/auth";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Log in | CIS",
};

export default async function LoginPage() {
  // @ts-expect-error -- NextAuth App Router types do not expose a 1-arg overload
  const session = await getServerSession(authOptions);
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
              とりあえずログイン機能実装。メールアドレスは～@~.~っていう形になってればなんでもいけます(hoge@hoge.hogeみたいな感じにしてもらえれば)
            </p>
            <p className={styles.subtitle}>
              まぁいまのところログインする意味特にありません。。後々いろいろ実装予定。。
            </p>
          </div>
          <RegisterForm />
        </section>
      </div>
    </main>
  );
}




