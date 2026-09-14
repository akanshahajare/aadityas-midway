import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: "dashboard",
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: "orders",
  },
  {
    label: "Menu",
    path: "/admin/menu",
    icon: "menu",
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: "categories",
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: "customers",
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
    icon: "analytics",
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: "settings",
  },
];

const icons = {
  dashboard: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),

  orders: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12v18H6z" />
      <path d="M9 7h6" />
      <path d="M9 11h6" />
      <path d="M9 15h4" />
    </svg>
  ),

  menu: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16v16H4z" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  ),

  categories: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
      <circle cx="8" cy="5" r="2" />
      <circle cx="15" cy="12" r="2" />
      <circle cx="10" cy="19" r="2" />
    </svg>
  ),

  customers: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),

  analytics: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 4-4 3 2 5-6" />
    </svg>
  ),

  settings: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V20h-2.5v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H5V11h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L8 6.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V5h2.5v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v2.5h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  ),
};

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="h-screen overflow-hidden bg-brand-cream">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-hidden border-r border-brand-green/10 bg-brand-green-dark text-white lg:flex lg:flex-col">
          {/* Brand */}
          <div className="shrink-0 border-b border-white/10 px-6 py-6">
            <p className="font-display text-xl font-bold">
              Aaditya's Midway
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-brand-gold-light">
              Admin Panel
            </p>
          </div>

          {/* Scrollable Navigation */}
          <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-6 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]">
            <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Management
            </p>

            <div className="space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-white/10 text-brand-gold-light"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {icons[item.icon]}

                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Bottom Actions - Always Visible */}
          <div className="shrink-0 border-t border-white/10 bg-brand-green-dark p-4">
            <NavLink
              to="/"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <span className="text-lg">←</span>
              <span>View Website</span>
            </NavLink>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <span className="text-lg">↪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {/* Admin Topbar */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-brand-green/10 bg-brand-white/95 px-4 backdrop-blur sm:px-6">
            {/* Mobile Brand */}
            <div className="lg:hidden">
              <p className="font-display text-lg font-bold text-brand-green-dark">
                Aaditya's Midway
              </p>

              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-gold-dark">
                Admin
              </p>
            </div>

            {/* Desktop Heading */}
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-brand-green-dark">
                Restaurant Administration
              </p>

              <p className="text-xs text-text-secondary">
                Manage your restaurant operations
              </p>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-brand-green-dark">
                  {user?.name || "Admin"}
                </p>

                <p className="text-xs text-text-secondary">
                  Administrator
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            </div>
          </header>

          {/* Mobile Navigation */}
          <div className="shrink-0 border-b border-brand-green/10 bg-brand-white px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      isActive
                        ? "bg-brand-green text-white"
                        : "bg-brand-cream text-brand-green-dark"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Scrollable Page Content */}
          <main className="min-h-0 flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

