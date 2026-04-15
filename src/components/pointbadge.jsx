import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/Icon";
import { getPointStatus } from "@/store/api/absensiService.js";

const PointBadge = () => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi buat narik poin via Axios
  const fetchPoints = async () => {
    try {
      const response = await getPointStatus();
      // Mengambil current_balance dari struktur JSON Laravel lu
      setBalance(response?.data?.current_balance || 0);
    } catch (error) {
      console.error("Gagal menarik data poin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Jalankan fetchPoints sekali saat komponen pertama kali dirender
  useEffect(() => {
    fetchPoints();
  }, []);

  if (isLoading) {
    return <div className="h-8 w-20 animate-pulse bg-slate-200 rounded-full"></div>;
  }

  return (
    <div className="flex items-center bg-indigo-50 dark:bg-slate-700 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-slate-600 transition-all hover:scale-105 shadow-sm cursor-pointer">
      <div className="bg-indigo-500 p-1 rounded-full mr-2">
        {/* Ganti Icon ini pake SVG biasa kalau lu ga pake library Icon */}
        <Icon icon="ph:coins-fill" className="text-white text-xs" />
      </div>
      <div>
        <span className="block text-[10px] leading-none text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
          Saldo Poin
        </span>
        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 leading-none">
          {balance.toLocaleString()} <small className="text-[10px]">PTS</small>
        </span>
      </div>
    </div>
  );
};

export default PointBadge;