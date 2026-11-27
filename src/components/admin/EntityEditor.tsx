"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveBase, saveTranslation, type BaseState, type TrSaveState } from "@/app/admin/actions";
import { entities, translationState, type EntityKey, type FieldDef, type TrState } from "@/lib/entities";
import { locales, localeInfo, slugify, type Locale } from "@/lib/i18n";
import { tp } from "@/lib/tp";
import type { Messages } from "@/messages/fr";
import { ImageField, type ImageSizeInfo } from "./ImageField";
import { imageSizes } from "@/lib/image-sizes";
import { StateChip } from "./StateChip";

type Values = Record<string, unknown>;
type Option = { value: string; label: string };

export type EditorProps = {
  entity: EntityKey;
  id: string;
  isNew: boolean;
  base: Values;
  translations: Partial<Record<Locale, Values>>;
  previewUrls: Partial<Record<Locale, string | null>>;
  relationOptions: Record<string, Option[]>;
  t: Messages;
  adminLocale: Locale;
  initialLang: Locale;
  aiEnabled: boolean;
};

function imageLabels(t: Messages) {
  return { upload: t.admin.upload, uploading: t.admin.uploading, remove: t.admin.removeImage, url: t.admin.imageUrl, error: t.admin.saveError };
}

function sizeInfo(field: FieldDef, t: Messages): ImageSizeInfo | undefined {
  if (!field.size) return undefined;
  const { tips, ...labels } = t.admin.imageSize;
  return { ...imageSizes[field.size], tip: tips[field.size], labels };
}

function Field({
  field,
  value,
  t,
  locale,
  options,
  required,
  formId,
}: {
  field: FieldDef;
  value: unknown;
  t: Messages;
  locale?: Locale;
  options?: Option[];
  required?: boolean;
  formId?: string;
}) {
  const label = tp(t, field.label) + (required ? " *" : "");
  const id = `${formId ?? "base"}-${field.key}`;
  const dirClass = locale ? (locale === "ar" ? "field-rtl" : "field-ltr") : "";
  const dir = locale ? localeInfo[locale].dir : undefined;
  const str = value == null ? "" : String(value);

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name={field.key} defaultChecked={!!value} className="h-4 w-4 accent-forest-800" />
        {label}
      </label>
    );
  }
  if (field.type === "image") {
    return (
      <div>
        <span className="label">{label}</span>
        <ImageField name={field.key} defaultValue={str} labels={imageLabels(t)} size={sizeInfo(field, t)} />
      </div>
    );
  }
  if (field.type === "select" || field.type === "relation") {
    const opts = field.type === "select" ? (field.options ?? []).map((o) => ({ value: o.value, label: o.label.includes(".") ? tp(t, o.label) : o.label })) : (options ?? []);
    return (
      <div>
        <label htmlFor={id} className="label">{label}</label>
        <select id={id} name={field.key} defaultValue={str} className="input">
          <option value="">{t.admin.fields.none}</option>
          {opts.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    );
  }
  if (field.type === "lines") {
    return (
      <div>
        <label htmlFor={id} className="label">{label}</label>
        <textarea id={id} name={field.key} rows={3} dir="ltr" defaultValue={Array.isArray(value) ? value.join("\n") : str} className="input field-ltr" />
      </div>
    );
  }
  if (field.type === "textarea" || field.type === "longtext") {
    return (
      <div>
        <label htmlFor={id} className="label">{label}</label>
        <textarea id={id} name={field.key} dir={dir} rows={field.type === "longtext" ? 9 : 3} defaultValue={str} className={`input ${dirClass}`} />
      </div>
    );
  }
  if (field.type === "slug") {
    return (
      <div>
        <label htmlFor={id} className="label">{label}</label>
        <div className="flex gap-2">
          <input id={id} name={field.key} dir={dir} defaultValue={str} className={`input ${dirClass}`} />
          <button
            type="button"
            className="shrink-0 rounded-lg border border-sand-200 px-3 text-xs font-semibold hover:bg-leaf-100"
            onClick={(e) => {
              const form = (e.currentTarget as HTMLButtonElement).form;
              if (!form || !field.slugFrom || !locale) return;
              const src = (form.elements.namedItem(field.slugFrom) as HTMLInputElement | null)?.value ?? "";
              const target = form.elements.namedItem(field.key) as HTMLInputElement | null;
              if (target) target.value = slugify(src, locale);
            }}
          >
            {t.admin.generateSlug}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} name={field.key} type={field.type === "number" ? "number" : "text"} dir={field.type === "number" ? "ltr" : dir} defaultValue={str} className={`input ${dirClass}`} />
    </div>
  );
}

