import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Check } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

import "../vibra.css";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Vibra Worldwide" },
      { name: "description", content: "Choose a new password for your Vibra Worldwide account." },
      { property: "og:title", content: "Reset password — Vibra Worldwide" },
      { property: "og:description", content: "Choose a new password for your Vibra Worldwide account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // The reset link carries a recovery token in the URL hash; the Supabase
  // client exchanges it for a recovery session automatically on load.
  useEffect(() => {
    let active = true;
    const { data: subscription } = supabase.auth.onAuthStateChange(event => {
      if (event === "PASSWORD_RECOVERY" && active) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) setReady(true);
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      setDone(true);
      setTimeout(() => navigate({ to: "/", replace: true }), 1500);
    } catch {
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell grain auth-shell">
      <div className="auth-card dialog">
        <Link to="/" className="brand brand-type auth-brand" aria-label="Vibra Worldwide home">
          vibra<span> worldwide</span>
        </Link>
        <span className="eyebrow">PASSWORD RESET</span>
        <h1 className="auth-title">Choose a new password.</h1>

        {done ? (
          <p className="auth-success" role="status"><Check size={15}/> Password updated. Taking you back to your feed…</p>
        ) : ready ? (
          <form onSubmit={handleSubmit} noValidate>
            <label className="field-label" htmlFor="new-password">New password</label>
            <input
              id="new-password"
              className="text-field"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
            />
            <label className="field-label" htmlFor="confirm-password">Repeat new password</label>
            <input
              id="confirm-password"
              className="text-field"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              minLength={6}
            />
            {error && <p className="auth-error" role="alert">{error}</p>}
            <Button className="primary-button auth-submit" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save new password"} {!busy && <Check size={16}/>}
            </Button>
          </form>
        ) : (
          <p className="dialog-copy">
            Open this page from the reset link in your email. If you already did, the link may have
            expired — request a new one from the <Link to="/auth">sign in page</Link>.
          </p>
        )}
      </div>
    </div>
  );
}
