import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { claimSession, consumeSessionReplaced } from "@/services/sessions";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [replacedNotice, setReplacedNotice] = useState(false);

  useEffect(() => {
    if (consumeSessionReplaced()) setReplacedNotice(true);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!auth) throw new Error("Firebase not configured");
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await claimSession(cred.user.uid);
      navigate("/admin");
    } catch (err) {
      const code = (err as { code?: string })?.code;
      setError(
        code === "auth/too-many-requests"
          ? "Too many failed attempts. Please wait a few minutes and try again."
          : "Invalid email or password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-inter text-2xl font-bold text-white mb-2">
            Beyond<span className="text-white">Publicity</span>
          </h1>
          <p className="text-white/40 text-sm font-light">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 border border-white/10 p-8 bg-white/[0.02]">
          {replacedNotice && !error && (
            <div className="px-4 py-3 border border-amber-500/30 bg-amber-500/10 text-amber-300 text-sm font-light">
              Your session ended because this account was signed in on another device.
            </div>
          )}
          {error && (
            <div className="px-4 py-3 border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
              placeholder="admin@beyondpublicitymena.com"
            />
          </div>

          <div>
            <label className="block text-white/40 text-xs tracking-widest uppercase font-light mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-sm font-light focus:outline-none focus:border-[#ffffff]/60 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#ffffff] text-black text-sm tracking-widest uppercase font-semibold hover:bg-[#d4b86a] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
