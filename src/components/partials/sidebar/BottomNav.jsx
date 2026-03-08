import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useDarkMode from "@/hooks/useDarkMode";
import {
  LayoutDashboard, // Home/Dashboard
  MapPin, // Point / Kantor
  ScanLine, // Scan QR / Generate QR
  BarChart3, // Statistik
  UserCircle, // Profile
} from "lucide-react";

const BottomNav = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isDark] = useDarkMode();

  if (!user) return null;

  const role = user.role; // "admin" atau "karyawan"

  // Konfigurasi Menu Berdasarkan Role
  const KaryawanMenu = [
    { name: "Home", path: "/user/dashboard", icon: LayoutDashboard },
    { name: "Point", path: "/user/point", icon: MapPin }, // Fallback route jika belum ada
    { name: "Scan", path: "/user/scanner", icon: ScanLine },
    { name: "Stats", path: "/user/statistik", icon: BarChart3 }, // Fallback
    { name: "Profile", path: "/user/profile", icon: UserCircle },
  ];

  const AdminMenu = [
    { name: "Home", path: "/dashboard", icon: LayoutDashboard },
    { name: "Kantor", path: "/admin/kantor", icon: MapPin },
    { name: "Gen QR", path: "/admin/generate-qr", icon: ScanLine },
    { name: "Laporan", path: "/admin/laporan", icon: BarChart3 },
    { name: "Profile", path: "/profile", icon: UserCircle }, // Fallback admin profile
  ];

  const menus = role === "admin" ? AdminMenu : KaryawanMenu;

  return (
    <div
      className={`fixed bottom-0 left-0 w-full z-[9999] backdrop-blur-md pb-safe transition-colors duration-300 border-t ${
        isDark 
        ? "bg-[#0b0f19]/80 border-gray-800" // Dark Mode: Deep Blue/Black translucent
        : "bg-[#F8F9FA]/90 border-[#E5E7EB]" // Light Mode: Sangat light smooth gray translucent & Soft border
      }`}
    >
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto relative">
        {menus.map((item, index) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full relative `}
            >
              {/* Active Indicator Bar (Top Edge) */}
              {isActive && (
                <span className="absolute top-0 w-8 h-[3px] bg-indigo-600 rounded-b-md transition-all"></span>
              )}

              <Icon
                strokeWidth={isActive ? 2.5 : 2}
                className={`w-6 h-6 z-10 transition-all duration-300 ${
                  isActive
                    ? "text-indigo-600 scale-110" // Active Zera Indigo
                    : isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-700" 
                }`}
              />
              
              <span
                className={`text-[10px] mt-1 font-medium z-10 transition-colors duration-300 ${
                  isActive
                    ? "text-indigo-600"
                    : isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {item.name}
              </span>

              {/* Active Blob Glow Effect */}
              {isActive && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div className={`w-12 h-12 rounded-full blur-xl opacity-20 ${isDark ? "bg-indigo-500" : "bg-indigo-300"}`}></div>
                 </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
