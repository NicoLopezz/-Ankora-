interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 animate-fade-in-up md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#b8a99e]">
            <span className="h-1.5 w-1.5 rotate-45 bg-[#D4A45A]" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 text-2xl font-semibold text-[#ddcfc9] md:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-[#b8a99e]">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
