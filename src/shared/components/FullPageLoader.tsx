export function FullPageLoader() {
  return (
    <div className="center-page" role="status" aria-live="polite">
      <div className="spinner" />
      <p>Cargando…</p>
    </div>
  );
}
