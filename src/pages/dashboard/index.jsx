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
          <Card
            title="Panel Operasional Admin"
            className="bg-slate-50 dark:bg-slate-800 h-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* 1. MANAJEMEN KANTOR */}
              <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
                    <Icon icon="ph:buildings-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-bold">Manajemen Kantor</h5>
                </div>
                <p className="text-xs text-slate-500 mb-5 flex-grow">
                  Atur lokasi GPS, radius jarak, dan data kantor pusat/cabang.
                </p>
                <div className="mt-auto">
                  <Link to="/admin/kantor">
                    <Button
                      text="Daftar Kantor"
                      className="btn-sm w-full bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-500 transition-colors"
                    />
                  </Link>
                </div>
              </div>

              {/* 2. GENERATOR QR */}
              <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                    <Icon icon="ph:qr-code-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-bold">Generator QR</h5>
                </div>
                <p className="text-xs text-slate-500 mb-5 flex-grow">
                  Tampilkan QR Code harian untuk discan karyawan di lokasi.
                </p>
                <div className="mt-auto">
                  <Button
                    text="Buka Panel QR"
                    className="bg-indigo-600 hover:bg-indigo-700 btn-sm w-full text-white shadow-md shadow-indigo-500/20"
                    onClick={handleGenerateClick}
                    isLoading={loadingKantor}
                  />
                </div>
              </div>

              {/* 3. MANAJEMEN SHIFT */}
              <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                    <Icon icon="ph:calendar-check-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-bold">Manajemen Shift</h5>
                </div>
                <p className="text-xs text-slate-500 mb-5 flex-grow">
                  Plotting jadwal harian karyawan dan atur shift kerja.
                </p>
                <div className="mt-auto">
                  <Link to="/admin/manage-shift">
                    <Button
                      text="Atur Jadwal"
                      className="bg-amber-500 hover:bg-amber-600 btn-sm w-full text-white shadow-md shadow-amber-500/20"
                    />
                  </Link>
                </div>
              </div>

              {/* 4. LAPORAN ABSENSI */}
              <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                    <Icon icon="ph:file-text-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-bold">Laporan Absensi</h5>
                </div>
                <p className="text-xs text-slate-500 mb-5 flex-grow">
                  Rekap kehadiran harian dan bulanan karyawan detail.
                </p>
                <div className="mt-auto">
                  <Link to="/admin/laporan">
                    <Button
                      text="Lihat Laporan"
                      className="bg-emerald-500 hover:bg-emerald-600 btn-sm w-full text-white shadow-md shadow-emerald-500/20"
                    />
                  </Link>
                </div>
              </div>

              {/* 5. DATA KARYAWAN */}
              <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-center">
                    <Icon icon="ph:user-list-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-bold">Data Karyawan</h5>
                </div>
                <p className="text-xs text-slate-500 mb-5 flex-grow">
                  Tambah karyawan baru, edit NIP, atau nonaktifkan akun.
                </p>
                <div className="mt-auto">
                  <Link to="/admin/AddUser">
                    <Button
                      text="Kelola User"
                      className="bg-rose-500 hover:bg-rose-600 btn-sm w-full text-white shadow-md shadow-rose-500/20"
                    />
                  </Link>
                </div>
              </div>

              {/* 6. MONITORING KALENDER */}
              <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/10 dark:to-slate-900 flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-indigo-200 dark:text-indigo-500/10 text-6xl rotate-12">
                  <Icon icon="ph:calendar-star-duotone" />
                </div>
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Icon icon="ph:calendar-star-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-white">Admin Kalender</h5>
                </div>
                <p className="text-xs text-slate-500 mb-5 flex-grow relative z-10">
                  Peta interaktif kehadiran bulanan & panel darurat bypass jadwal.
                </p>
                <div className="mt-auto">
                  <Link to="/admin/calendar">
                    <Button
                      text="Buka Kalender"
                      className="bg-indigo-600 hover:bg-indigo-700 btn-sm w-full text-white shadow-md shadow-indigo-500/20 font-bold"
                    />
                  </Link>
                </div>
              </div>

              {/* 7. LEADERBOARD */}
              {/* <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-lg flex items-center justify-center">
                    <Icon icon="ph:medal-military-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-bold">Peringkat & Poin</h5>
                </div>
                <p className="text-xs text-slate-500 mb-5 flex-grow">
                  Pantau peringkat terbaik karyawan & berikan poin engagement.
                </p>
                <div className="mt-auto">
                  <Link to="/admin/leaderboard">
                    <Button
                      text="Kelola Peringkat"
                      className="bg-yellow-500 hover:bg-yellow-600 btn-sm w-full text-white shadow-md shadow-yellow-500/20"
                    />
                  </Link>
                </div>
              </div> */}

              {/* 7. LEADERBOARD */}
              <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-lg flex items-center justify-center">
                    <Icon icon="ph:medal-military-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-bold">Penilaian</h5>
                </div>
                <p className="text-xs text-slate-500 mb-5 flex-grow">
                  Pantau Sikap Karyawan dengan penilaian.
                </p>
                <div className="mt-auto">
                  <Link to="/admin/assessments">
                    <Button
                      text="Kelola Peringkat"
                      className="bg-yellow-500 hover:bg-yellow-600 btn-sm w-full text-white shadow-md shadow-yellow-500/20"
                    />
                  </Link>
                </div>
              </div>

              {/* 8. PENGUMUMAN */}
              <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 flex flex-col h-full hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 rounded-lg flex items-center justify-center">
                    <Icon icon="ph:megaphone-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-bold">Pengumuman</h5>
                </div>
                <p className="text-xs text-slate-500 mb-5 flex-grow">
                  Broadcast pesan, agenda, dan informasi ke seluruh karyawan.
                </p>
                <div className="mt-auto">
                  <Link to="/admin/pengumuman">
                    <Button
                      text="Draft Pengumuman"
                      className="bg-fuchsia-500 hover:bg-fuchsia-600 btn-sm w-full text-white shadow-md shadow-fuchsia-500/20"
                    />
                  </Link>
                </div>
              </div>

            </div>
          </Card>
        </div>
      </div>

      {/* SECTION 3: CHARTS & TABLES */}
      <div className="grid grid-cols-12 gap-5">
        <div className="xl:col-span-8 col-span-12">
          <Card
            title="History Absensi"
            headerslot={
              <div className="text-sm text-indigo-500 hover:text-indigo-600 font-semibold underline cursor-pointer transition-colors">
                View All
              </div>
            }
          >
            <History />
          </Card>
        </div>
        <div className="xl:col-span-4 col-span-12">
          <Card title="Traffic Absensi">
            <RadarChart />
          </Card>
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