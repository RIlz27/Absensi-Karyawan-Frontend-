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
  Sparkles, Shield, Clock, Plus, Trash2, Edit3, Target, 
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
    tipe_trigger: "waktu" // waktu, hadir, alfa
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
      
      // Ensure backend-friendly values for presets
      if (["hadir", "tepat_waktu", "telat", "sangat_awal", "custom"].includes(payload.tipe_trigger)) {
          // These are all time-based or existence-based, but 'hadir' is special
          if (payload.tipe_trigger === "hadir") {
            payload.condition_operator = "=";
            payload.condition_value = "HADIR";
          }
          // The others already have their operator and value set by the UI presets
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

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#0f172a]"><div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 min-h-screen bg-[#0f172a] text-slate-200">
      
      {/* HEADER SECTION */}
      <div className="relative mb-8 p-8 rounded-[40px] bg-gradient-to-br from-indigo-900 via-slate-900 to-black border border-white/5 shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-white flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400/20 w-10 h-10" />
              Gamification Center
            </h1>
            <p className="mt-2 text-slate-400 font-medium max-w-lg">
              Managerial integritas: Bangun aturan quest, kelola marketplace, dan pantau leaderboard karyawan.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsQuestModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold border border-indigo-400/30 flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
            >
              <Plus size={20} /> Quest Baru
            </button>
            <button 
              onClick={() => { setItemModalMode("create"); setIsItemModalOpen(true); }}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold border border-white/10 flex items-center justify-center transition-all"
              title="Tambah Voucher"
            >
              <ShoppingBag size={20} />
            </button>
            <button 
              onClick={() => setIsCashierModalOpen(true)}
              className="p-3 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 rounded-2xl font-bold border border-emerald-500/20 flex items-center justify-center transition-all"
              title="Kasir Poin (Manual)"
            >
              <Calculator size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION TABS */}
      <div className="flex gap-2 p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mb-8 max-w-md">
        {[
          { id: "quests", label: "Quest Master", icon: Target },
          { id: "shop", label: "Shop Manager", icon: Tag },
          { id: "leaderboard", label: "Analytics", icon: Trophy },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMainTab(tab.id)}
            className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeMainTab === tab.id ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- TAB: QUESTS --- */}
        {activeMainTab === "quests" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {rules.map((rule) => (
              <div key={rule.id} className="p-6 rounded-[32px] bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{rule.rule_name}</h3>
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase rounded-lg border border-indigo-500/20">
                      {rule.target_role}
                    </span>
                  </div>
                  <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[70px] ${rule.point_modifier > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    <div className="text-2xl font-black">{rule.point_modifier > 0 ? "+" : ""}{rule.point_modifier}</div>
                    <div className="text-[10px] uppercase font-bold opacity-50">Pts</div>
                  </div>
                </div>
                
                <div className="p-4 bg-black/40 rounded-2xl border border-white/5 mb-6">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Requirement</p>
                   <p className="text-sm font-semibold text-slate-200">
                      {rule.condition_value === "HADIR" ? "Check-in Berhasil" : 
                       rule.condition_value === "ALFA" ? "Tidak Ada Kehadiran" : 
                       `Telat ${rule.condition_operator} ${rule.condition_value} Menit`}
                   </p>
                </div>

                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => { setQuestModalMode("edit"); setEditingQuestId(rule.id); setQuestForm({...rule, tipe_trigger: rule.condition_value === "HADIR" ? "hadir" : rule.condition_value === "ALFA" ? "alfa" : "waktu"}); setIsQuestModalOpen(true); }}
                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDeleteQuest(rule.id)} className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* --- TAB: SHOP MANAGER --- */}
        {activeMainTab === "shop" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {items.map((item) => (
              <div key={item.id} className="p-6 rounded-[32px] bg-slate-900 border border-white/5 flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-3xl bg-indigo-600/20 flex items-center justify-center mb-4">
                  <Icon icon={item.type === "LATE_EXEMPTION" ? "ph:ticket-duotone" : "ph:gift-duotone"} className="text-4xl text-indigo-400" />
                </div>
                <h3 className="font-bold text-white mb-1">{item.item_name}</h3>
                <p className="text-xs text-slate-500 mb-4 px-2 italic">
                  {item.type === "LATE_EXEMPTION" ? `Bebas terlambat hingga ${item.value} menit.` : "Reward khusus integritas."}
                </p>
                <div className="w-full flex justify-between items-center p-3 bg-black/40 rounded-2xl mb-6">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Harga</p>
                    <p className="text-amber-400 font-bold">{item.point_cost} Pts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Stok</p>
                    <p className="text-white font-bold">{item.stock_limit || "∞"}</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full mt-auto">
                   <button 
                     onClick={() => { setItemModalMode("edit"); setEditingItemId(item.id); setItemForm(item); setIsItemModalOpen(true); }}
                     className="flex-1 py-2 bg-white/5 rounded-xl text-xs font-bold hover:bg-white/10 transition-colors"
                   >Edit</button>
                   <button onClick={() => handleDeleteItem(item.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500/20"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* --- TAB: LEADERBOARD --- */}
        {activeMainTab === "leaderboard" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* TOP PERFORMERS */}
            <div className="bg-white/5 p-8 rounded-[40px] border border-emerald-500/20 shadow-xl shadow-emerald-900/5">
              <h2 className="text-2xl font-black text-emerald-400 mb-8 flex items-center gap-3">
                <TrendingUp size={28} />
                Elite Integrity (Top 10)
              </h2>
              <div className="space-y-4">
                {leaderboard.top.map((user, idx) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-black text-slate-600 min-w-[24px]">#{idx + 1}</div>
                      <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                        {user.avatar ? <img src={user.avatar} className="h-full w-full object-cover" /> : <Users size={24} className="text-slate-500" />}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{user.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{user.role}</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl font-black text-lg border border-emerald-500/20">
                      {user.points} <span className="text-[10px] text-emerald-600 ml-1">PTS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTTOM PERFORMERS */}
            <div className="bg-white/5 p-8 rounded-[40px] border border-rose-500/20 shadow-xl shadow-rose-900/5">
              <h2 className="text-2xl font-black text-rose-400 mb-8 flex items-center gap-3">
                <TrendingDown size={28} />
                Low Integrity (Bottom 10)
              </h2>
              <div className="space-y-4">
                {leaderboard.bottom.map((user, idx) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-black text-slate-600 min-w-[24px]">#{idx + 1}</div>
                      <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                        {user.avatar ? <img src={user.avatar} className="h-full w-full object-cover" /> : <Users size={24} className="text-slate-500" />}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{user.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{user.role}</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-rose-500/10 text-rose-400 rounded-xl font-black text-lg border border-rose-500/20">
                      {user.points} <span className="text-[10px] text-rose-600 ml-1">PTS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* --- MODAL: RULE BUILDER (QUEST) --- */}
      <AnimatePresence>
        {isQuestModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e293b] w-full max-w-2xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden p-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <Sparkles className="text-indigo-400" /> Rule Statement Builder
                </h2>
                <button onClick={() => setIsQuestModalOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-400"><X /></button>
              </div>

              <form onSubmit={handleQuestSubmit} className="space-y-8">
                {/* Rule Name */}
                <div className="bg-black/20 p-6 rounded-3xl border border-white/5">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">JUDUL QUEST</label>
                   <input 
                      type="text" required value={questForm.rule_name} onChange={(e) => setQuestForm({...questForm, rule_name: e.target.value})}
                      placeholder="Contoh: Sang Juara Disiplin"
                      className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none border-b-2 border-white/10 focus:border-indigo-500 pb-2"
                   />
                </div>

                {/* STATEMENT BUILDER */}
                <div className="bg-indigo-600/5 p-8 rounded-[32px] border border-indigo-500/20 text-lg sm:text-xl font-bold text-slate-200 leading-relaxed">
                   JIKA User dengan Role 
                   <div className="inline-block mx-2">
                     <select 
                       value={questForm.target_role} onChange={(e) => setQuestForm({...questForm, target_role: e.target.value})}
                       className="bg-indigo-500/20 border border-indigo-500/30 rounded-xl px-3 py-1.5 focus:outline-none text-indigo-300"
                     >
                        <option value="Semua">Semua</option>
                        <option value="karyawan">Karyawan</option>
                        <option value="admin">Admin</option>
                     </select>
                   </div>
                   melakukan 
                   <div className="inline-block mx-2">
                     <select 
                       value={questForm.tipe_trigger} 
                       onChange={(e) => {
                         const val = e.target.value;
                         let newForm = { ...questForm, tipe_trigger: val };
                         
                         // PRESET LOGIC
                         if (val === "alfa") {
                           newForm.condition_operator = "=";
                           newForm.condition_value = "ALFA";
                         } else if (val === "hadir") {
                           newForm.condition_operator = "=";
                           newForm.condition_value = "HADIR";
                         } else if (val === "tepat_waktu") {
                           newForm.condition_operator = "<=";
                           newForm.condition_value = "0";
                         } else if (val === "telat") {
                           newForm.condition_operator = ">";
                           newForm.condition_value = "15";
                         } else if (val === "sangat_awal") {
                           newForm.condition_operator = "<=";
                           newForm.condition_value = "-15";
                         }
                         
                         setQuestForm(newForm);
                       }}
                       className="bg-indigo-500/20 border border-indigo-500/30 rounded-xl px-3 py-1.5 focus:outline-none text-indigo-300"
                     >
                        <option value="hadir">Absen Masuk (Umum)</option>
                        <option value="tepat_waktu">Absen Tepat Waktu</option>
                        <option value="telat">Keterlambatan (Telat)</option>
                        <option value="sangat_awal">Datang Sangat Awal</option>
                        <option value="alfa">Status Alfa (Mangkir)</option>
                        <option value="custom">Kondisi Kustom (Waktu)</option>
                     </select>
                   </div>

                   {["tepat_waktu", "telat", "sangat_awal", "custom"].includes(questForm.tipe_trigger) && (
                     <>
                        dengan selisih 
                        <div className="inline-block mx-2">
                          <select 
                             value={questForm.condition_operator} onChange={(e) => setQuestForm({...questForm, condition_operator: e.target.value})}
                             className="bg-indigo-500/20 border border-indigo-500/30 rounded-xl px-3 py-1.5 focus:outline-none text-indigo-300"
                          >
                             <option value="<">{"<"}</option>
                             <option value="<=">{"<="}</option>
                             <option value=">">{">"}</option>
                             <option value=">=">{">="}</option>
                             <option value="=">{"="}</option>
                             <option value="BETWEEN">Antara</option>
                          </select>
                        </div>
                        <div className="inline-block mx-2">
                           <input 
                              type="text" required value={questForm.condition_value} onChange={(e) => setQuestForm({...questForm, condition_value: e.target.value})}
                              className="w-24 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5 text-center focus:outline-none text-white font-mono"
                              placeholder={questForm.condition_operator === "BETWEEN" ? "1,15" : "0"}
                           />
                        </div>
                        menit
                     </>
                   )}

                   MAKA berikan 
                   <div className="inline-block mx-2">
                      <input 
                        type="number" required value={questForm.point_modifier} onChange={(e) => setQuestForm({...questForm, point_modifier: e.target.value})}
                        className="w-20 bg-emerald-500/20 border border-emerald-500/30 rounded-xl px-2 py-1.5 text-center focus:outline-none text-emerald-400 font-black"
                      />
                   </div>
                   Poin.
                </div>

                <div className="pt-4">
                   <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl text-xl shadow-2xl shadow-indigo-600/40 transition-all flex items-center justify-center gap-3">
                      <Save /> Simpan Aturan Quest
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: ITEM BUILDER (SHOP) --- */}
      <AnimatePresence>
        {isItemModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e293b] w-full max-w-md rounded-[40px] border border-white/10 shadow-2xl p-8"
            >
              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                 <ShoppingBag className="text-amber-400" /> Katalog Voucher
              </h2>
              <form onSubmit={handleItemSubmit} className="space-y-6">
                <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">NAMA ITEM</label>
                   <input type="text" required value={itemForm.item_name} onChange={(e) => setItemForm({...itemForm, item_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Misal: Voucher Bebas Telat 30m"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">JENIS TOKEN</label>
                      <select value={itemForm.type} onChange={(e) => setItemForm({...itemForm, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none">
                         <option value="LATE_EXEMPTION">Bebas Terlambat</option>
                         <option value="OTHER">Lainnya / Fisik</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">VALUE (MENIT)</label>
                      <input type="number" required value={itemForm.value} onChange={(e) => setItemForm({...itemForm, value: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none"/>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">HARGA POIN</label>
                      <input type="number" required value={itemForm.point_cost} onChange={(e) => setItemForm({...itemForm, point_cost: e.target.value})} className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3 text-amber-400 font-bold outline-none"/>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">STOK LIMIT</label>
                      <input type="number" value={itemForm.stock_limit} onChange={(e) => setItemForm({...itemForm, stock_limit: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none" placeholder="Kosongkan jika unlimited"/>
                   </div>
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-3xl shadow-xl transition-all">
                  Publish Voucher
                </button>
                <button type="button" onClick={() => setIsItemModalOpen(false)} className="w-full text-slate-500 font-bold py-2 hover:text-white transition-colors">Batal</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODAL: KASIR POIN (MANUAL) --- */}
      <AnimatePresence>
        {isCashierModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e293b] w-full max-w-md rounded-[40px] border border-white/10 shadow-2xl p-8"
            >
              <h2 className="text-2xl font-black text-emerald-400 mb-8 flex items-center gap-3">
                 <Calculator /> Kasir Poin (Manual)
              </h2>
              <form onSubmit={handleCashierSubmit} className="space-y-6">
                <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">PILIH KARYAWAN</label>
                   <select 
                     required value={cashierForm.user_id} onChange={(e) => setCashierForm({...cashierForm, user_id: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none"
                   >
                      <option value="">-- Pilih User --</option>
                      {usersList.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                   </select>
                </div>
                <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">JUMLAH POIN (+ / -)</label>
                   <input 
                     type="number" required value={cashierForm.amount} onChange={(e) => setCashierForm({...cashierForm, amount: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none font-black text-xl"
                     placeholder="Contoh: 500 atau -100"
                   />
                </div>
                <div>
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">ALASAN PENYESUAIAN</label>
                   <textarea 
                     required value={cashierForm.reason} onChange={(e) => setCashierForm({...cashierForm, reason: e.target.value})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none h-24 resize-none"
                     placeholder="Contoh: Rewarding for excellence"
                   />
                </div>
                <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl shadow-xl transition-all">
                  Eksekusi Mutasi Poin
                </button>
                <button type="button" onClick={() => setIsCashierModalOpen(false)} className="w-full text-slate-500 font-bold py-2 hover:text-white transition-colors">Batal</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// No custom Iconify needed as we use the real @iconify/react component
export default PointRules;