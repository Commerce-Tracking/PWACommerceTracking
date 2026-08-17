import type { ReactNode } from "react";

type InfoFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

/** Champ label / valeur en grille — purement présentationnel. */
export default function InfoField({
  label,
  children,
  className = "",
}: InfoFieldProps) {
  return (
    <div className={`min-w-0 ${className}`}>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm font-medium text-gray-900 dark:text-white/90 break-words">
        {children}
      </dd>
    </div>
  );
}
