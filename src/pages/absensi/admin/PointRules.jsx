import React, { useState, useEffect } from "react";
import { 
  getAdminRules, 
  deleteAdminRule, 
  createAdminRule, 
  updateAdminRule,
  getAdminItems,
  createAdminItem,
  updateAdminItem,
  deleteAdminItem,
  getAdminLeaderboard,
  getUsers
} from "@/store/api/absensi-service.js";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Edit3, Target, 
  Zap, X, Save, Calculator, Users, ShoppingBag, 
  Trophy, TrendingDown, TrendingUp, Info, Tag
} from "lucide-react";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import axios from "axios";

const PointRules = () => {
  const [activeMainTab, setActiveMainTab] = useState("quests");
  const [rules, setRules] = useState([]);
  const [items, setItems] = useState([]);
  const [leaderboard, setLeaderboard] = useState({ top: [], bottom: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Modal Quest State
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [questModalMode, setQuestModalMode] = useState("create");
  const [editingQuestId, setEditingQuestId] = useState(null);
  const [questForm, setQuestForm] = useState({
    rule_name: "",
    target_role: "Semua",
    condition_operator: "<=",
    condition_value: "0",
    point_modifier: 10,
    tipe_trigger: "waktu" 
  });

  // Modal Item State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemModalMode, setItemModalMode] = useState("create");
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemForm, setItemForm] = useState({
    item_name: "",
    type: "LATE_EXEMPTION",
    value: 30,
    point_cost: 100,
    stock_limit: 50
  });

  // KASIR POIN
  const [isCashierModalOpen, setIsCashierModalOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [cashierForm, setCashierForm] = useState({ user_id: "", amount: "", reason: "" });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rulesData, itemsData, leaderboardData] = await Promise.all([
        getAdminRules(),
        getAdminItems(),
        getAdminLeaderboard()
      ]);
      setRules(rulesData);
      setItems(itemsData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Gagal menarik data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- QUEST LOGIC ---
  const handleQuestSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...questForm };
      
      if (["hadir", "tepat_waktu", "telat", "sangat_awal", "custom"].includes(payload.tipe_trigger)) {
          if (payload.tipe_trigger === "hadir") {
            payload.condition_operator = "=";
            payload.condition_value = "HADIR";
          }
      } else if (payload.tipe_trigger === "alfa") {
        payload.condition_operator = "=";
        payload.condition_value = "ALFA";
      }

      if (questModalMode === "create") {
        await createAdminRule(payload);
      } else {
        await updateAdminRule(editingQuestId, payload);
      }
      toastSuccess("Quest Berhasil Disimpan");
      setIsQuestModalOpen(false);
      fetchData();
    } catch (error) {
      toastError("Gagal menyimpan Quest");
    }
  };

  // --- ITEM LOGIC ---
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    try {
      if (itemModalMode === "create") {
        await createAdminItem(itemForm);
      } else {
        await updateAdminItem(editingItemId, itemForm);
      }
      toastSuccess("Voucher Berhasil Disimpan");
      setIsItemModalOpen(false);
      fetchData();
    } catch (error) {
      toastError("Gagal menyimpan Voucher");
    }
  };

  const handleDeleteQuest = async (id) => {
    const result = await confirmDelete("Hapus Quest ini?");
    if (result.isConfirmed) {
      await deleteAdminRule(id);
      fetchData();
    }
  };

  const handleDeleteItem = async (id) => {
    const result = await confirmDelete("Hapus Voucher ini?");
    if (result.isConfirmed) {
      await deleteAdminItem(id);
      fetchData();
    }
  };

  const fetchUsersList = async () => {
    try {
      const response = await getUsers();
      setUsersList(response.data || response);
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
      const token = localStorage.getItem("token");
      const url = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
      await axios.post(`${url}/admin/gamification/manual-points`, cashierForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toastSuccess("Poin Berhasil Disesuaikan!");
      setIsCashierModalOpen(false);
      setCashierForm({ user_id: "", amount: "", reason: "" });
      fetchData();
    } catch (error) {
      toastError(error?.response?.data?.message || "Gagal menyesuaikan poin.");
    }
  };

  // --- HELPERS ---
  const toastSuccess = (msg) => Swal.fire({ title: msg, icon: "success", background: "#1e293b", color: "#fff", timer: 1500, showConfirmButton: false });
  const toastError = (msg) => Swal.fire({ title: "Gagal", text: msg, icon: "error", background: "#1e293b", color: "#fff" });
  const confirmDelete = (title) => Swal.fire({ title, text: "Tindakan ini tidak bisa dibatalkan!", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", background: "#1e293b", color: "#fff" });

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300 pb-20">
      
      {/* 1. HERO HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="relative p-8 sm:p-12 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                  <Zap size={28} />
                </div>
                Gamification Center
              </h1>
              <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium max-w-xl text-lg leading-relaxed">
                Kelola integritas karyawan melalui sistem quest dinamis dan marketplace reward yang terintegrasi.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => { setQuestModalMode("create"); setIsQuestModalOpen(true); }}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2 active:scale-95"
              >
                <Plus size={20} /> Quest Baru
              </button>
              <button 
                onClick={() => { setItemModalMode("create"); setIsItemModalOpen(true); }}
                className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                title="Tambah Voucher"
              >
                <ShoppingBag size={24} />
              </button>
              <button 
                onClick={() => setIsCashierModalOpen(true)}
                className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all shadow-sm"
                title="Kasir Poin (Manual)"
              >
                <Calculator size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. NAVIGATION TABS */}
        <div className="flex gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 mb-8 max-w-sm shadow-sm">
          {[
            { id: "quests", label: "Quests", icon: Target },
            { id: "shop", label: "Market", icon: Tag },
            { id: "leaderboard", label: "Analytics", icon: Trophy },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id)}
              className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                activeMainTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <AnimatePresence mode="wait">
          {activeMainTab === "quests" && (
            <motion.div 
              key="quests-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {rules.map((rule) => (
                <div key={rule.id} className="p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-indigo-500/50 transition-all shadow-sm group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{rule.rule_name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200 dark:border-white/5">
                          {rule.target_role}
                        </span>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl flex flex-col items-center justify-center min-w-[70px] ${rule.point_modifier > 0 ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20" : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20"}`}>
                      <span className="text-2xl font-black">{rule.point_modifier > 0 ? "+" : ""}{rule.point_modifier}</span>
                      <span className="text-[10px] font-bold uppercase opacity-60">Pts</span>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 mb-6">
                     <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Info size={12} /> Requirement
                     </p>
                     <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {rule.condition_value === "HADIR" ? "Check-in Berhasil" : 
                         rule.condition_value === "ALFA" ? "Ketidakhadiran (Mangkir)" : 
                         `Absen dengan selisih ${rule.condition_operator} ${rule.condition_value} Menit`}
                     </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setQuestModalMode("edit"); setEditingQuestId(rule.id); setQuestForm({...rule, tipe_trigger: rule.condition_value === "HADIR" ? "hadir" : rule.condition_value === "ALFA" ? "alfa" : "custom"}); setIsQuestModalOpen(true); }}
                        className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 rounded-xl transition-all border border-slate-200 dark:border-white/5"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDeleteQuest(rule.id)} className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 rounded-xl transition-all border border-slate-200 dark:border-white/5">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Active Logic</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeMainTab === "shop" && (
            <motion.div 
              key="shop-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {items.map((item) => (
                <div key={item.id} className="p-8 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all">
                  <div className="h-20 w-20 rounded-[28px] bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-100 dark:border-indigo-500/20">
                    <Icon icon={item.type === "LATE_EXEMPTION" ? "ph:ticket-duotone" : "ph:gift-duotone"} className="text-4xl text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{item.item_name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed px-2">
                    {item.type === "LATE_EXEMPTION" ? `Bebas terlambat hingga ${item.value} menit.` : "Reward khusus integritas karyawan."}
                  </p>
                  
                  <div className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-black/20 rounded-2xl mb-8 border border-slate-100 dark:border-white/5">
                    <div className="text-left font-bold">
                      <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Cost</p>
                      <p className="text-amber-600 dark:text-amber-400">{item.point_cost} Pts</p>
                    </div>
                    <div className="text-right font-bold">
                      <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Stock</p>
                      <p className="text-slate-900 dark:text-white">{item.stock_limit || "∞"}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => { setItemModalMode("edit"); setEditingItemId(item.id); setItemForm(item); setIsItemModalOpen(true); }}
                      className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300 shadow-sm"
                    >Edit Card</button>
                    <button onClick={() => handleDeleteItem(item.id)} className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeMainTab === "leaderboard" && (
            <motion.div 
              key="stats-tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {[
                { data: leaderboard.top, title: "Elite Performers", color: "emerald", icon: TrendingUp },
                { data: leaderboard.bottom, title: "Needs Coaching", color: "rose", icon: TrendingDown }
              ].map((section, sIdx) => (
                <div key={sIdx} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-white/5 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${section.color}-500/5 blur-3xl rounded-full`}></div>
                  <h2 className={`text-2xl font-black text-${section.color}-600 dark:text-${section.color}-400 mb-8 flex items-center gap-3 relative z-10`}>
                    <section.icon size={28} />
                    {section.title}
                  </h2>
                  <div className="space-y-4 relative z-10">
                    {section.data.map((user, idx) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5 hover:scale-[1.01] transition-transform">
                        <div className="flex items-center gap-4">
                          <div className="text-xl font-black text-slate-300 dark:text-slate-700 min-w-[24px]">#{idx + 1}</div>
                          <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-white/10">
                            {user.avatar ? <img src={user.avatar} className="h-full w-full object-cover" /> : <Users size={24} className="text-slate-400" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{user.role}</p>
                          </div>
                        </div>
                        <div className={`px-4 py-2 bg-${section.color}-500/5 text-${section.color}-600 dark:text-${section.color}-400 rounded-xl font-black text-lg border border-${section.color}-500/10`}>
                          {user.points} <span className="text-[10px] opacity-50 ml-1">pts</span>
                        </div>
                      </div>
                    ))}
                    {section.data.length === 0 && <div className="p-8 text-center text-slate-400 italic">Belum ada data analitik.</div>}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {isQuestModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0f172a] w-full max-w-xl rounded-[32px] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Zap size={20} />
                  </div>
                  Konfigurasi Aturan
                </h2>
                <button onClick={() => setIsQuestModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/5 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleQuestSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-full sm:col-span-1">
                    <label className="text-[10px] font-black text-slate-500 dark:text-indigo-500 uppercase tracking-widest mb-2 block">Judul Quest</label>
                    <input 
                       type="text" required value={questForm.rule_name} onChange={(e) => setQuestForm({...questForm, rule_name: e.target.value})}
                       placeholder="Contoh: Disiplin Pagi"
                       className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                  </div>
                  <div className="col-span-full sm:col-span-1">
                    <label className="text-[10px] font-black text-slate-500 dark:text-indigo-500 uppercase tracking-widest mb-2 block">Target Role</label>
                    <select 
                       value={questForm.target_role} onChange={(e) => setQuestForm({...questForm, target_role: e.target.value})}
                       className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none h-[54px]"
                    >
                      <option value="Semua">Semua Karyawan</option>
                      <option value="karyawan">Hanya Karyawan</option>
                      <option value="admin">Hanya Admin</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 dark:text-indigo-500 uppercase tracking-widest mb-2 block">Trigger Kondisi</label>
                      <select 
                        value={questForm.tipe_trigger} 
                        onChange={(e) => {
                          const val = e.target.value;
                          let newForm = { ...questForm, tipe_trigger: val };
                          if (val === "alfa") { newForm.condition_operator = "="; newForm.condition_value = "ALFA"; }
                          else if (val === "hadir") { newForm.condition_operator = "="; newForm.condition_value = "HADIR"; }
                          else if (val === "tepat_waktu") { newForm.condition_operator = "<="; newForm.condition_value = "0"; }
                          else if (val === "telat") { newForm.condition_operator = ">"; newForm.condition_value = "15"; }
                          else if (val === "sangat_awal") { newForm.condition_operator = "<="; newForm.condition_value = "-15"; }
                          setQuestForm(newForm);
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 h-[54px] outline-none"
                      >
                         <option value="hadir">Status: Absen Masuk</option>
                         <option value="alfa">Status: Tidak Masuk (Alfa)</option>
                         <option value="tepat_waktu">Waktu: Tepat Waktu</option>
                         <option value="telat">Waktu: Keterlambatan</option>
                         <option value="sangat_awal">Waktu: Datang Sangat Awal</option>
                         <option value="custom">Waktu: Kustom (Manual)</option>
                      </select>
                    </div>

                    {["tepat_waktu", "telat", "sangat_awal", "custom"].includes(questForm.tipe_trigger) && (
                      <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Operator</label>
                          <select 
                             value={questForm.condition_operator} onChange={(e) => setQuestForm({...questForm, condition_operator: e.target.value})}
                             className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 h-[54px] outline-none"
                          >
                             <option value="<">{"Kurang Dari (<)"}</option>
                             <option value="<=">{"Maksimal (<=)"}</option>
                             <option value=">">{"Lebih Dari (>)"}</option>
                             <option value=">=">{"Minimal (>=)"}</option>
                             <option value="=">{"Sama Dengan (=)"}</option>
                             <option value="BETWEEN">{"Antara (Range)"}</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Menit</label>
                          <input 
                             type="text" required value={questForm.condition_value} onChange={(e) => setQuestForm({...questForm, condition_value: e.target.value})}
                             className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-slate-900 dark:text-white font-mono text-center h-[54px] outline-none"
                             placeholder={questForm.condition_operator === "BETWEEN" ? "0,15" : "0"}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block text-center">Hadiah / Denda Poin</label>
                  <div className="relative group">
                    <input 
                      type="number" required value={questForm.point_modifier} onChange={(e) => setQuestForm({...questForm, point_modifier: e.target.value})}
                      className={`w-full bg-white dark:bg-black/20 border-2 ${String(questForm.point_modifier).startsWith('-') ? 'border-rose-200 text-rose-500' : 'border-emerald-200 text-emerald-500'} rounded-3xl px-5 py-6 font-black text-4xl outline-none text-center transition-all`}
                    />
                    <div className={`absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest ${String(questForm.point_modifier).startsWith('-') ? 'text-rose-300' : 'text-emerald-300'}`}>Points</div>
                  </div>
                </div>

                <div className="pt-2">
                   <button type="submit" className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                      <Save size={24} /> Simpan Aturan
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isItemModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-2xl">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-[32px] border border-slate-200 dark:border-white/10 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
                    <ShoppingBag size={20} />
                  </div>
                  Katalog Voucher
                </h2>
                <button onClick={() => setIsItemModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/5 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleItemSubmit} className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Nama Voucher / Item</label>
                  <input type="text" required value={itemForm.item_name} onChange={(e) => setItemForm({...itemForm, item_name: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Misal: Voucher Bebas Telat 30m"/>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Jenis Token</label>
                    <select value={itemForm.type} onChange={(e) => setItemForm({...itemForm, type: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white outline-none">
                      <option value="LATE_EXEMPTION">Bebas Terlambat</option>
                      <option value="OTHER">Rewards Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Value (Menit)</label>
                    <input type="number" required value={itemForm.value} onChange={(e) => setItemForm({...itemForm, value: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white outline-none"/>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div>
                    <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 block">Harga Poin</label>
                    <input type="number" required value={itemForm.point_cost} onChange={(e) => setItemForm({...itemForm, point_cost: e.target.value})} className="w-full bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 rounded-2xl px-5 py-4 text-amber-600 dark:text-amber-400 font-bold outline-none text-xl"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Stok Limit</label>
                    <input type="number" value={itemForm.stock_limit} onChange={(e) => setItemForm({...itemForm, stock_limit: e.target.value})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white outline-none" placeholder="Isi 0 jika unlimited"/>
                  </div>
                </div>

                <button type="submit" className="w-full h-16 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl text-xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-3">
                   Publish Voucher
                </button>
                <button type="button" onClick={() => setIsItemModalOpen(false)} className="w-full text-slate-400 font-bold hover:text-slate-600 dark:hover:text-white transition-colors">Batal</button>
              </form>
            </motion.div>
          </div>
        )}

        {isCashierModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm shadow-2xl">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-[32px] border border-slate-200 dark:border-white/10 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <Calculator size={20} />
                  </div>
                  Kasir Poin (Manual)
                </h2>
                <button onClick={() => setIsCashierModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-white/5 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleCashierSubmit} className="p-8 space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Pilih Karyawan</label>
                  <select 
                    required value={cashierForm.user_id} onChange={(e) => setCashierForm({...cashierForm, user_id: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white outline-none"
                  >
                    <option value="">-- Klik untuk memilih --</option>
                    {usersList.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Jumlah Poin (+ / -)</label>
                    <input 
                      type="number" required value={cashierForm.amount} onChange={(e) => setCashierForm({...cashierForm, amount: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white outline-none font-black text-3xl text-center"
                      placeholder="Contoh: 500 atau -100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Alasan Penyesuaian</label>
                    <textarea 
                      required value={cashierForm.reason} onChange={(e) => setCashierForm({...cashierForm, reason: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-slate-900 dark:text-white outline-none h-28 resize-none"
                      placeholder="Tuliskan alasan penambahan/pengurangan poin..."
                    />
                  </div>
                </div>

                <button type="submit" className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3">
                   Eksekusi Transaksi
                </button>
                <button type="button" onClick={() => setIsCashierModalOpen(false)} className="w-full text-slate-400 font-bold hover:text-slate-600 dark:hover:text-white transition-colors">Batal</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PointRules;