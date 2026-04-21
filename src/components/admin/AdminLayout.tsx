import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useIdleTimeout } from "@/lib/useIdleTimeout";
import { claimSession, clearLocalSessionId, getLocalSessionId, watchSession } from "@/services/sessions";

const IDLE_MS = 30 * 60 * 1000;
const WARNING_MS = 25 * 60 * 1000;

const navItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/slideshow", label: "Slideshow" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/portfolio", label: "Portfolio" },
  { to: "/admin/team", label: "Team" },
  { to: "/admin/about", label: "About" },
  { to: "/admin/clients", label: "Clients" },  
  { to: "/admin/legal", label: "Legal" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    if (!auth) return;
    clearLocalSessionId();
    await signOut(auth);
    navigate("/admin/login");
  };

  const handleSessionReplaced = async () => {
    if (!auth) return;
    clearLocalSessionId();
    await signOut(auth);
    navigate("/admin/login?reason=replaced", { replace: true });
  };

  useEffect(() => {
    if (!user) return;
    let unsub: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      let sessionId = getLocalSessionId();
      if (!sessionId) {
        try {
          sessionId = await claimSession(user.uid);
        } catch {
          return;
        }
      }
      if (cancelled || !sessionId) return;
      unsub = watchSession(user.uid, sessionId, handleSessionReplaced);
    })();
    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const { warning, secondsLeft, stayActive } = useIdleTimeout({
    idleMs: IDLE_MS,
    warningMs: WARNING_MS,
    onIdle: handleSignOut,
  });

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

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

      {warning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full mx-6 bg-[#0a0a0a] border border-white/20 p-8">
            <h2 className="font-inter text-xl font-bold mb-3">Still there?</h2>
            <p className="text-white/60 text-sm font-light mb-2">
              You'll be signed out in
            </p>
            <p className="font-inter text-3xl font-bold mb-6 tracking-wider">
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </p>
            <p className="text-white/40 text-xs font-light mb-6">
              For security, inactive sessions are automatically signed out.
            </p>
            <div className="flex gap-3">
              <button
                onClick={stayActive}
                className="flex-1 px-4 py-3 bg-white text-black text-xs tracking-widest uppercase font-light hover:bg-white/90 transition-colors"
              >
                Stay Signed In
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 px-4 py-3 border border-white/10 text-white/50 text-xs tracking-widest uppercase font-light hover:border-red-500/50 hover:text-red-400 transition-colors"
              >
                Sign Out Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
