import React, { useState } from "react";
import { Link } from "react-router-dom"; // Tambahin Link
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button"; // Import Button bawaan
import History from "@/components/partials/widget/chart/history";
import RadarChart from "@/components/partials/widget/chart/radar-chart";

// ... image imports tetap sama seperti kode lo ...
import Usa from "@/assets/images/flags/usa.svg";
import Brasil from "@/assets/images/flags/bra.svg";
import Japan from "@/assets/images/flags/japan.svg";
import Italy from "@/assets/images/flags/italy.svg";
import Chin from "@/assets/images/flags/chin.svg";
import India from "@/assets/images/flags/india.svg";
import Earnings from "@/components/partials/widget/chart/Earnings";
import RecentOrderTable from "@/components/partials/Table/order-table";

// ... data country & source tetap sama ...

const Dashboard = () => {
  return (
    <div className=" space-y-5">

      <div className="grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
        {/* Card Sales, Earnings, Visitors, Orders tetap di sini */}
       <Card>
          <div>
            <div className="flex">
              <div className="flex-1 text-base font-medium">Sales</div>
              <div className="flex-none">
                <div className="h-10 w-10  rounded-full bg-indigo-500 text-white text-2xl flex items-center justify-center">
                  <Icon icon="ph:car" />
                </div>
              </div>
            </div>
            <div>
              <span className=" text-2xl font-medium text-gray-800  dark:text-white">
                2.382
              </span>
              <span className="  space-x-2 block mt-4 ">
                <span className="badge bg-indigo-500/10 text-indigo-500 ">
                  3.65%
                </span>
                <span className=" text-sm text-gray-500 dark:text-gray-400">
                  Since last week
                </span>
              </span>
            </div>
          </div>
        </Card>
        {/* ... Card lainnya (Earnings, Visitors, Orders) ... */}
      </div>
      
      {/* =============================== 
          BARU: QUICK ACCESS ABSENSI 
          =============================== */}
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-6 col-span-12">
          <Card title="Panel Admin Absensi" className="bg-indigo-50 dark:bg-slate-800">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  Kelola QR Code untuk presensi masuk dan pulang karyawan.
                </div>
                <Link to="/admin/generate-qr">
                  <Button 
                    text="Generate QR Sekarang" 
                    className="btn-primary btn-sm"
                    icon="heroicons-outline:qr-code" 
                  />
                </Link>
              </div>
              <div className="flex-none text-4xl text-indigo-500 opacity-20">
                <Icon icon="heroicons:briefcase" />
              </div>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-6 col-span-12">
          <Card title="Presensi Karyawan" className="bg-green-50 dark:bg-slate-800">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  Lakukan scan QR Code untuk mencatat kehadiran harian Anda.
                </div>
                <Link to="/user/scanner">
                  <Button 
                    text="Buka Kamera Scan" 
                    className="btn-success btn-sm"
                    icon="heroicons-outline:camera" 
                  />
                </Link>
              </div>
              <div className="flex-none text-4xl text-green-500 opacity-20">
                <Icon icon="heroicons:user-circle" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* =============================== 
          KODE LAMA LO (Stats Grid) 
          =============================== */}
      

      {/* ... Sisa grid xl:col-span-7 dsb tetap sama ... */}
    </div>
  );
};

export default Dashboard;