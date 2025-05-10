import { formatDistanceToNow } from "date-fns"
import { Link } from "react-router-dom"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function RecentMovementsTable({ movements = [] }) {
  if (movements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recent stock movements found.</p>
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
              Type
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {movements.map((movement, index) => (
            <tr key={movement._id || movement.id || index} className="hover:bg-gray-50">
              <td className="px-3 py-4 whitespace-nowrap">
                {movement.product ? (
                  <>
                    <div className="text-sm font-medium text-gray-900">
                      <Link 
                        to={`/products/${movement.product._id || movement.product.id}`} 
                        className="hover:underline text-green-700"
                      >
                        {movement.product.name}
                      </Link>
                    </div>
                    <div className="text-sm text-gray-500">{movement.product.sku}</div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">Product not available</div>
                )}
              </td>
              <td className="px-3 py-4 whitespace-nowrap">
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    movement.type === "in" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {movement.type === "in" ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Stock In
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Stock Out
                    </>
                  )}
                </div>
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{movement.quantity}</td>
              <td className="px-3 py-4 whitespace-nowrap">
                {movement.date ? (
                  <>
                    <div className="text-sm text-gray-900">{new Date(movement.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(movement.date), { addSuffix: true })}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">No date available</div>
                )}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{movement.reference || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
