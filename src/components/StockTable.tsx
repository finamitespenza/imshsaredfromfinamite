import { AlertTriangle, LayersIcon } from 'lucide-react';

interface StockTableProps {
  title: string;
  data: any[];
  type: 'low' | 'over';
}

export function StockTable({ title, data, type }: StockTableProps) {
  const icon = type === 'low' ? (
    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
  ) : (
    <LayersIcon className="mr-2 h-5 w-5 text-red-600" />
  );

  const textColor = type === 'low' ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center`}>
        {icon} {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">SKU</th>
              <th className="px-4 py-2 text-left">{type === 'low' ? 'Min Level' : 'Max Level'}</th>
              <th className="px-4 py-2 text-left">Current Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <tr key={index} className={type === 'low' ? 'low-stock' : ''}>
                  <td className="px-4 py-2">{row[0]}</td>
                  <td className="px-4 py-2">{row[1]}</td>
                  <td className="px-4 py-2">{row[2]}</td>
                  <td className="px-4 py-2 font-semibold">{row[3]}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                  No {type === 'low' ? 'low' : 'over'} stock items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}