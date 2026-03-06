import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const now = new Date();
  const tanggal = now.getDate();
  const hari = now.toLocaleDateString("id-ID", { weekday: "long" });
  const bulanTahun = now.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] pb-24">
      <div className="bg-gradient-to-b from-indigo-600 to-purple-600 h-48 -mx-5 rounded-b-[100px] overflow-hidden absolute inset-x-0 top-0"></div>
      <div className="px-5 relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl shadow-indigo-900/10 border border-white/10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {/* Tanggal Otomatis */}
              <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                {tanggal}
              </span>
              <div className="leading-tight">
                <p className="font-bold text-lg text-slate-800 dark:text-white">
                  {hari}
                </p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {bulanTahun}
                </p>
              </div>
            </div>
            <button className="text-indigo-600 dark:text-indigo-300 text-[11px] font-bold bg-indigo-50 dark:bg-indigo-900/40 px-3 py-2 rounded-xl">
              Lihat Riwayat
            </button>
          </div>

          <div className="mt-8">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-4">
              Status minggu ini
            </p>
            <div className="flex justify-between">
              {["Sen", "Sel", "Rab", "Kam", "Jum"].map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <p className="text-[10px] font-bold text-slate-400">{day}</p>
                  <Icon
                    icon={
                      i === 1
                        ? "ph:x-circle-fill"
                        : i === 4
                          ? "ph:circle"
                          : "ph:check-circle-fill"
                    }
                    className={
                      i === 1
                        ? "text-red-500"
                        : i === 4
                          ? "text-slate-200 dark:text-slate-700"
                          : "text-indigo-500"
                    }
                    width="24"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Hadir", val: 24, color: "text-indigo-600" },
            { label: "Absen", val: 5, color: "text-purple-600" },
            { label: "Izin", val: 1, color: "text-slate-400" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-xl shadow-indigo-900/10 text-center border border-slate-100 dark:border-slate-700"
            >
              <div className="relative inline-flex items-center justify-center mb-2">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-700"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 - (stat.val / 30) * 125.6}
                    className={stat.color}
                  />
                </svg>
                <span className="absolute text-xs font-bold dark:text-white">
                  {stat.val}
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Pengajuan Section */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl shadow-indigo-900/10 border border-white/10 mt-8" >
          <div className="flex justify-between items-center mb-4 px-1 ">
            <h4 className="font-extrabold text-slate-800 dark:text-white text-sm uppercase tracking-wider">
              Pengajuan
            </h4>
            <button className="text-indigo-600 text-xs font-bold px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                title: "Lembur",
                status: "Tertunda",
                date: "29 Jan 2026",
                color: "bg-slate-200",
              },
              {
                title: "Izin",
                status: "Disetujui",
                date: "27 Jan 2026",
                color: "bg-indigo-500",
              },
              {
                title: "Cuti",
                status: "Ditolak",
                date: "20 Jan 2026",
                color: "bg-red-500",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#0f172a] p-4 rounded-[24px] flex items-center justify-between shadow-sm border border-slate-50 dark:border-slate-700 active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-inner`}
                  >
                    <Icon icon="ph:paper-plane-tilt-bold" width="20" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {item.status}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[10px] dark:text-slate-300">
                    {item.date}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-0.5">15:55</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-13 left-1/2 -translate-x-1/2 z-50">
        <Link
          to="/user/scanner"
          className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-400">
          <Icon icon="ph:qr-code-bold" width="32" />
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
