import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getSubordinates, getAssessments } from "@/store/api/absensiService";
import UserAvatar from "@/assets/images/avatar/avatar.jpg";

// Helper Avatar (Sama kayak di profile lu)
const getAvatarUrl = (path) => {
  if (!path) return UserAvatar;
  if (path.startsWith("http")) return path;
  const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://127.0.0.1:8000";
  return `${baseUrl}/storage/${path}`;
};

export default function ManagerAssessmentDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Set current period dinamis (Bulan dan Tahun saat ini)
  const currentMonth = new Date().toLocaleString("id-ID", { month: "long" });
  const currentYear = new Date().getFullYear();
  const currentPeriod = `${currentMonth} ${currentYear}`; // Cth: "Maret 2026"

  // 1. Fetch Data dari API
  const { data: subordinates = [], isLoading: isLoadingSubs } = useQuery({
    queryKey: ["fetch-subordinates"],
    queryFn: getSubordinates,
  });

  const { data: assessments = [], isLoading: isLoadingAssessments } = useQuery({
    queryKey: ["fetch-assessments"],
    queryFn: () => getAssessments("Bulanan"), // Sesuai period_type
  });

  // 2. Logic Pemisah Status (Pending vs Completed)
  const { pending, completed, progressPercentage, teamAverage } = useMemo(() => {
    const completedList = [];
    const pendingList = [];
    let totalTeamScore = 0;

    subordinates.forEach((sub) => {
      const hasAssessed = assessments.find(
        (a) => a.evaluatee_id === sub.id && a.period_name === currentPeriod
      );

      if (hasAssessed) {
        completedList.push({ subordinate: sub, assessment: hasAssessed });

        //Rata rata Score
        const avgScore = hasAssessed.details?.reduce((acc, d) => acc + d.score, 0) / (hasAssessed.details?.length || 1);
        totalTeamScore += avgScore;
      } else {
        pendingList.push(sub);
      }
    });

    const avg = completedList.length === 0 ? 0 : (totalTeamScore / completedList.length).toFixed(1);
    const total = subordinates.length;
    const progress = total === 0 ? 0 : Math.round((completedList.length / total) * 100);

    return { pending: pendingList, completed: completedList, progressPercentage: progress, totalAverage: avg };
  }, [subordinates, assessments, currentPeriod]);

  const isLoading = isLoadingSubs || isLoadingAssessments;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-violet-600 font-bold">Memuat Data...</div>;
  }

  return (
    <div className="bg-[#f7f6f8] dark:bg-[#191022] font-inter text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      <main className="flex-1 max-w-md mx-auto w-full p-4 space-y-6">
        {/* --- REKAPAN HASIL TIM --- */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Icon icon="ph:trend-up-bold" className="text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Avg Score</span>
            </div>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white">{teamAverage}</h4>
            <p className="text-[9px] text-slate-400 font-medium">Bulan ini</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Icon icon="ph:users-three-bold" className="text-blue-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Evaluated</span>
            </div>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white">{completed.length}</h4>
            <p className="text-[9px] text-slate-400 font-medium">Karyawan</p>
          </div>
        </section>

        {/* --- STATISTIK SINGKAT --- */}
        <section className="bg-violet-600 rounded-xl p-4 text-white shadow-lg shadow-violet-600/20">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-black uppercase tracking-widest">Team Performance</h3>
            <Icon icon="ph:info-bold" className="opacity-50" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="opacity-80">Highest Performer</span>
              <span className="font-bold">
                {completed.length > 0 ? "Budi Setiawan" : "-"} {/* Nanti bisa diambil dari logic max score */}
              </span>
            </div>
            <div className="h-px bg-white/10 w-full"></div>
            <div className="flex justify-between items-center text-xs">
              <span className="opacity-80">Critical Attention</span>
              <span className="font-bold text-rose-300">{pending.length} People</span>
            </div>
          </div>
        </section>
        {/* Gamified Progress Card */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-violet-600/5">
          <div className="absolute -right-8 -top-8 size-32 bg-violet-600/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Monthly Goal ({currentPeriod})</p>
                <h2 className="text-xl font-bold dark:text-white">{completed.length} of {subordinates.length} evaluations completed</h2>
              </div>
              <div className="bg-violet-600 text-white text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                LEVEL {progressPercentage >= 100 ? "MAX" : Math.floor(progressPercentage / 25) + 1}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-violet-600 font-bold">Progress</span>
                <span className="font-bold dark:text-white">{progressPercentage}%</span>
              </div>
              <div className="h-3 w-full bg-violet-600/10 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-600 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Bagian Bawah Progress Bar (Tulisan & Tombol) */}
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-2">
                <Icon icon="ph:magic-wand-bold" className="text-violet-600 text-lg" />
                <p className="text-violet-600 text-sm font-semibold italic">
                  {progressPercentage === 100 ? "Awesome! All done." : "Keep going! Almost there!"}
                </p>
              </div>

              {/* TOMBOL SHORTCUT KE KATEGORI */}
              <button
                onClick={() => navigate('/admin/assessment-categories')}
                className="bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-violet-700 transition-colors shadow-md shadow-violet-600/20 active:scale-95 uppercase tracking-wider"
              >
                <Icon icon="ph:list-dashes-bold" className="text-sm" />
                Kategori
              </button>
            </div>
          </div>
        </section>

        {/* Student Assessment Grid */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg font-bold">Daftar Penilaian Karyawan</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">

            {/* PENDING CARDS (Belum dinilai) */}
            {pending.map((sub) => (
              <div key={sub.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 border-l-4 border-violet-600 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="size-14 rounded-xl bg-cover bg-center border border-violet-600/10"
                    style={{ backgroundImage: `url(${getAvatarUrl(sub.avatar)})` }}
                  ></div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white capitalize">{sub.name}</h4>
                    <p className="text-xs text-slate-500 font-medium uppercase">{sub.role} • NIP: {sub.nip}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-violet-600 uppercase bg-violet-600/10 px-2 py-0.5 rounded">
                      Belum Dinilai
                    </span>
                  </div>
                </div>
                {/* Tombol Ngarah ke Form Nilai */}
                <button
                  onClick={() => navigate(`/admin/assessments/form/${sub.id}`)}
                  className="flex flex-col items-center gap-1 text-violet-600 hover:scale-105 transition-transform"
                >
                  <div className="size-10 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-600/30">
                    <Icon icon="ph:star-bold" className="text-xl" />
                  </div>
                  <span className="text-[10px] font-bold">NILAI</span>
                </button>
              </div>
            ))}

            {/* COMPLETED CARDS (Udah dinilai) */}
            {completed.map((item) => (
              <div key={item.subordinate.id} className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-between opacity-80">
                <div className="flex items-center gap-3">
                  <div
                    className="size-14 rounded-xl bg-cover bg-center grayscale"
                    style={{ backgroundImage: `url(${getAvatarUrl(item.subordinate.avatar)})` }}
                  ></div>
                  <div>
                    <h4 className="font-bold text-slate-600 dark:text-slate-400 capitalize">{item.subordinate.name}</h4>
                    <p className="text-xs text-slate-400 font-medium">Dinilai: {item.assessment.assessment_date}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Icon icon="ph:check-circle-fill" className="text-emerald-500 text-sm" />
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Selesai</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/admin/assessments/detail/${item.assessment.id}`)}
                  className="flex flex-col items-center gap-1 text-slate-400 hover:text-violet-500 transition-colors"
                >
                  <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <Icon icon="ph:eye-bold" className="text-xl" />
                  </div>
                  <span className="text-[10px] font-bold">VIEW</span>
                </button>
              </div>
            ))}

            {subordinates.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">
                Belum ada karyawan di tim lu.
              </div>
            )}
          </div>
        </section>

        <div className="h-20"></div> {/* Spacer for fixed nav */}
      </main>

      {/* Bottom Navigation (Opsional, sesuaikan routing lu) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-[#191022] border-t border-violet-600/10 px-6 pb-6 pt-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center">
          <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-violet-600 transition-colors">
            <Icon icon="ph:house-bold" className="text-2xl" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-violet-600">
            <div className="relative">
              <Icon icon="ph:chart-bar-fill" className="text-2xl" />
              <div className="absolute -top-1 -right-1 size-2 bg-violet-600 rounded-full border-2 border-white dark:border-[#191022]"></div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">KPI</span>
          </button>
          <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-violet-600 transition-colors">
            <Icon icon="ph:gear-bold" className="text-2xl" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
}