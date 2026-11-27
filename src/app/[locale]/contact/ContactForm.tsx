"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "./actions";

type Labels = {
  formTitle: string;
  name: string;
  emailField: string;
  phoneField: string;
  subject: string;
  message: string;
  send: string;
  sending: string;
  success: string;
  errorRequired: string;
  errorEmail: string;
  errorShort: string;
  errorGeneric: string;
};

export function ContactForm({ locale, labels }: { locale: string; labels: Labels }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { ok: false });
  const msg = (code?: string) =>
    code === "required" ? labels.errorRequired : code === "email" ? labels.errorEmail : code === "short" ? labels.errorShort : code ? labels.errorGeneric : null;

  if (state.ok) {
    return (
      <div role="status" className="rounded-3xl bg-leaf-100 p-8 text-center font-semibold text-forest-800">
        {labels.success}
      </div>
    );
  }

  const v = state.values ?? {};
  const field = (name: "name" | "email" | "message") => state.errors?.[name];
  const cls = (err?: string) => `input !py-3 ${err ? "!border-terracotta-500" : ""}`;

  return (
    <form action={action} noValidate className="space-y-5 rounded-3xl bg-white p-7 shadow-soft md:p-9">
      <h2 className="font-display text-2xl font-bold text-forest-900">{labels.formTitle}</h2>
      <input type="hidden" name="locale" value={locale} />
      <div className="hidden" aria-hidden>
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">{labels.name} *</label>
          <input id="name" name="name" defaultValue={v.name} required autoComplete="name" className={cls(field("name"))} aria-invalid={!!field("name")} aria-describedby="name-err" />
          {field("name") && <p id="name-err" className="mt-1 text-sm text-terracotta-600">{msg(field("name"))}</p>}
        </div>
        <div>
          <label htmlFor="email" className="label">{labels.emailField} *</label>
          <input id="email" name="email" type="email" dir="ltr" defaultValue={v.email} required autoComplete="email" className={`${cls(field("email"))} rtl:text-right`} aria-invalid={!!field("email")} aria-describedby="email-err" />
          {field("email") && <p id="email-err" className="mt-1 text-sm text-terracotta-600">{msg(field("email"))}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="label">{labels.phoneField}</label>
          <input id="phone" name="phone" type="tel" dir="ltr" defaultValue={v.phone} autoComplete="tel" className={`${cls()} rtl:text-right`} />
        </div>
        <div>
          <label htmlFor="subject" className="label">{labels.subject}</label>
          <input id="subject" name="subject" defaultValue={v.subject} className={cls()} />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="label">{labels.message} *</label>
        <textarea id="message" name="message" rows={6} defaultValue={v.message} required className={cls(field("message"))} aria-invalid={!!field("message")} aria-describedby="message-err" />
        {field("message") && <p id="message-err" className="mt-1 text-sm text-terracotta-600">{msg(field("message"))}</p>}
      </div>
      {state.errors?.form && <p role="alert" className="rounded-xl bg-terracotta-500/10 p-3 text-sm text-terracotta-600">{labels.errorGeneric}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60 sm:w-auto">
        {pending ? labels.sending : labels.send}
      </button>
    </form>
  );
}
