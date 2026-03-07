import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import API from "@/store/api/AbsensiService";

const AdminApprovalPage = () => {
  const [activeTab, setActiveTab] = useState("cuti"); // 'cuti' or 'izin'
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await API.get(`/${activeTab}`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Apakah Anda yakin ingin ${status === 'Approved' ? 'Menyetujui' : 'Menolak'} pengajuan ini?`)) return;
    
    try {
      await API.patch(`/${activeTab}/${id}/status`, { status });
      alert(`Status pengajuan berhasil diubah menjadi ${status}`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengupdate status.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Persetujuan Izin & Cuti</h1>
          <p className="text-slate-500 dark:text-slate-400">Verifikasi pengajuan cuti dan izin dari karyawan.</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700 w-fit">
          <button
            className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "cuti" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            onClick={() => setActiveTab("cuti")}
          >
            Pengajuan Cuti
          </button>
          <button
            className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "izin" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700"}`}
            onClick={() => setActiveTab("izin")}
          >
            Pengajuan Izin
          </button>
        </div>

        {/* List Table/Cards */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold mb-4 dark:text-white">Daftar Pengajuan {activeTab === "cuti" ? "Cuti" : "Izin"}</h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                            <th className="py-3 px-4">Karyawan</th>
                            <th className="py-3 px-4">{activeTab === "cuti" ? "Jenis Cuti" : "Waktu Izin"}</th>
                            <th className="py-3 px-4">Tanggal</th>
                            <th className="py-3 px-4">Alasan</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {requests.length > 0 ? requests.map((req, idx) => (
                            <tr key={idx} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="font-bold text-slate-800 dark:text-white">{req.user?.name || 'Unknown'}</div>
                                    <div className="text-xs text-slate-400">{req.user?.email || '-'}</div>
                                </td>
                                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                                    {activeTab === "cuti" ? req.jenis : `${req.jam_mulai} - ${req.jam_selesai}`}
                                </td>
                                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                                    {activeTab === "cuti" ? `${req.tanggal_mulai} s/d ${req.tanggal_selesai}` : req.tanggal}
                                </td>
                                <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-[200px] truncate" title={req.alasan}>
                                    {req.alasan}
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    {req.status === 'Pending' ? (
                                        <div className="flex gap-2 justify-center">
                                            <button 
                                                onClick={() => handleUpdateStatus(req.id, 'Approved')}
                                                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                                                title="Setuju"
                                            >
                                                <Icon icon="ph:check-bold" />
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(req.id, 'Rejected')}
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                                                title="Tolak"
                                            >
                                                <Icon icon="ph:x-bold" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
                                            {req.status === 'Approved' ? 'Disetujui' : 'Ditolak'} oleh {req.approver?.name || 'Admin'}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-slate-500 text-sm">Belum ada pengajuan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminApprovalPage;
