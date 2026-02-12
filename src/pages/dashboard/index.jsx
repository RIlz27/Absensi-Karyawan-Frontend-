import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getKantors } from "@/store/api/absensiService";
import { toast } from "react-toastify";

import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

// Widgets & Charts
import History from "@/components/partials/widget/chart/history";
import RadarChart from "@/components/partials/widget/chart/radar-chart";
import RecentOrderTable from "@/components/partials/Table/order-table";

const Dashboard = () => {
  const navigate = useNavigate();

  // 1. Fetch data kantor untuk pengecekan logic QR
  const { data: kantors, isLoading: loadingKantor } = useQuery({
    queryKey: ["kantors"],
    queryFn: getKantors,
  });

  // 2. Logic Smart Redirect QR
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
    <div className="space-y-5">
      {/* SECTION 1: TOP STATS COUNTER */}
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
        <Card>
          <div className="flex">
            <div className="flex-1 text-base font-medium text-slate-600 dark:text-slate-300">
              Total Karyawan
            </div>
            <div className="flex-none">
              <div className="h-10 w-10 rounded-full bg-indigo-500 text-white text-2xl flex items-center justify-center">
                <Icon icon="ph:users-duotone" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-medium text-slate-900 dark:text-white">
              124
            </span>
            <div className="mt-2 text-sm text-slate-500">Aktif bekerja</div>
          </div>
        </Card>

        <Card>
          <div className="flex">
            <div className="flex-1 text-base font-medium text-slate-600 dark:text-slate-300">
              Kehadiran Hari Ini
            </div>
            <div className="flex-none">
              <div className="h-10 w-10 rounded-full bg-green-500 text-white text-2xl flex items-center justify-center">
                <Icon icon="ph:check-circle-duotone" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-medium text-slate-900 dark:text-white">
              85%
            </span>
            <div className="mt-2 text-sm text-slate-500">Dari total jadwal</div>
          </div>
        </Card>
      </div>

      {/* SECTION 2: PANEL OPERASIONAL (ADMIN & USER) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="xl:col-span-8 col-span-12">
          <Card
            title="Panel Operasional Absensi"
            className="bg-slate-50 dark:bg-slate-800"
          >
            {/* Grid 3 Kolom untuk Admin */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* MANAJEMEN KANTOR */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center">
                    <Icon icon="ph:buildings-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-semibold">Manajemen Kantor</h5>
                </div>
                <p className="text-[11px] text-slate-500 mb-4 h-8 leading-tight">
                  Atur lokasi GPS, radius jarak, dan data kantor pusat/cabang.
                </p>
                <Link to="/admin/kantor">
                  <Button
                    text="Daftar Kantor"
                    className="btn-outline-dark btn-sm w-full bg-indigo-700 text-white"
                  />
                </Link>
              </div>

              {/* GENERATOR QR */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                    <Icon icon="ph:qr-code-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-semibold">Generator QR</h5>
                </div>
                <p className="text-[11px] text-slate-500 mb-4 h-8 leading-tight">
                  Tampilkan QR Code harian untuk discan karyawan di lokasi.
                </p>
                <Button
                  text="Buka Panel QR"
                  className="bg-indigo-700 btn-sm w-full"
                  onClick={handleGenerateClick}
                  isLoading={loadingKantor}
                />
              </div>

              {/* MANAJEMEN SHIFT (FITUR BARU) */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded flex items-center justify-center">
                    <Icon
                      icon="ph:calendar-check-duotone"
                      className="text-2xl"
                    />
                  </div>
                  <h5 className="text-sm font-semibold">Manajemen Shift</h5>
                </div>
                <p className="text-[11px] text-slate-500 mb-4 h-8 leading-tight">
                  Plotting jadwal harian karyawan dan atur shift kerja (pivot).
                </p>
                <Link to="/admin/manage-shift">
                  <Button
                    text="Atur Jadwal"
                    className="bg-amber-600 hover:bg-amber-700 btn-sm w-full text-white transition-all"
                  />
                </Link>
              </div>
            </div>
          </Card>
        </div>
        {/* PRESENSI MANDIRI (USER SECTION) */}
        <div className="xl:col-span-4 col-span-12">
          <Card
            title="Presensi Mandiri"
            className="bg-green-50 dark:bg-green-900/10"
          >
            <div className="text-center py-2">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="ph:camera-duotone" className="text-3xl" />
              </div>
              <h5 className="text-sm font-semibold mb-2">Scan Kehadiran</h5>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Pastikan GPS aktif & berada di area kantor.
              </p>
              <Link to="/user/scanner">
                <Button
                  text="Scan QR Sekarang"
                  className="btn-success w-full"
                  icon="ph:scan-bold"
                />
              </Link>
            </div>
          </Card>
        </div>
        {/* TOMBOL MANAJEMEN KARYAWAN */}
        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-rose-100 text-rose-600 rounded flex items-center justify-center">
              <Icon icon="ph:user-list-duotone" className="text-2xl" />
            </div>
            <h5 className="text-sm font-semibold">Data Karyawan</h5>
          </div>
          <p className="text-[11px] text-slate-500 mb-4 h-8 leading-tight">
            Tambah karyawan baru, edit data NIP, atau nonaktifkan akun.
          </p>
          <Link to="/admin/users">
            <Button
              text="Kelola User"
              className="bg-rose-600 hover:bg-rose-700 btn-sm w-full text-white transition-all"
            />
          </Link>
        </div>
      </div>

      {/* SECTION 3: CHARTS & TABLES */}
      <div className="grid grid-cols-12 gap-5">
        <div className="xl:col-span-8 col-span-12">
          <Card
            title="History Absensi"
            headerslot={
              <div className="text-sm text-slate-400 font-normal underline cursor-pointer">
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
