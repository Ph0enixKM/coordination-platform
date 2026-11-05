"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import styles from "./AdminAuth.module.css";

const STORAGE_KEY = "coordination-admin-code";

type Api = <T>(path: string, init?: RequestInit) => Promise<T>;

const AdminContext = createContext<{ api: Api; logout: () => void } | null>(null);

/** Calls the admin API with the stored code; a rejected code logs the user out. */
export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) throw new Error("useAdmin poza <AdminAuth>");

  return context;
}

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function store(code: string | null) {
  try {
    if (code) localStorage.setItem(STORAGE_KEY, code);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Without storage the code only lasts until the tab closes.
  }
}

async function checkCode(code: string) {
  const response = await fetch("/api/admin/session", {
    method: "POST",
    headers: { Authorization: `Bearer ${code}` },
  });

  return response.ok;
}

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  // undefined: still reading localStorage, null: logged out.
  const [code, setCode] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const stored = readStored();

    if (!stored) {
      setCode(null);
      return;
    }

    // A code changed in .env since the last visit should not leave a broken panel.
    checkCode(stored)
      .then((ok) => {
        if (!ok) store(null);
        setCode(ok ? stored : null);
      })
      .catch(() => setCode(stored));
  }, []);

  const logout = useCallback(() => {
    store(null);
    setCode(null);
  }, []);

  const api = useCallback<Api>(
    async (path, init) => {
      const headers = new Headers(init?.headers);
      headers.set("Authorization", `Bearer ${code}`);

      if (init?.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");

      const response = await fetch(path, { ...init, headers });
      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (response.status === 401) logout();
      if (!response.ok) throw new Error(data.error ?? `Błąd serwera (${response.status}).`);

      return data as never;
    },
    [code, logout],
  );

  if (code === undefined) {
    return (
      <div className={styles.screen}>
        <LoaderCircle className={styles.spinner} aria-label="Wczytywanie" />
      </div>
    );
  }

  if (code === null) {
    return (
      <Login
        onLogin={(value) => {
          store(value);
          setCode(value);
        }}
      />
    );
  }

  return <AdminContext.Provider value={{ api, logout }}>{children}</AdminContext.Provider>;
}

function Login({ onLogin }: { onLogin: (code: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    const code = value.trim();

    if (!code) return;

    setBusy(true);
    setError("");

    try {
      if (await checkCode(code)) onLogin(code);
      else setError("Nieprawidłowy kod dostępu.");
    } catch {
      setError("Brak połączenia z serwerem. Spróbuj ponownie.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.screen}>
      <form className={styles.card} onSubmit={submit}>
        <img className={styles.logo} src="/assets/logo.svg" alt="" width={44} height={44} />
        <h1 className={styles.title}>Panel administracyjny</h1>
        <p className={styles.lead}>Wpisz kod dostępu, aby zarządzać wpisami na blogu.</p>

        <label className={styles.label} htmlFor="admin-code">
          Kod dostępu
        </label>
        <input
          id="admin-code"
          className={styles.input}
          type="password"
          autoComplete="current-password"
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "admin-code-error" : undefined}
        />
        {error && (
          <p id="admin-code-error" className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button className={styles.submit} type="submit" disabled={busy || !value.trim()}>
          {busy ? "Sprawdzanie…" : "Zaloguj się"}
        </button>
      </form>
    </div>
  );
}
