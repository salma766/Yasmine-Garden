"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm({ labels }: { labels: { email: string; password: string; signIn: string; bad: string } }) {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="label">{labels.email}</label>
        <input id="email" name="email" type="email" dir="ltr" required autoComplete="username" className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">{labels.password}</label>
        <input id="password" name="password" type="password" dir="ltr" required autoComplete="current-password" className="input" />
      </div>
      {state.error && <p role="alert" className="rounded-lg bg-terracotta-500/10 p-3 text-sm text-terracotta-600">{labels.bad}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">{labels.signIn}</button>
    </form>
  );
}
