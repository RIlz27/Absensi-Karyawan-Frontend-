import React from "react";
import { useSelector } from "react-redux";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useGetLeaderboardQuery } from "@/store/api/point/pointApiSlice";

const Point = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: leaderboardData, isLoading } = useGetLeaderboardQuery(10);

  // Helper to get initials if no avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
  };

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:8000";
    return `${baseUrl}/storage/${path}`;
  };

  return (
    <div className="space-y-5 pb-24 h-full relative min-h-screen bg-slate-50 dark:bg-[#0f172a] overflow-x-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-500 to-indigo-700 rounded-b-[40px] z-0"></div>
      
      <div className="relative z-10 px-5 pt-8">
        <div className="text-center text-white mb-8">
          <h2 className="text-2xl font-black mb-1">Poin Karyawan</h2>
          <p className="text-indigo-100 text-sm font-medium">Bekerja rajin, kumpulkan poin reward</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl mb-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <Icon icon="ph:star-fill" className="text-9xl" />
           </div>
           
           <div className="flex flex-col items-center justify-center relative z-10">
              <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 shadow-inner ring-4 ring-indigo-50 dark:ring-slate-700">
                 <Icon icon="ph:star-fill" className="text-5xl text-yellow-400 drop-shadow-md" />
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Poin Anda</h3>
              <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 drop-shadow-sm">
                {user?.points || user?.point || 0}
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl space-y-5">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
            <Icon icon="ph:trophy-fill" className="text-yellow-500 text-xl" />
            Top 10 Karyawan
          </h3>
          
           {isLoading ? (
             <div className="flex justify-center p-6">
               <Icon icon="ph:spinner-gap-bold" className="animate-spin text-3xl text-indigo-500" />
             </div>
           ) : (
             <div className="space-y-3">
               {leaderboardData?.data?.map((item, idx) => (
                 <div key={item.id || idx} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${item.id === user?.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50'}`}>
                   <div className="flex items-center gap-3">
                     <div className={`font-black w-8 text-center text-lg ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-600' : 'text-slate-400 dark:text-slate-500'}`}>
                       #{idx + 1}
                     </div>
                     <div className="h-11 w-11 rounded-full bg-indigo-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm">
                       {item.avatar ? (
                         <img src={getAvatarUrl(item.avatar)} className="w-full h-full object-cover" alt={item.name} />
                       ) : (
                         <span className="font-bold text-indigo-500 dark:text-slate-300 text-sm uppercase">{getInitials(item.name)}</span>
                       )}
                     </div>
                     <div>
                       <div className="font-bold text-sm text-slate-800 dark:text-white capitalize">{item.name}</div>
                       <div className="text-[10px] text-slate-500 uppercase tracking-wider">{item.role || 'Karyawan'}</div>
                     </div>
                   </div>
                   <div className="font-black text-indigo-600 dark:text-indigo-400 text-lg flex items-center gap-1">
                     {item.points || item.point || 0}
                     <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">pt</span>
                   </div>
                 </div>
               ))}
               {!leaderboardData?.data?.length && (
                  <div className="text-center text-slate-500 text-sm py-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">Belum ada data poin karyawan.</div>
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Point;