function BaseForm({ entity, id, base, relationOptions, t, isNew }: Pick<EditorProps, "entity" | "id" | "base" | "relationOptions" | "t" | "isNew">) {
  const cfg = entities[entity];
  const [state, action, pending] = useActionState<BaseState, FormData>(saveBase, {});
  const router = useRouter();
  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);
  return (
    <form action={action} className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
      <input type="hidden" name="_entity" value={entity} />
      <input type="hidden" name="_id" value={isNew ? "new" : id} />
      <h2 className="mb-5 font-semibold text-forest-900">{t.admin.general}</h2>
      {cfg.key === "settings" && <p className="mb-4 rounded-lg bg-leaf-100 p-3 text-sm text-forest-800">{t.admin.logoHint}</p>}
      <div className="grid gap-5 md:grid-cols-2">
        {cfg.baseFields.map((f) => (
          <div key={f.key} className={f.type === "image" || f.type === "lines" ? "md:col-span-2" : ""}>
            <Field field={f} value={base[f.key]} t={t} options={f.relation ? relationOptions[f.key] : undefined} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button disabled={pending} className="btn btn-primary !py-2 disabled:opacity-60">{t.admin.save}</button>
        {state.ok && <span className="text-sm text-leaf-600">✓ {t.admin.saved}</span>}
        {state.error && <span className="text-sm text-terracotta-600">{t.admin.saveError}</span>}
      </div>
    </form>
  );
}

function TranslationForm({
  entity,
  id,
  locale,
  values,
  previewUrl,
  t,
  aiEnabled,
  hidden,
}: {
  entity: EntityKey;
  id: string;
  locale: Locale;
  values: Values | undefined;
  previewUrl?: string | null;
  t: Messages;
  aiEnabled: boolean;
  hidden: boolean;
}) {
  const cfg = entities[entity];
  const a = t.admin;
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [state, action, pending] = useActionState<TrSaveState, FormData>(saveTranslation, {});
  const approvedInDb = !!values?.approved;
  const [aiPending, setAiPending] = useState<boolean>(!!values?.aiGenerated && !values?.approved);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiMsg, setAiMsg] = useState<string | null>(null);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const defaultSource = (locales.find((l) => l !== locale && l === "fr") ?? locales.find((l) => l !== locale)) as Locale;
  const [source, setSource] = useState<Locale>(defaultSource);

  useEffect(() => {
    if (state.ok) {
      setAiPending(!!state.aiGenerated && !state.approved);
      router.refresh();
    }
  }, [state, router]);

  async function generate(force = false) {
    setAiMsg(null);
    const hasContent = cfg.required.some((f) => typeof values?.[f] === "string" && (values[f] as string).trim());
    if (approvedInDb && hasContent && !force) {
      setConfirmReplace(true);
      return;
    }
    setConfirmReplace(false);
    const srcForm = document.getElementById(`tr-form-${source}`) as HTMLFormElement | null;
    if (!srcForm) return;
    const fields: Record<string, string> = {};
    for (const f of cfg.trFields) {
      if (f.type === "image" || f.type === "slug") continue;
      const el = srcForm.elements.namedItem(f.key) as HTMLInputElement | HTMLTextAreaElement | null;
      if (el?.value?.trim()) fields[f.key] = el.value;
    }
    if (Object.keys(fields).length === 0) {
      setAiMsg(a.ai.sourceEmpty);
      return;
    }
    setAiBusy(true);
    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from: source, to: locale, fields }),
      });
      if (res.status === 501) {
        setAiMsg(a.ai.notConfigured);
        return;
      }
      const json = await res.json();
      if (!res.ok || !json.fields) throw new Error();
      const form = formRef.current!;
      for (const [k, v] of Object.entries(json.fields as Record<string, string>)) {
        const el = form.elements.namedItem(k) as HTMLInputElement | HTMLTextAreaElement | null;
        if (el) el.value = v;
      }
      const slugField = cfg.trFields.find((f) => f.type === "slug");
      if (slugField?.slugFrom) {
        const slugEl = form.elements.namedItem(slugField.key) as HTMLInputElement | null;
        const fromEl = form.elements.namedItem(slugField.slugFrom) as HTMLInputElement | null;
        if (slugEl && fromEl && !slugEl.value) slugEl.value = slugify(fromEl.value, locale);
      }
      const statusEl = form.elements.namedItem("status") as HTMLSelectElement | null;
      if (statusEl) statusEl.value = "DRAFT";
      setAiPending(true);
      setAiMsg(a.ai.generated);
    } catch {
      setAiMsg(a.ai.failed);
    } finally {
      setAiBusy(false);
    }
  }

  const st: TrState = translationState(cfg, values);
  const status = (state.ok ? state.status : (values?.status as string)) ?? "DRAFT";

  return (
    <div hidden={hidden} className="rounded-2xl bg-white p-5 shadow-soft sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-forest-900">
            {a.translationsOf} · <span className={locale === "ar" ? "font-arabic" : ""}>{localeInfo[locale].native}</span>
          </h2>
          {aiPending ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">{a.ai.badge}</span>
          ) : values?.approved ? (
            <span className="rounded-full bg-leaf-100 px-2.5 py-0.5 text-xs font-semibold text-forest-800">✓ {a.ai.approved}</span>
          ) : null}
        </div>
        {previewUrl ? (
          <a href={previewUrl} target="_blank" className="text-sm font-semibold text-leaf-600 hover:underline">{a.previewLanguage} ↗</a>
        ) : (
          <span className="text-xs text-ink-400">{a.noPreview}</span>
        )}
      </div>

      {(
        <div className="mb-5 rounded-xl border border-dashed border-leaf-500/40 bg-leaf-100/50 p-4">
          <p className="mb-2 text-sm font-semibold text-forest-800">✦ {a.ai.title}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm">{a.ai.generateFrom}</span>
            <select value={source} onChange={(e) => setSource(e.target.value as Locale)} className="input !w-auto !py-1.5">
              {locales.filter((l) => l !== locale).map((l) => (
                <option key={l} value={l}>{localeInfo[l].code} · {localeInfo[l].native}</option>
              ))}
            </select>
            <button type="button" disabled={aiBusy || !aiEnabled} onClick={() => generate(false)} className="btn btn-outline !px-4 !py-1.5 text-sm disabled:opacity-50">
              {aiBusy ? a.ai.generating : `→ ${localeInfo[locale].code}`}
            </button>
          </div>
          {!aiEnabled && <p className="mt-2 text-xs text-ink-600">{a.ai.notConfigured}</p>}
          {confirmReplace && (
            <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              <p>{a.ai.approvedWarning}</p>
              <button type="button" onClick={() => generate(true)} className="mt-2 font-semibold underline">{a.ai.confirmReplace}</button>
            </div>
          )}
          {aiMsg && <p className="mt-2 text-sm text-forest-800">{aiMsg}</p>}
        </div>
      )}

      <form id={`tr-form-${locale}`} ref={formRef} action={action} className="space-y-5" lang={locale}>
        <input type="hidden" name="_entity" value={entity} />
        <input type="hidden" name="_id" value={id} />
        <input type="hidden" name="_locale" value={locale} />
        <input type="hidden" name="_ai" value={aiPending ? "1" : "0"} />
        <p className="text-xs text-ink-400">* {a.requiredHint}</p>
        {cfg.trFields
          .filter((f) => !f.key.startsWith("seo"))
          .map((f) => (
            <Field key={f.key} field={f} value={values?.[f.key]} t={t} locale={locale} required={cfg.required.includes(f.key)} formId={`tr-${locale}`} />
          ))}
        {cfg.seo && (
          <fieldset className="space-y-4 rounded-xl border border-sand-200 p-4">
            <legend className="px-1 text-sm font-semibold text-forest-800">{a.seo}</legend>
            {cfg.trFields
              .filter((f) => f.key.startsWith("seo"))
              .map((f) => (
                <Field key={f.key} field={f} value={values?.[f.key]} t={t} locale={locale} required={cfg.required.includes(f.key)} formId={`tr-${locale}`} />
              ))}
          </fieldset>
        )}
        <div className="flex flex-wrap items-end gap-4 border-t border-sand-200 pt-5">
          <div>
            <label className="label" htmlFor={`status-${locale}`}>{a.status}</label>
            <select id={`status-${locale}`} name="status" defaultValue={status} className="input !w-auto">
              <option value="DRAFT">{a.statusDraft}</option>
              <option value="PUBLISHED">{a.statusPublished}</option>
            </select>
          </div>
          <button name="_intent" value="save" disabled={pending} className="btn btn-primary !py-2 disabled:opacity-60">{a.saveLanguage}</button>
          {aiPending && (
            <button name="_intent" value="approve" disabled={pending} className="btn btn-accent !py-2 disabled:opacity-60">✓ {a.ai.approve}</button>
          )}
          <span className="flex items-center gap-2 text-sm">
            <StateChip locale={locale} state={st} title={st === "complete" ? a.complete : st === "draft" ? a.draft : a.missing} />
            {st === "complete" ? a.complete : st === "draft" ? a.draft : a.missing}
          </span>
        </div>
        {aiPending && <p className="text-sm text-amber-800">{a.ai.needsApproval}</p>}
        {state.ok && <p className="text-sm text-leaf-600">✓ {a.saved}</p>}
        {state.error && <p className="text-sm text-terracotta-600">{state.error === "slugTaken" ? a.slugTaken : a.saveError}</p>}
      </form>
    </div>
  );
}

