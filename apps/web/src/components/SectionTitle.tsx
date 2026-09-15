export function SectionTitle({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10">
      <p className="mb-3 font-display text-sm font-semibold text-accent">{index}</p>
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 max-w-2xl text-muted text-pretty">{subtitle}</p>}
    </div>
  );
}
