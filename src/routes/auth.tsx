import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Check, Mail } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

import "../vibra.css";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Vibra Worldwide" },
      {
        name: "description",
        content:
          "Sign in or create your Vibra Worldwide account to keep your profile and activity safe.",
      },
      { property: "og:title", content: "Sign in — Vibra Worldwide" },
      {
        property: "og:description",
        content: "Sign in or create your Vibra Worldwide account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && user) navigate({ to: "/", replace: true });
  }, [loading, user, navigate]);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setMessage("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode !== "forgot" && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (signInError) {
          setError(
            signInError.message.toLowerCase().includes("email not confirmed")
              ? "Please confirm your email first — check your inbox for the confirmation link."
              : "Could not sign in. Check your email and password and try again.",
          );
          return;
        }
        navigate({ to: "/", replace: true });
      } else if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        if (data.session) {
          navigate({ to: "/", replace: true });
        } else {
          setMessage(
            "Account created. Check your email for a confirmation link to finish signing up.",
          );
        }
      } else {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (resetError) {
          setError(resetError.message);
          return;
        }
        setMessage("If an account exists for this email, a password reset link is on its way.");
      }
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
        <span className="eyebrow">YOUR ACCOUNT</span>
        <h1 className="auth-title">
          {mode === "signin" ? "Welcome back." : mode === "signup" ? "Create your account." : "Reset your password."}
        </h1>

        <div className="auth-tabs" role="tablist">
          <button role="tab" aria-selected={mode === "signin"} className={mode === "signin" ? "chosen" : ""} onClick={() => switchMode("signin")}>Sign in</button>
          <button role="tab" aria-selected={mode === "signup"} className={mode === "signup" ? "chosen" : ""} onClick={() => switchMode("signup")}>Create account</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className="field-label" htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            className="text-field"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          {mode !== "forgot" && (
            <>
              <label className="field-label" htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                className="text-field"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
            </>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-success" role="status"><Mail size={15}/> {message}</p>}

          <Button className="primary-button auth-submit" type="submit" disabled={busy}>
            {busy
              ? "Please wait…"
              : mode === "signin"
                ? "Sign in"
                : mode === "signup"
                  ? "Create account"
                  : "Send reset link"}
            {!busy && <Check size={16}/>}
          </Button>
        </form>

        {mode === "signin" && (
          <button className="text-link auth-forgot" onClick={() => switchMode("forgot")}>
            Forgot your password? <ArrowUpRight size={14}/>
          </button>
        )}
        {mode !== "signin" && (
          <button className="text-link auth-forgot" onClick={() => switchMode("signin")}>
            Back to sign in <ArrowUpRight size={14}/>
          </button>
        )}

        <p className="privacy-foot">Your password is stored securely by the authentication service — never in plain text, never on this device.</p>
      </div>
    </div>
  );
}
