import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import PublicSite from "@/pages/PublicSite";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ConfirmProvider } from "@/components/ConfirmDialog";

const Login = lazy(() => import("@/pages/admin/Login"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const PortfolioManager = lazy(() => import("@/pages/admin/PortfolioManager"));
const SlideshowManager = lazy(() => import("@/pages/admin/SlideshowManager"));
const ClientsManager = lazy(() => import("@/pages/admin/ClientsManager"));
const TeamManager = lazy(() => import("@/pages/admin/TeamManager"));
const ServicesManager = lazy(() => import("@/pages/admin/ServicesManager"));
const LegalManager = lazy(() => import("@/pages/admin/LegalManager"));
const AboutManager = lazy(() => import("@/pages/admin/AboutManager"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout"));
const ProtectedRoute = lazy(() => import("@/components/admin/ProtectedRoute"));

function AdminLoader() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#ffffff] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route
            path="/privacy"
            element={
              <Suspense fallback={<AdminLoader />}>
                <Privacy />
              </Suspense>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense fallback={<AdminLoader />}>
                <Terms />
              </Suspense>
            }
          />
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminLoader />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminLoader />}>
                <ProtectedRoute>
                  <ErrorBoundary>
                    <ConfirmProvider>
                      <AdminLayout />
                    </ConfirmProvider>
                  </ErrorBoundary>
                </ProtectedRoute>
              </Suspense>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="portfolio" element={<PortfolioManager />} />
            <Route path="slideshow" element={<SlideshowManager />} />
            <Route path="clients" element={<ClientsManager />} />
            <Route path="team" element={<TeamManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="legal" element={<LegalManager />} />
            <Route path="about" element={<AboutManager />} />
          </Route>
          <Route
            path="*"
            element={
              <Suspense fallback={<AdminLoader />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#fff",
              border: "1px solid rgba(201, 168, 76, 0.3)",
              fontSize: "14px",
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
