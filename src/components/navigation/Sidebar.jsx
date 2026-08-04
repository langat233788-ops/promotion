import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Apply", path: "/apply" },
    { name: "Track Applications", path: "/track" },
    { name: "Payments", path: "/payments" },
    { name: "Notifications", path: "/notifications" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-blue-900 text-white">

      {/* Brand */}

      <div className="border-b border-blue-700 p-6">

        <h1 className="text-xl font-bold leading-tight">
          United Nations
        </h1>

        <p className="mt-1 text-sm text-blue-200">
          Promotional Award
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 p-4">

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `mb-2 block rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-white font-semibold text-blue-900"
                  : "hover:bg-blue-800"
              }`
            }
          >
            {item.name}
          </NavLink>

        ))}

      </nav>

    </div>
  );
}

export default Sidebar;