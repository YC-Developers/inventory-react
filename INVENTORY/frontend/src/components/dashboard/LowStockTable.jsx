import { AlertTriangle } from "lucide-react"
import { Link } from "react-router-dom"

export default function LowStockTable({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No low stock items found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Stock
            </th>
            <th
              scope="col"
              className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  <Link to={`/products/${product._id}`} className="hover:underline text-green-700">
                    {product.name}
                  </Link>
                </div>
                <div className="text-sm text-gray-500">{product.sku}</div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product.currentStock}</div>
                <div className="text-xs text-gray-500">Min: {product.minStockLevel}</div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-center">
                <div className="flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2 py-1 rounded-full">
                    Low Stock
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
