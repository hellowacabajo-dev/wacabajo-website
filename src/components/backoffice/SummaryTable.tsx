import { formatNumber, formatPercent } from "@/lib/backoffice/labels";

export type TableItem = { label: string; count: number };

/**
 * Bentuk kedua dari rekap yang sama: angka, bukan batang.
 *
 * Batang menjawab "mana yang paling banyak" dalam sekali lihat; tabel menjawab
 * "berapa persisnya" dan jauh lebih enak disalin ke laporan. Keduanya membaca
 * data yang identik, jadi tidak ada angka yang bisa berbeda antara dua
 * tampilan.
 *
 * Tabelnya dibungkus wadah yang bisa digeser sendiri — yang tidak boleh itu
 * halaman yang ikut bergeser mendatar, bukan tabel yang menggeser isinya.
 */
export function SummaryTable({
  items,
  total,
  head = "Opsi",
  showPercent = true,
}: {
  items: TableItem[];
  total: number;
  head?: string;
  showPercent?: boolean;
}) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[18rem] border-collapse font-sans text-sm">
        <thead>
          <tr className="border-b border-border-strong">
            <th scope="col" className="py-2 pr-4 text-left font-medium">
              {head}
            </th>
            <th scope="col" className="py-2 pl-4 text-right font-medium">
              Jumlah
            </th>
            {showPercent && (
              <th
                scope="col"
                className="w-20 py-2 pl-4 text-right font-medium"
              >
                Persen
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.label} className="border-b border-border">
              <th
                scope="row"
                className="py-2.5 pr-4 text-left font-normal break-words"
              >
                {item.label}
              </th>
              <td className="py-2.5 pl-4 text-right tabular-nums">
                {formatNumber(item.count)}
              </td>
              {showPercent && (
                <td className="py-2.5 pl-4 text-right tabular-nums text-foreground-muted">
                  {formatPercent(item.count, total)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
