import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import API from "@/store/api/absensi-service.js";

const UserPengajuanPage = () => {
  const [activeTab, setActiveTab] = useState("cuti"); // 'cuti' or 'izin'
  const [history, setHistory] = useState([]);
  
  // Forms state
  const [formData, setFormData] = useState({
    jenis: "Tahunan", // untuk cuti
    tanggal_mulai: "",
    tanggal_selesai: "",
    tanggal: "", // untuk izin
    jam_mulai: "", // untuk izin
    jam_selesai: "", // untuk izin
    alasan: "",
  });

  const fetchHistory = async () => {
    try {
      const res = await API.get(`/${activeTab}`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "cuti") {
        await API.post("/cuti", {
          jenis: formData.jenis,
          tanggal_mulai: formData.tanggal_mulai,
          tanggal_selesai: formData.tanggal_selesai,
          alasan: formData.alasan,
        });
      } else {
        await API.post("/izin", {
          tanggal: formData.tanggal,
          jam_mulai: formData.jam_mulai + ":00", // pad seconds for backend
          jam_selesai: formData.jam_selesai + ":00",
          alasan: formData.alasan,
        });
      }
      alert("Pengajuan berhasil disimpan!");
      fetchHistory();
      // reset form
      setFormData({
        jenis: "Tahunan",
        tanggal_mulai: "",
        tanggal_selesai: "",
        tanggal: "",
        jam_mulai: "",
        jam_selesai: "",
        alasan: "",
      });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan. Pastikan form diisi dengan benar.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Pengajuan Izin & Cuti</h1>
          <p className="text-slate-500 dark:text-slate-400">Silakan ajukan izin atau cuti Anda di sini.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700">
          <button
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "cuti" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            onClick={() => setActiveTab("cuti")}
          >
            Pengajuan Cuti
          </button>
          <button
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "izin" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            onClick={() => setActiveTab("izin")}
          >
            Pengajuan Izin
          </button>
        </div>

        {/* Form Input */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold mb-4 dark:text-white">Form {activeTab === "cuti" ? "Cuti" : "Izin"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {activeTab === "cuti" && (
                <>
                <div>
                   <label className="block text-sm font-medium mb-1 dark:text-slate-300">Jenis Cuti</label>
                   <select 
                       className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                       value={formData.jenis}
                       onChange={(e) => setFormData({...formData, jenis: e.target.value})}
                   >
                       <option value="Tahunan">Tahunan</option>
                       <option value="Sakit">Sakit</option>
                       <option value="Khusus">Khusus</option>
                   </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Tanggal Mulai</label>
                        <input type="date" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                               value={formData.tanggal_mulai} onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})} required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Tanggal Selesai</label>
                        <input type="date" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                               value={formData.tanggal_selesai} onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})} required/>
                    </div>
                </div>
                </>
            )}

            {activeTab === "izin" && (
                <>
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Tanggal Izin</label>
                    <input type="date" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                           value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} required/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Jam Mulai</label>
                        <input type="time" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                               value={formData.jam_mulai} onChange={(e) => setFormData({...formData, jam_mulai: e.target.value})} required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Jam Selesai</label>
                        <input type="time" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                               value={formData.jam_selesai} onChange={(e) => setFormData({...formData, jam_selesai: e.target.value})} required/>
                    </div>
                </div>
                </>
            )}

            <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">Alasan</label>
                <textarea rows="3" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2"
                          value={formData.alasan} onChange={(e) => setFormData({...formData, alasan: e.target.value})} required></textarea>
            </div>

            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl transition-all">
               Kirim Pengajuan
            </button>
          </form>
        </div>

        {/* History */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mt-6">
            <h2 className="text-lg font-bold mb-4 dark:text-white">Riwayat Pengajuan {activeTab === "cuti" ? "Cuti" : "Izin"}</h2>
            
            <div className="space-y-4">
               {history.length > 0 ? history.map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center p-4 border border-slate-100 dark:border-slate-700 rounded-xl">
                       <div className="flex gap-4">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.status === 'Approved' ? 'bg-green-100 text-green-600' : item.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                               <Icon icon={item.status === 'Approved' ? "ph:check-circle-fill" : item.status === 'Rejected' ? "ph:x-circle-fill" : "ph:clock-fill"} className="text-2xl" />
                           </div>
                           <div>
                               <h3 className="font-bold text-slate-800 dark:text-white">
                                  {activeTab === "cuti" ? `Cuti ${item.jenis}` : `Izin (${item.jam_mulai} - ${item.jam_selesai})`}
                               </h3>
                               <p className="text-xs text-slate-500 mt-1">
                                  {activeTab === "cuti" ? `${item.tanggal_mulai} sd ${item.tanggal_selesai}` : item.tanggal}
                               </p>
                               <p className="text-xs text-slate-400 mt-1">{item.alasan}</p>
                           </div>
                       </div>
                       <span className={`px-3 py-1 text-xs font-bold rounded-full ${item.status === 'Approved' ? 'bg-green-100 text-green-700' : item.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                           {item.status}
                       </span>
                   </div>
               )) : (
                   <div className="text-center text-slate-500 py-6 text-sm">Belum ada riwayat pengajuan.</div>
               )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserPengajuanPage;
