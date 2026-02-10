import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Tambah useNavigate
import { useQuery } from "@tanstack/react-query"; // Tambah useQuery
import { getKantors } from "@/store/api/absensiService"; // Tambah import service
import { toast } from "react-toastify"; // Tambah toast

import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

// Widgets & Charts
import History from "@/components/partials/widget/chart/history";
import RadarChart from "@/components/partials/widget/chart/radar-chart";
import RecentOrderTable from "@/components/partials/Table/order-table";

const Dashboard = () => {
  const navigate = useNavigate();

  // 1. Fetch data kantor untuk pengecekan
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
      // Jika kantor cuma 1, langsung tembak ID-nya
      navigate(`/admin/generate-qr?kantor_id=${kantors[0].id}`);
    } else {
      // Jika kantor banyak, biarkan halaman GenerateQR yang nampilin pilihan
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
            <div className="flex-1 text-base font-medium text-slate-600 dark:text-slate-300">Sales</div>
            <div className="flex-none">
              <div className="h-10 w-10 rounded-full bg-indigo-500 text-white text-2xl flex items-center justify-center">
                <Icon icon="ph:car" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-medium text-slate-900 dark:text-white">2.382</span>
            <div className="mt-2">
              <span className="badge bg-indigo-500/10 text-indigo-500 text-xs py-1">3.65%</span>
              <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">Since last week</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex">
            <div className="flex-1 text-base font-medium text-slate-600 dark:text-slate-300">Earnings</div>
            <div className="flex-none">
              <div className="h-10 w-10 rounded-full bg-green-500 text-white text-2xl flex items-center justify-center">
                <Icon icon="ph:money-wavy" />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-medium text-slate-900 dark:text-white">$12,450</span>
            <div className="mt-2">
              <span className="badge bg-green-500/10 text-green-500 text-xs py-1">+12.5%</span>
              <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">Monthly</span>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 2: ABSENSI QUICK ACCESS */}
      <div className="grid grid-cols-12 gap-5">
        <div className="xl:col-span-8 col-span-12">
          <Card title="Panel Operasional Absensi" className="bg-slate-50 dark:bg-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center">
                    <Icon icon="ph:buildings-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-semibold">Manajemen Kantor</h5>
                </div>
                <p className="text-xs text-slate-500 mb-4">Atur lokasi GPS, radius jarak, dan data kantor pusat/cabang.</p>
                <Link to="/admin/kantor">
                  <Button text="Daftar Kantor" className="btn-outline-dark btn-sm w-full bg-indigo-700" />
                </Link>
              </div>

              {/* TOMBOL YANG DIUPDATE */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                    <Icon icon="ph:qr-code-duotone" className="text-2xl" />
                  </div>
                  <h5 className="text-sm font-semibold">Generator QR</h5>
                </div>
                <p className="text-xs text-slate-500 mb-4">Tampilkan QR Code harian untuk discan karyawan di lokasi.</p>
                <Button 
                  text="Buka Panel QR" 
                  className="bg-indigo-700 btn-sm w-full" 
                  onClick={handleGenerateClick}
                  isLoading={loadingKantor}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="xl:col-span-4 col-span-12">
          <Card title="Presensi Mandiri" className="bg-green-50 dark:bg-green-900/10">
            <div className="text-center py-2">
              <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon="ph:camera-duotone" className="text-3xl" />
              </div>
              <h5 className="text-sm font-semibold mb-2">Scan Kehadiran</h5>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Pastikan GPS aktif & berada di area kantor.
              </p>
              <Link to="/user/scanner">
                <Button text="Scan QR Sekarang" className="btn-success w-full" icon="ph:scan-bold" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* SECTION 3: CHARTS & TABLES */}
      <div className="grid grid-cols-12 gap-5">
        <div className="xl:col-span-8 col-span-12">
          <Card title="History Absensi" headerslot={<div className="text-sm text-slate-400 font-normal underline cursor-pointer">View All</div>}>
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