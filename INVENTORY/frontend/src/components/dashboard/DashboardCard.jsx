export default function DashboardCard({ title, value, icon, bgColor = "bg-green-50", textColor = "text-green-700" }) {
    return (
      <div className={`${bgColor} rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md`}>
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-full bg-white bg-opacity-50">{icon}</div>
          <div className="ml-5">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className={`mt-1 text-3xl font-semibold ${textColor}`}>{value}</div>
          </div>
        </div>
      </div>
    )
  }
  