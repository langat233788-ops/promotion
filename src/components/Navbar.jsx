import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-blue-600">
          PromoSystem
        </h1>

        <div className="flex gap-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>

          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>

          <Link to="/register" className="hover:text-blue-600">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;