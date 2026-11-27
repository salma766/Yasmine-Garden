export function Notice({ ok, error }: { ok?: string; error?: string }) {
  if (!ok && !error) return null;
  return (
    <p role="status" className={`rounded-xl px-4 py-3 text-sm font-medium ${error ? "bg-terracotta-500/10 text-terracotta-600" : "bg-leaf-100 text-forest-800"}`}>
      {error || ok}
    </p>
  );
}
