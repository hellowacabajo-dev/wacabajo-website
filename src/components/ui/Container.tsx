import { cn } from "@/lib/utils";

/** Lebar baca maksimum situs (72rem, lihat --container-content di globals.css). */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-content px-6 md:px-10", className)}
    >
      {children}
    </div>
  );
}
