"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./LoginForms.module.css";

const GENERIC_SIGN_IN_ERROR = "Sign in failed";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    if (!result || result.error) {
      setError(result?.error ?? GENERIC_SIGN_IN_ERROR);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="login-email" className={styles.label}>
          Email address
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="login-password" className={styles.label}>
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={styles.input}
          required
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="submit"
        className={`button-base button-primary ${styles.submit}`}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          password,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError((payload as { error?: string }).error ?? "Failed to register");
        return;
      }

      setSuccess("Account created. You can sign in now.");
      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");
    } catch (err) {
      console.error(err);
      setError("Network request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="register-name" className={styles.label}>
          Display name (optional)
        </label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="register-email" className={styles.label}>
          Email address
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="register-password" className={styles.label}>
          Password (min 8 characters)
        </label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={styles.input}
          minLength={8}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="register-confirm" className={styles.label}>
          Confirm password
        </label>
        <input
          id="register-confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          className={styles.input}
          minLength={8}
          required
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <button
        type="submit"
        className={`button-base button-secondary ${styles.submit}`}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}