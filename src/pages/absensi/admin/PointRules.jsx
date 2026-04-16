import React, { useState, useEffect } from "react";
import { 
  getAdminRules, 
  deleteAdminRule, 
  createAdminRule, 
  updateAdminRule 
} from "@/store/api/absensi-service.js";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shield, Clock, Plus, Trash2, Edit3, Target, Zap, X, Save, Calculator, Users } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

const PointRules = () => {
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rule_name: "",
    target_role: "Semua",
    condition_operator: "<=",
    condition_value: "0",
    point_modifier: 0,
    tipe_quest: "waktu",
  });

  // KASIR POIN (MANUAL ADJUSTMENT)
  const [isCashierModalOpen, setIsCashierModalOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [cashierForm, setCashierForm] = useState({
    user_id: "",
    amount: "",
    reason: ""
  });

  const fetchUsersList = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const url = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
      const response = await axios.get(`${url}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsersList(response.data.data || response.data);
    } catch (error) {
      console.error("Gagal menarik data user:", error);
    }
  };

  useEffect(() => {
    if (isCashierModalOpen && usersList.length === 0) {
      fetchUsersList();
    }
  }, [isCashierModalOpen]);

  const handleCashierSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const url = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
      await axios.post(`${url}/admin/gamification/manual-points`, cashierForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({
        background: "#1e293b",
        color: "#ffffff",
        title: "Poin Disetorkan!",
        text: "Penyesuaian Manual berhasil dicatat.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      setIsCashierModalOpen(false);
      setCashierForm({ user_id: "", amount: "", reason: "" });
    } catch (error) {
      Swal.fire({
        background: "#1e293b",
        color: "#ffffff",
        title: "Gagal",
        text: error?.response?.data?.message || "Gagal menyesuaikan poin manual.",
        icon: "error"
      });
    }
  };

  const fetchRules = async () => {
    try {
      const data = await getAdminRules();
      setRules(data);
    } catch (error) {
      console.error("Gagal mengambil data rules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const openCreateModal = () => {
    setFormData({
      rule_name: "",
      target_role: "Semua",
      condition_operator: "<=",
      condition_value: "0",
      point_modifier: 10,
      tipe_quest: "hadir",
    });
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEditModal = (rule) => {
    let tipe = "waktu";
    if (rule.condition_value === "HADIR") tipe = "hadir";
    else if (rule.condition_value === "ALFA") tipe = "alfa";
    
    setFormData({
      rule_name: rule.rule_name,
      target_role: rule.target_role || "Semua",
      condition_operator: rule.condition_operator,
      condition_value: rule.condition_value,
      point_modifier: rule.point_modifier,
      tipe_quest: tipe,
    });
    setEditingId(rule.id);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (payload.tipe_quest === "hadir") {
         payload.condition_operator = "==";
         payload.condition_value = "HADIR";
      } else if (payload.tipe_quest === "alfa") {
         payload.condition_operator = "==";
         payload.condition_value = "ALFA";
      }
      
      if (modalMode === "create") {
        await createAdminRule(payload);
        Swal.fire({
          title: "Berhasil!",
          text: "Quest baru telah ditambahkan ke sistem.",
          icon: "success",
          background: "#1e293b",
          color: "#f8fafc",
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await updateAdminRule(editingId, payload);
        Swal.fire({
          title: "Diperbarui!",
          text: "Quest berhasil diperbarui.",
          icon: "success",
          background: "#1e293b",
          color: "#f8fafc",
          timer: 2000,
          showConfirmButton: false
        });
      }
      setIsModalOpen(false);
      fetchRules();
    } catch (error) {
      console.error("Error submit rule:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menyimpan pengaturan.",
        icon: "error",
        background: "#1e293b",
        color: "#f8fafc",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Hapus Quest Ini?",
      text: "Data Quest poin tidak bisa dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
      confirmButtonText: "Ya, Hancurkan!",
      cancelButtonText: "Batal",
      background: "#1e293b",
      color: "#f8fafc",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAdminRule(id);
          setRules(rules.filter((rule) => rule.id !== id));
          Swal.fire({
            title: "Dihancurkan!",
            text: "Quest berhasil dihapus.",
            icon: "success",
            background: "#1e293b",
            color: "#f8fafc",
            timer: 2000,
            showConfirmButton: false
          });
        } catch (error) {
          console.error("Gagal menghapus:", error);
          Swal.fire({
            title: "Gagal Hapus!",
            text: "Terjadi kesalahan memusnahkan Quest.",
            icon: "error",
            background: "#1e293b",
            color: "#f8fafc",
          });
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 border-4 border-indigo-500/30 rounded-full blur-sm animate-pulse"></div>
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin z-10"></div>
          <Sparkles className="absolute text-indigo-500 animate-ping opacity-50" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="relative mb-10 p-6 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600 blur-[80px] rounded-full opacity-40 mix-blend-screen pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600 blur-[80px] rounded-full opacity-30 mix-blend-screen pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300 drop-shadow flex items-center justify-center md:justify-start gap-3">
              <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400/20" />
              Game Rules & Rewards
            </h1>
            <p className="mt-2 text-indigo-200/80 font-medium max-w-xl">
              Konfigurasi aturan poin dan reward layaknya game master. Tentukan kriteria pencapaian untuk guild member (pegawai).
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/30 transition-all z-10"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            Tambah Quest 
          </motion.button>
        </div>
      </div>

      {/* Grid of Rules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {rules.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="col-span-full py-16 text-center bg-slate-500/5 backdrop-blur-sm rounded-3xl border border-slate-500/10 border-dashed"
            >
              <Target className="w-16 h-16 mx-auto text-slate-400/50 mb-4" />
              <p className="text-xl font-bold text-slate-600 dark:text-slate-400">Belum Ada Quest Aktif</p>
              <p className="text-slate-500 dark:text-slate-500 mt-2">Buat aturan poin pertama untuk memulai gamifikasi!</p>
            </motion.div>
          ) : (
            rules.map((rule, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                key={rule.id}
                className="group relative p-6 rounded-3xl bg-white/70 dark:bg-[#111322]/80 backdrop-blur-xl border border-slate-200/80 dark:border-indigo-500/20 shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-indigo-500/10 dark:hover:border-indigo-500/50 overflow-hidden transition-all duration-500"
              >
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-600/20 blur-[40px] rounded-full transition-all duration-700 group-hover:bg-indigo-500/30 group-hover:scale-150"></div>
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="pr-4">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                      {rule.rule_name}
                    </h3>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-500/30">
                      <Shield className="w-3.5 h-3.5" />
                      {rule.target_role}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-white dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-inner">
                    <span className={`text-2xl font-black tracking-tighter ${
                      rule.point_modifier > 0 
                      ? 'text-emerald-500 dark:text-emerald-400 drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]' 
                      : 'text-rose-500 dark:text-rose-400 drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)]'
                    }`}>
                      {rule.point_modifier > 0 ? `+${rule.point_modifier}` : rule.point_modifier}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">PTS</span>
                  </div>
                </div>

                <div className="relative z-10 mt-6 bg-slate-50 dark:bg-[#0A0D18]/60 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/50 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      rule.condition_value === 'HADIR' ? 'bg-emerald-100 dark:bg-emerald-500/20' :
                      rule.condition_value === 'ALFA' ? 'bg-rose-100 dark:bg-rose-500/20' :
                      'bg-indigo-100 dark:bg-indigo-500/20'
                    }`}>
                      <Clock className={`w-4 h-4 ${
                        rule.condition_value === 'HADIR' ? 'text-emerald-600 dark:text-emerald-400' :
                        rule.condition_value === 'ALFA' ? 'text-rose-600 dark:text-rose-400' :
                        'text-indigo-600 dark:text-indigo-400'
                      }`} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        {rule.condition_value === 'HADIR' ? 'Trigger Otomatis' : 
                         rule.condition_value === 'ALFA' ? 'Trigger Bot/Cron' : 'Kondisi Relatif Shift'}
                      </p>
                      <p className="font-mono text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                        {rule.condition_value === 'HADIR' ? (
                          <span className="text-emerald-500">SETIAP ABSEN MASUK</span>
                        ) : rule.condition_value === 'ALFA' ? (
                          <span className="text-rose-500">TIDAK HADIR (ALFA)</span>
                        ) : (
                          <>TELAT <span className="text-indigo-500 mx-1">{rule.condition_operator}</span> {rule.condition_value} <span className="text-xs text-slate-400">MNT</span></>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 flex justify-end gap-2 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80">
                  <motion.button 
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(99,102,241,0.1)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openEditModal(rule)}
                    className="p-2.5 text-slate-400 hover:text-indigo-500 rounded-xl transition-colors bg-slate-50 dark:bg-slate-800/50"
                  >
                    <Edit3 className="w-5 h-5" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(244,63,94,0.1)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(rule.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-500 rounded-xl transition-colors bg-slate-50 dark:bg-slate-800/50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Frame Motion Modal for Create / Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  {modalMode === "create" ? "Buat Quest Baru" : "Edit Quest Aktif"}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white dark:bg-slate-800 rounded-full drop-shadow-sm transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleModalSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nama Quest
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.rule_name}
                    onChange={(e) => setFormData({ ...formData, rule_name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium placeholder-slate-400"
                    placeholder="Contoh: Datang Lebih Awal, Telat Banget..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Tipe Quest (Kondisi Trigger)
                  </label>
                  <select
                    value={formData.tipe_quest}
                    onChange={(e) => setFormData({ ...formData, tipe_quest: e.target.value })}
                    className="w-full px-4 py-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700/50 rounded-xl text-indigo-900 dark:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  >
                    <option value="hadir">Poin Dasar Kehadiran (Otomatis saat Absen Masuk)</option>
                    <option value="waktu">Poin Waktu Kehadiran (Disiplin/Telat)</option>
                    <option value="alfa">Poin Alfa (Sanksi Otomatis jika Tidak Absen)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Target Role
                    </label>
                    <select
                      value={formData.target_role}
                      onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    >
                      <option value="Semua">Semua Role</option>
                      <option value="karyawan">Karyawan</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Poin Reward / Denda
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        value={formData.point_modifier}
                        onChange={(e) => setFormData({ ...formData, point_modifier: e.target.value })}
                        className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                        placeholder="10 / -5"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">PTS</span>
                    </div>
                  </div>
                </div>

                {formData.tipe_quest === 'waktu' && (
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                    <label className="block text-sm font-bold text-indigo-800 dark:text-indigo-300 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Toleransi Telat dari Shift (Menit)
                    </label>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mb-3 font-medium leading-relaxed">
                      Lebih terukur! Tidak perlu ganti walau Admin mengganti jadwal shift.<br/>
                      Misal: <strong className="text-indigo-700 dark:text-indigo-300">{"<="} 0</strong> berarti Tepat, <strong className="text-indigo-700 dark:text-indigo-300">{">"} 15</strong> berarti Telat 15 Mnt.
                    </p>
                    <div className="flex gap-3">
                      <select
                        value={formData.condition_operator}
                        onChange={(e) => setFormData({ ...formData, condition_operator: e.target.value })}
                        className="w-1/2 px-3 py-2.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-center"
                      >
                        <option value="<">Kurang dari ( {"<"} )</option>
                        <option value="<=">Maksimal ( {"<="} )</option>
                        <option value=">">Lebih dari ( {">"} )</option>
                        <option value=">=">Minimal ( {">="} )</option>
                        <option value="==">Tepat ( {"=="} )</option>
                      </select>
                      
                      <div className="relative w-1/2">
                        <input
                          type="number"
                          required={formData.tipe_quest === 'waktu'}
                          value={formData.condition_value}
                          onChange={(e) => setFormData({ ...formData, condition_value: e.target.value })}
                          className="w-full pl-4 pr-12 py-2.5 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/30 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                          placeholder="Contoh: 15"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">MNT</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Simpan Quest
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CASHIER MODAL */}
      <AnimatePresence>
        {isCashierModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-xl font-bold text-slate-800 dark:text-emerald-400 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-500" />
                  Kasir Poin (Penalti Manual)
                </h3>
                <button 
                  onClick={() => setIsCashierModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-white dark:bg-slate-800 rounded-full drop-shadow-sm transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCashierSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 items-center gap-2">
                    <Users className="w-4 h-4" /> Karyawan
                  </label>
                  <select
                    required
                    value={cashierForm.user_id}
                    onChange={(e) => setCashierForm({ ...cashierForm, user_id: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="" disabled>-- Pilih Karyawan --</option>
                    {usersList.map(usr => (
                      <option key={usr.id} value={usr.id}>{usr.name} ({usr.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Jumlah Poin
                  </label>
                  <input
                    type="number"
                    required
                    value={cashierForm.amount}
                    onChange={(e) => setCashierForm({ ...cashierForm, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    placeholder="-50 (minus untuk denda)"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">Isi minus (-) untuk memotong poin pelanggaran.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Keterangan Penalti / Reward
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={cashierForm.reason}
                    onChange={(e) => setCashierForm({ ...cashierForm, reason: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium resize-none"
                    placeholder="Contoh: Terlambat tanpa info, buang sampah sembarangan..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    <Save className="w-5 h-5" /> Proses Kasir Poin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PointRules;