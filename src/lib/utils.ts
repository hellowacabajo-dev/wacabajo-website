/** Penggabung className sederhana — cukup untuk kebutuhan boilerplate ini,
 *  sehingga tidak perlu menambah dependency clsx/tailwind-merge. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
