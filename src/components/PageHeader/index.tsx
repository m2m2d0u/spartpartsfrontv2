import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
};

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
          {title}
        </h2>
        <nav className="mt-2">
          <ol className="flex items-center gap-1.5 text-body-sm">
            {breadcrumbs.map((item, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                {idx > 0 && (
                  <span className="text-dark-6">/</span>
                )}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-dark-6 hover:text-primary dark:text-dark-7"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-primary">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
