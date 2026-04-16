import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import API from "@/store/api/absensi-service.js";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const RiwayatAbsen = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const response = await API.get(`/history?month=${selectedMonth}&year=${selectedYear}`);
        setHistoryData(response.data || []);
      } catch (error) {
        console.error("Gagal mengambil riwayat absen", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [selectedMonth, selectedYear]);

  const monthOptions = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const yearOptions = Array.from({ length: 5 }, (_, i) => String(now.getFullYear() - i));

  const getStatusConfig = (status) => {
    switch (status) {
      case "Hadir":
        return { icon: "ph:check-circle-bold", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
      case "Terlambat":
        return { icon: "ph:clock-countdown-bold", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
      case "Izin":
      case "Sakit":
        return { icon: "ph:files-bold", color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" };
      case "Alfa":
      default:
        return { icon: "ph:x-circle-bold", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
    }
  };

  const getDisplayTime = (timeString) => {
    if (!timeString) return "--:--";
    if (timeString.includes(" ")) return timeString.split(" ")[1].substring(0, 5);
    try {
      const d = new Date(timeString);
      if (isNaN(d.getTime())) return "--:--";
      return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":");
    } catch {
      return "--:--";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">Riwayat Absensi</h4>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-0">Lihat histori absensi bulanan Anda di sini.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 flex gap-2">
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 dark:text-white outline-none cursor-pointer"
            >
              {monthOptions.map(m => (
                <option key={m.value} value={m.value} className="text-slate-800">{m.label}</option>
              ))}
            </select>
            <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 dark:text-white outline-none cursor-pointer"
            >
              {yearOptions.map(y => (
                <option key={y} value={y} className="text-slate-800">{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : historyData.length === 0 ? (
           <div className="py-24 flex flex-col items-center justify-center text-center">
             <div className="w-20 h-20 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
               <Icon icon="ph:calendar-blank-duotone" className="text-4xl" />
             </div>
             <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-1">Papan Absen Kosong</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm">Anda belum memiliki riwayat absensi pada bulan terpilih.</p>
             <Link to="/user/scanner" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium active:scale-95 transition-all shadow-lg shadow-indigo-500/30">
                Absen Sekarang
             </Link>
           </div>
        ) : (
          <div className="flex flex-col gap-4">
            {historyData.map((item, index) => {
              const conf = getStatusConfig(item.status);
              return (
                <div key={item.id || index} className="group flex p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-500/30 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                  <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center border ${conf.bg} ${conf.color} ${conf.border}`}>
                    <Icon icon={conf.icon} className="text-2xl" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-base font-bold text-slate-800 dark:text-white">
                        {formatDate(item.tanggal)}
                      </h4>
                      <Badge className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold ${conf.bg} ${conf.color}`}>
                        {item.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400 mt-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <Icon icon="ph:sign-in-bold" className="text-indigo-400" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">Masuk: {getDisplayTime(item.jam_masuk)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="ph:sign-out-bold" className="text-emerald-400" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">Pulang: {getDisplayTime(item.jam_pulang)}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <Icon icon="ph:clock-bold" className="text-slate-400" />
                        <span className="text-xs truncate max-w-[150px]">{item.shift?.nama || "Shift Tidak Diketahui"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default RiwayatAbsen;
