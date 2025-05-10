import LoginForm from "./LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-600 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white">Inventory System</h1>
          <p className="mt-2 text-lg text-green-100">Manage your inventory efficiently</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
