import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

function AppLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Header */}
      <header className="bg-blue-900 text-white shadow">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <h1 className="text-2xl font-bold">
            Promotion Portal
          </h1>

          <div className="flex items-center gap-4">

            <span className="text-sm">
              {user?.email}
            </span>

            <button
              onClick={logout}
              className="rounded bg-red-600 px-4 py-2 hover:bg-red-700"
            >
              Logout
            </button>

          </div>

        </div>

        <nav className="border-t border-blue-800">

          <div className="mx-auto flex max-w-7xl gap-8 px-6 py-3">

            <Link to="/dashboard">Dashboard</Link>

            <Link to="/apply">Apply</Link>

            <Link to="/track">Track</Link>

            <Link to="/payments">Payments</Link>

            <Link to="/notifications">Notifications</Link>

            <Link to="/profile">Profile</Link>

          </div>

        </nav>

      </header>

      {/* Main Content */}

      <main className="mx-auto w-full max-w-7xl flex-1 p-8">

        {children}

      </main>

      {/* Footer */}

      <footer className="bg-white border-t">

        <div className="mx-auto flex max-w-7xl justify-center gap-10 py-5 text-sm">

          <a href="#">Contact</a>

          <a href="#">Help</a>

          <a href="#">How It Works</a>

          <a href="#">Terms</a>

          <a href="#">Privacy Policy</a>

        </div>

      </footer>

    </div>
  );
}

export default AppLayout;