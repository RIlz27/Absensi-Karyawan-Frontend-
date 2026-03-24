import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import API from "@/store/api/absensiService";
import axios from "axios";
import { Tab } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import dayjs from "dayjs";

const Laporan = () => {
  // Modal states
  const [harianModal, setHarianModal] = useState(false);
  const [bulananModal, setBulananModal] = useState(false);

  // Filter states for exports
  const [harianDate, setHarianDate] = useState(dayjs().format("YYYY-MM-DD"));

  //demo/testing
  const [bulananMonth, setBulananMonth] = useState(2);
  const [bulananYear, setBulananYear] = useState(2026);

  //   const [bulananMonth, setBulananMonth] = useState(dayjs().month() + 1);
  //   const [bulananYear, setBulananYear] = useState(dayjs().year());

  // API Fetches
  const { data: statistik, isLoading: statLoading } = useQuery({
    queryKey: ["laporan-statistik", bulananMonth, bulananYear],
    queryFn: () =>
      API.get("/laporan/statistik", {
        params: { month: bulananMonth, year: bulananYear },
      }).then((res) => res.data),
  });

  const { data: harian, isLoading: harianLoading } = useQuery({
    queryKey: ["laporan-harian"],
    queryFn: () =>
      API.get("/laporan/harian", { params: { tanggal: harianDate } }).then(
        (res) => res.data,
      ),
  });

  const { data: harianExportData, isLoading: harianExportLoading } = useQuery({
    queryKey: ["laporan-harian-export", harianDate],
    queryFn: () =>
      axios
        .get("/api/laporan/harian", { params: { tanggal: harianDate } })
        .then((res) => res.data),
    enabled: harianModal, // Only fetch when modal is open
  });

  const { data: peringkat, isLoading: peringkatLoading } = useQuery({
    queryKey: ["laporan-peringkat", bulananMonth, bulananYear],
    queryFn: () =>
      API.get("/laporan/peringkat", {
        params: { month: bulananMonth, year: bulananYear },
      }).then((res) => res.data),
  });

  // Handle File Downloads
  const downloadBackendFile = async (type, format) => {
    try {
      const params =
        format === "harian"
          ? { format: "harian", tanggal: harianDate }
          : { format: "bulanan", month: bulananMonth, year: bulananYear };

      const response = await axios.get(`/api/laporan/export/${type}`, {
        params,
        responseType: "blob", // Important for file download
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from response header if available, else default
      const contentDisposition = response.headers["content-disposition"];
      let fileName = `Laporan_${format}_${dayjs().format("YYYYMMDD")}.${type}`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2)
          fileName = fileNameMatch[1];
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file", error);
      // Optionally add toast notification here
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hadir":
        return "text-emerald-500";
      case "Terlambat":
        return "text-amber-500";
      case "Izin/Cuti":
        return "text-indigo-500";
      case "Alfa":
        return "text-rose-500";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="max-w-md mx-auto sm:max-w-3xl lg:max-w-5xl space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Ringkasan Bulanan
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Performa Karyawan secara keseluruhan bulan ini
          </p>
        </div>
        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm hidden sm:block">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff"
            alt="Admin"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 2x2 Analytics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Kehadiran */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-500">
              <Icon icon="heroicons-outline:check-circle" className="w-5 h-5" />
              <span className="text-sm font-medium">Kehadiran</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {statLoading ? "..." : `${statistik?.kehadiran ?? 0}%`}
            </div>
          </div>
        </div>

        {/* Terlambat */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-500">
              <Icon icon="heroicons-outline:clock" className="w-5 h-5" />
              <span className="text-sm font-medium">Terlambat</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {statLoading ? "..." : `${statistik?.terlambat ?? 0}%`}
            </div>
          </div>
        </div>

        {/* Alfa */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-rose-500">
              <Icon icon="heroicons-outline:x-circle" className="w-5 h-5" />
              <span className="text-sm font-medium">Alfa</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {statLoading ? "..." : `${statistik?.alfa ?? 0}%`}
            </div>
          </div>
        </div>

        {/* Izin/Cuti */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sky-500">
              <Icon icon="heroicons-outline:calendar" className="w-5 h-5" />
              <span className="text-sm font-medium">Izin/Cuti</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {statLoading ? "..." : `${statistik?.izin_cuti ?? 0}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Actions Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setHarianModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 p-4 rounded-xl font-semibold shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all "
        >
          <Icon icon="heroicons-outline:clipboard-list" className="w-5 h-5" />
          <span>Rekap Harian</span>
        </button>
        <button
          onClick={() => setBulananModal(true)}
          className="flex items-center justify-center gap-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50 p-4 rounded-xl font-semibold shadow-sm hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all "
        >
          <Icon icon="heroicons-outline:document-report" className="w-5 h-5" />
          <span>Rekap Bulanan</span>
        </button>
      </div>

      {/* Tabs Section */}
      <div className="mt-8">
        <Tab.Group>
          <Tab.List className="flex space-x-2 border-b border-slate-200 dark:border-slate-700 mb-6">
            <Tab
              className={({ selected }) =>
                `pb-3 text-sm font-bold outline-none transition-colors w-1/2 text-center
                            ${selected ? "text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`
              }
            >
              Absen Hari ini
            </Tab>
            <Tab
              className={({ selected }) =>
                `pb-3 text-sm font-bold outline-none transition-colors w-1/2 text-center
                            ${selected ? "text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`
              }
            >
              Peringkat Karyawan
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* Panel Absen Hari Ini */}
            <Tab.Panel className="space-y-3">
              {harianLoading ? (
                <div className="text-center py-4 text-slate-500">
                  Memuat data hari ini...
                </div>
              ) : harian?.length > 0 ? (
                harian.map((row, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 text-sm rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 overflow-hidden">
                        <img
                          src={`https://ui-avatars.com/api/?name=${row.nama}&background=random`}
                          alt={row.nama}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                          {row.nama}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          NIP: {row.nip}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {row.role || "Karyawan"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold text-sm ${getStatusColor(row.status)}`}
                      >
                        {row.status}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {(row.status === "Hadir" ||
                          row.status === "Terlambat") &&
                        row.jam_masuk
                          ? row.jam_masuk
                          : "-"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  Belum ada data hari ini.
                </div>
              )}
            </Tab.Panel>

            {/* Panel Peringkat Karyawan */}
            <Tab.Panel className="space-y-3">
              {peringkatLoading ? (
                <div className="text-center py-4 text-slate-500">
                  Memuat peringkat...
                </div>
              ) : peringkat?.length > 0 ? (
                peringkat.map((item, idx) => {
                  // Calculate arbitrary percentage for visual progress bar (max score context needed, let's max at 300 for 1 month perfect)
                  // 30 days * 10 = 300 points max. Let's cap at 100%.
                  const maxScore = 300;
                  let percentage = Math.round((item.score / maxScore) * 100);
                  if (percentage > 100) percentage = 100;
                  if (percentage < 0) percentage = 0;

                  return (
                    <div
                      key={idx}
                      className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full border-2 border-primary-100 overflow-hidden">
                            <img
                              src={`https://ui-avatars.com/api/?name=${item.user.name}&background=random`}
                              alt={item.user?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {item.user?.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Poin: {item.score}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`font-bold text-lg ${percentage >= 80 ? "text-primary-600" : "text-amber-500"}`}
                        >
                          {percentage}%
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-2">
                        <div
                          className={`h-1.5 rounded-full ${percentage >= 80 ? "bg-primary-600" : "bg-amber-500"}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-500">
                  Belum ada data peringkat.
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* MODAL: Rekap Harian */}
      <Modal
        title="Rekap Harian"
        activeModal={harianModal}
        onClose={() => setHarianModal(false)}
        className="max-w-3xl"
        isBlur
        centered
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500 mb-4">
            Data kehadiran Karyawan dalam satu hari
          </p>

          <div className="mb-6">
            <label className="text-xs font-semibold text-slate-500 mb-2 block">
              Tanggal Rekap:
            </label>
            <input
              type="date"
              className="w-full sm:w-1/2 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              value={harianDate}
              onChange={(e) => setHarianDate(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-700">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800">
                  {[
                    "No",
                    "NIP",
                    "Karyawan",
                    "Shift",
                    "Jam Masuk",
                    "Jam Pulang",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-900 dark:text-slate-200"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {harianExportData?.map((row) => (
                  <tr key={row.no}>
                    <td className="px-4 py-3 text-sm">{row.no}</td>
                    <td className="px-4 py-3 text-sm font-mono">{row.nip}</td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-white">
                      {row.nama}
                    </td>

                    {/* Kolom Shift dengan Badge */}
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          row.shift === "Tambahan"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {row.shift || "Biasa"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm font-mono">
                      {row.jam_masuk || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {row.jam_pulang || "-"}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-black uppercase ${getStatusColor(row.status)}`}
                    >
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-2 border-t border-slate-100">
            <button
              onClick={() => downloadBackendFile("pdf", "harian")}
              className="flex-1 py-2.5 flex items-center justify-center gap-2 border border-rose-200 text-rose-600 rounded-xl font-semibold hover:bg-rose-50 transition-colors"
            >
              <Icon icon="heroicons-outline:document-report" />
              Ekspor PDF
            </button>
            <button
              onClick={() => downloadBackendFile("excel", "harian")}
              className="flex-1 py-2.5 flex items-center justify-center gap-2 border border-emerald-200 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
            >
              <Icon icon="heroicons-outline:document-text" />
              Excel (XLS)
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL: Rekap Bulanan */}
      <Modal
        title="Rekap Bulanan"
        activeModal={bulananModal}
        onClose={() => setBulananModal(false)}
        className="max-w-4xl"
        isBlur
        centered
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500 mb-4">
            Performa tim secara keseluruhan bulan ini
          </p>

          <div className="flex gap-4 mb-6">
            <div className="w-1/2">
              <label className="text-xs font-semibold text-slate-500 mb-2 block">
                Bulan:
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                value={bulananMonth}
                onChange={(e) => setBulananMonth(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {dayjs().month(i).format("MMMM")}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label className="text-xs font-semibold text-slate-500 mb-2 block">
                Tahun:
              </label>
              <input
                type="number"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-purple-500"
                value={bulananYear}
                onChange={(e) => setBulananYear(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-xl max-h-[400px]">
            <table className="min-w-full divide-y divide-slate-100 relative">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  {[
                    "No",
                    "NIP",
                    "Karyawan",
                    "Hadir",
                    "Terlambat",
                    "Alfa",
                    "Izin/Cuti",
                    "Poin",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-900 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Karena modal ekspor bulanan bisa besar, kita pakai query data peringkat (krn strukturnya mirip) jika kita tidak buat state baru, tapi idealnya fetch khusus. Utk mockup ini kita gunakan data 'peringkat' krn fields-nya sama persis */}
                {peringkat?.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm">{row.user.nip}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {row.user.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-emerald-500">
                      {row.hadir}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-amber-500">
                      {row.terlambat}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-rose-500">
                      {row.alfa}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-sky-500">
                      {row.izin}
                    </td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-purple-600">
                      {row.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-2 border-t border-slate-100">
            <button
              onClick={() => downloadBackendFile("pdf", "bulanan")}
              className="flex-1 py-2.5 flex items-center justify-center gap-2 border border-rose-200 text-rose-600 rounded-xl font-semibold hover:bg-rose-50 transition-colors"
            >
              <Icon icon="heroicons-outline:document-report" />
              Ekspor PDF
            </button>
            <button
              onClick={() => downloadBackendFile("excel", "bulanan")}
              className="flex-1 py-2.5 flex items-center justify-center gap-2 border border-emerald-200 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
            >
              <Icon icon="heroicons-outline:document-text" />
              Excel (XLS)
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Laporan;
