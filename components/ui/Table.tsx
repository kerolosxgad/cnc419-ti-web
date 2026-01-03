export function Table({ columns, rows }: { columns: { key: string; header: string }[]; rows: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-2 text-left font-semibold text-gray-700">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-2 text-gray-800">{String(r[c.key] ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
