interface PageHeaderProps {
  readonly title: string;
  readonly subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-emerald-950">{title}</h1>
      <p className="mt-1 text-stone-600">{subtitle}</p>
    </div>
  );
}