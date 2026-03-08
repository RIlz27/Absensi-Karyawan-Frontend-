import React, { useEffect, useState, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loading from "@/components/Loading";

const AuthLayout = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
    fetch(`${API_BASE}/initial-setup/check`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.setup_done) {
          navigate("/setup", { replace: true });
        } else {
          // Guard: if user hits back button to /login while already authenticated
          const token = localStorage.getItem("token");
          const userStr = localStorage.getItem("user");
          if (token && userStr) {
             try {
                const user = JSON.parse(userStr);
                if (user.role === "admin") {
                   navigate("/dashboard", { replace: true });
                } else {
                   navigate("/user/dashboard", { replace: true });
                }
             } catch (e) {
                // Ignore parse errors, just show login
             }
          }
          setChecking(false);
        }
      })
      .catch(() => {
        setChecking(false);
      });
  }, [navigate]);

  if (checking) {
    return (
      <div className="fixed inset-0 bg-[#0b0f1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Memuat sistem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-page-height">
        <Suspense fallback={<Loading />}>
          <ToastContainer />
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default AuthLayout;