export function EntityEditor(props: EditorProps) {
  const { entity, id, isNew, translations, previewUrls, t, initialLang, aiEnabled } = props;
  const cfg = entities[entity];
  const [tab, setTab] = useState<Locale>(initialLang);
  const labels: Record<TrState, string> = { complete: t.admin.complete, draft: t.admin.draft, missing: t.admin.missing };

  return (
    <div className="space-y-6">
      <BaseForm {...props} />
      {!isNew && (
        <section>
          <div role="tablist" className="mb-3 flex flex-wrap gap-2">
            {locales.map((l) => {
              const st = translationState(cfg, translations[l]);
              return (
                <button
                  key={l}
                  role="tab"
                  type="button"
                  aria-selected={tab === l}
                  onClick={() => setTab(l)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${tab === l ? "bg-forest-800 text-white" : "bg-white text-ink-600 hover:bg-leaf-100"}`}
                >
                  <StateChip locale={l} state={st} title={labels[st]} />
                  <span className={l === "ar" ? "font-arabic" : ""}>{localeInfo[l].native}</span>
                </button>
              );
            })}
          </div>
          {locales.map((l) => (
            <TranslationForm
              key={l}
              entity={entity}
              id={id}
              locale={l}
              values={translations[l]}
              previewUrl={previewUrls[l]}
              t={t}
              aiEnabled={aiEnabled}
              hidden={tab !== l}
            />
          ))}
        </section>
      )}
    </div>
  );
}
