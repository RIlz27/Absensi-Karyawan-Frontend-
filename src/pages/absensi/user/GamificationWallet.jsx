import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { 
  getPointStatus, 
  getStoreItems, 
  buyItem, 
  getMyTokens 
} from "@/store/api/absensi-service.js";

const GamificationWallet = () => {
  const [activeTab, setActiveTab] = useState("riwayat");
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [storeItems, setStoreItems] = useState([]);
  const [myTokens, setMyTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Point Status
      const pointRes = await getPointStatus();
      if (pointRes?.status === "success") {
        setBalance(pointRes.data.current_balance || 0);
        setHistory(pointRes.data.history || []);
      }

      // Fetch Store Content
      const storeRes = await getStoreItems();
      if (storeRes?.status === "success") {
        setStoreItems(storeRes.data || []);
      }

      // Fetch Inventory
      const tokenRes = await getMyTokens();
      if (tokenRes?.status === "success") {
        setMyTokens(tokenRes.data || []);
      }

    } catch (error) {
      console.error("Gagal menarik data gamifikasi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBuyItem = async (itemId) => {
    setIsProcessing(true);
    try {
      const res = await buyItem(itemId);
      toast.success(res.message || "Berhasil menukar poin dengan token!");
      fetchData(); // Refresh data immediately
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menukar poin.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Logika level berdasarkan saldo poin
  let levelName = "Disiplin Pemula";
  let levelColor = "text-slate-400";
  if (balance >= 500) { levelName = "Disiplin Elite"; levelColor = "text-amber-400"; }
  else if (balance >= 200) { levelName = "Disiplin Pro"; levelColor = "text-indigo-400"; }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] pb-20 relative overflow-x-hidden pt-4">
      <div className="px-5 relative z-10 space-y-6">
        
        {/* HERO SECTION / E-WALLET STYLE */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-800 dark:from-indigo-900 dark:to-slate-900 rounded-[32px] p-6 shadow-2xl shadow-indigo-600/20 relative overflow-hidden text-white">
          {/* Decorative glowing blobs */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-violet-400/30 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-indigo-400/30 blur-2xl"></div>

          <div className="flex justify-between items-start relative z-10 mb-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-indigo-100/80 tracking-widest uppercase mb-1">
                Saldo Poin Integritas
              </span>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black tracking-tight">{balance.toLocaleString()}</span>
                <span className="text-lg font-bold mb-1 opacity-80">PTS</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex items-center justify-center">
              <Icon icon="ph:coin-vertical-duotone" className="text-3xl text-amber-300 drop-shadow-md" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 relative z-10">
            <span className="text-xs font-semibold text-indigo-100 flex items-center gap-1.5">
              <Icon icon="ph:medal-military-duotone" className={`text-lg ${levelColor}`} />
              Level: <strong className={levelColor}>{levelName}</strong>
            </span>
            <button onClick={fetchData} className="text-xs flex items-center gap-1 hover:text-white/80 transition text-indigo-100/70 p-1">
              <Icon icon="ph:arrows-clockwise-bold" className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex">
          {[
            { id: "riwayat", label: "Mutasi", icon: "ph:clock-counter-clockwise-duotone" },
            { id: "marketplace", label: "Tukar", icon: "ph:storefront-duotone" },
            { id: "inventory", label: "Inventory", icon: "ph:backpack-duotone" },
          ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                  activeTab === tab.id 
                    ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
             >
                <Icon icon={tab.icon} className="text-lg" />
                <span>{tab.label}</span>
             </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="mt-4">
          
          {/* TAB 1: RIWAYAT MUTASI */}
          {activeTab === "riwayat" && (
            <div className="bg-white dark:bg-slate-800 rounded-[28px] p-5 shadow-xl shadow-indigo-900/5 border border-slate-100 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Icon icon="ph:list-dashes-bold" className="text-indigo-500" />
                Riwayat Poin
              </h4>
              
              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-center text-xs text-slate-400 py-4">Memuat data...</p>
                ) : history.length > 0 ? (
                  history.map((item, idx) => {
                    const isPositive = item.amount > 0;
                    return (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                             isPositive ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" : "bg-rose-50 dark:bg-rose-500/10 text-rose-500"
                          }`}>
                            <Icon icon={isPositive ? "ph:trend-up-bold" : "ph:trend-down-bold"} className="text-lg" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white mb-0.5 capitalize">{item.transaction_type.toLowerCase()}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-black ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                            {isPositive ? "+" : ""}{item.amount}
                          </span>
                          <p className="text-[9px] text-slate-400">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-center text-xs text-slate-400 py-6">Belum ada riwayat mutasi.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MARKETPLACE */}
          {activeTab === "marketplace" && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <p className="col-span-2 text-center text-xs text-slate-400 py-4">Memuat toko...</p>
              ) : storeItems.length > 0 ? (
                storeItems.map((item) => {
                  const canAfford = balance >= item.point_cost;
                  return (
                    <div key={item.id} className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-xl shadow-indigo-900/5 border border-slate-100 dark:border-slate-700 flex flex-col transition-transform hover:-translate-y-1">
                      <div className="h-24 w-full bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl mb-4 flex items-center justify-center">
                         <Icon icon="ph:gift-duotone" className="text-5xl text-indigo-400 drop-shadow-sm" />
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1 leading-tight line-clamp-2">
                        {item.item_name}
                      </h4>
                      <p className="text-xs text-slate-500 flex-grow mb-4 flex items-center gap-1">
                        Harga: 
                        <span className="font-bold text-amber-500 flex items-center">
                          {item.point_cost} <Icon icon="ph:coin-fill" className="ml-0.5" />
                        </span>
                      </p>
                      
                      <button 
                        onClick={() => handleBuyItem(item.id)}
                        disabled={!canAfford || isProcessing}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                          canAfford 
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30 active:scale-95" 
                            : "bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                         <Icon icon="ph:shopping-cart-bold" className="text-base" /> Tukar
                      </button>
                    </div>
                  )
                })
              ) : (
                <p className="col-span-2 text-center text-xs text-slate-400 py-6">Marketplace sedang kosong.</p>
              )}
            </div>
          )}

          {/* TAB 3: INVENTORY */}
          {activeTab === "inventory" && (
            <div className="bg-white dark:bg-slate-800 rounded-[28px] p-5 shadow-xl shadow-indigo-900/5 border border-slate-100 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Icon icon="ph:backpack-fill" className="text-indigo-500" />
                Item Kamu
              </h4>
              <div className="space-y-3">
                {isLoading ? (
                  <p className="text-center text-xs text-slate-400 py-4">Memuat inventory...</p>
                ) : myTokens.length > 0 ? (
                  myTokens.map((token, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                      <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                         <Icon icon="ph:ticket-duotone" className="text-2xl" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-slate-800 dark:text-white">
                          {token.item ? token.item.item_name : "Token Tidak Diketahui"}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Icon icon="ph:info" />
                          Siap digunakan otomatis
                        </p>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {token.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Icon icon="ph:empty-bold" className="text-4xl text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Inventory kosong. Dapatkan item di Marketplace!</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GamificationWallet;
