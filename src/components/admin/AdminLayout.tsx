import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/portfolio", label: "Portfolio" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/slideshow", label: "Slideshow" },
  { to: "/admin/clients", label: "Clients" },
  { to: "/admin/team", label: "Team" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-raleway">
      <header className="border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <NavLink to="/admin" className="font-inter text-lg font-bold">
              Beyond<span className="text-white">Publicity</span>
              <span className="text-white/30 text-xs ml-2 font-raleway font-light">CMS</span>
            </NavLink>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-4 py-2 text-xs tracking-widest uppercase font-light transition-colors ${
                      isActive
                        ? "text-white bg-[#ffffff]/10"
                        : "text-white/50 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <NavLink
              to="/"
              className="text-white/40 text-xs tracking-widest uppercase font-light hover:text-white transition-colors"
            >
              View Site
            </NavLink>
            <span className="text-white/20 text-xs">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-white/10 text-white/50 text-xs tracking-widest uppercase font-light hover:border-red-500/50 hover:text-red-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
