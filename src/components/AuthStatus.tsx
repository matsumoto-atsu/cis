"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import styles from "./AuthStatus.module.css";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className={styles.loading}>Checking session...</span>;
  }

  if (session?.user) {
    const name = session.user.name ?? session.user.email ?? "Signed in";

    return (
      <div className={styles.wrapper}>
        <span className={styles.name}>{name}</span>
        <button
          type="button"
          className="button-base button-secondary"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link href="/login" className="button-base button-primary">
      Log in
    </Link>
  );
}