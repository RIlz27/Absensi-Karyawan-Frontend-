import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// IMPORT FUNGSI API (Pastikan semua ada di absensiService)
import {
  getKantors,
  getUsers,
  getAssessments
} from "@/store/api/absensiService.js";

import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

// Widgets & Charts
import History from "@/components/partials/widget/chart/history";
import RadarChart from "@/components/partials/widget/chart/radar-chart";
import RecentOrderTable from "@/components/partials/Table/order-table";

const Dashboard = () => {
  const navigate = useNavigate();

  // 1. Fetch Data Kantor
  const { data: kantors, isLoading: loadingKantor } = useQuery({
    queryKey: ["kantors"],
    queryFn: getKantors,
  });

  // 2. Fetch Data User (Daftar Karyawan)
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // 3. Fetch Data Absensi (Untuk Statistik)
  const { data: allAbsensi = [] } = useQuery({
    queryKey: ["all-absensi"],
    queryFn: () => getAssessments(),
  });

  // --- LOGIC STATISTIK DINAMIS ---
  const todayStr = new Date().toISOString().split('T')[0];

  const totalKaryawan = users.filter(u => u.role === 'karyawan').length;

  const hadirHariIni = allAbsensi.filter(a =>
    a.tanggal === todayStr && (a.status === 'Hadir' || a.status === 'Terlambat')
  ).length;

  const terlambatHariIni = allAbsensi.filter(a =>
    a.tanggal === todayStr && a.status === 'Terlambat'
  ).length;

  const persentaseHadir = totalKaryawan > 0 ? Math.round((hadirHariIni / totalKaryawan) * 100) : 0;

  const handleGenerateClick = () => {
    if (!kantors || kantors.length === 0) {
      toast.error("Belum ada kantor terdaftar!");
      navigate("/admin/kantor");
      return;
    }
    if (kantors.length === 1) {
      navigate(`/admin/generate-qr?kantor_id=${kantors[0].id}`);
    } else {
      navigate(`/admin/generate-qr`);
      toast.info("Silahkan pilih kantor");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Karyawan */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <Icon icon="ph:groups-duotone" className="text-2xl text-primary" />
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Aktif</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Karyawan</p>
          <p className="text-2xl font-bold dark:text-white">{totalKaryawan.toLocaleString()}</p>
        </div>

        {/* Hadir Hari Ini */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-emerald-500/30">
          <div className="flex items-center justify-between mb-2">
            <Icon icon="ph:user-check-duotone" className="text-2xl text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">{persentaseHadir}%</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hadir Hari Ini</p>
          <p className="text-2xl font-bold dark:text-white">{hadirHariIni}</p>
        </div>

        {/* Izin / Sakit */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-amber-500/30">
          <div className="flex items-center justify-between mb-2">
            <Icon icon="ph:clock-afternoon-duotone" className="text-2xl text-amber-500" />
            <span className="text-[10px] font-bold text-slate-400 bg-slate-400/10 px-1.5 py-0.5 rounded">Normal</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Izin / Sakit</p>
          <p className="text-2xl font-bold dark:text-white">0</p>
        </div>

        {/* Terlambat */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-red-500/30">
          <div className="flex items-center justify-between mb-2">
            <Icon icon="ph:user-minus-duotone" className="text-2xl text-red-500" />
            <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded">Alert</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Terlambat</p>
          <p className="text-2xl font-bold dark:text-white">{terlambatHariIni}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* PANEL ADMIN (Span 8) */}
        <div className="xl:col-span-8 col-span-12">
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* 1. MANAJEMEN SHIFT */}
            <Link to="/admin/manage-shift" className="group">
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center gap-3 hover:border-amber-500 transition-all hover:shadow-md h-full">
                <div className="h-12 w-12 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon icon="ph:calendar-check-duotone" className="text-2xl" />
                </div>
                <span className="text-xs font-bold dark:text-slate-200">Shift</span>
              </div>
            </Link>

            {/* 2. DATA KARYAWAN */}
            <Link to="/admin/AddUser" className="group">
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center gap-3 hover:border-rose-500 transition-all hover:shadow-md h-full">
                <div className="h-12 w-12 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon icon="ph:user-list-duotone" className="text-2xl" />
                </div>
                <span className="text-xs font-bold dark:text-slate-200">Karyawan</span>
              </div>
            </Link>

            {/* 3. MONITORING KALENDER */}
            <Link to="/admin/calendar" className="group">
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-500 transition-all hover:shadow-md h-full">
                <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon icon="ph:calendar-star-duotone" className="text-2xl" />
                </div>
                <span className="text-xs font-bold dark:text-slate-200">Kalender</span>
              </div>
            </Link>


            {/* 5. PENILAIAN */}
            <Link to="/admin/assessments" className="group">
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center gap-3 hover:border-primary transition-all hover:shadow-md h-full">
                <div className="h-12 w-12 bg-lime-100 dark:bg-lime-500/20 text-lime-600 dark:text-lime-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon icon="ph:clipboard-text-duotone" className="text-2xl" />
                </div>
                <span className="text-xs font-bold dark:text-slate-200">Penilaian</span>
              </div>
            </Link>

            {/* 6. PENGUMUMAN */}
            <Link to="/admin/pengumuman" className="group">
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center gap-3 hover:border-fuchsia-500 transition-all hover:shadow-md h-full">
                <div className="h-12 w-12 bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon icon="ph:megaphone-duotone" className="text-2xl" />
                </div>
                <span className="text-xs font-bold dark:text-slate-200">Broadcast</span>
              </div>
            </Link>

            <Link to="/admin/point-rules" className="group">
              <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center gap-3 hover:border-fuchsia-500 transition-all hover:shadow-md h-full">
                <div className="h-12 w-12 bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon icon="ph:star-fill" className="text-2xl" />
                </div>
                <span className="text-xs font-bold dark:text-slate-200">Point</span>
              </div>
            </Link>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="xl:col-span-12 col-span-12">
          <Card title="Karyawan Terbaru Absen" noborder>
            <RecentOrderTable />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;