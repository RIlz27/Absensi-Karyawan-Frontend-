import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import API from "@/store/api/absensiService.js";
import { useGetPengumumanUserQuery } from "@/store/api/pengumuman/pengumumanApiSlice";
import { useGetLeaderboardQuery } from "@/store/api/point/pointApiSlice";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { data: pengumumans } = useGetPengumumanUserQuery();
  const { data: leaderboardRes, isLoading: isLoadingLeaderboard } = useGetLeaderboardQuery(3);
  const topLeaderboard = leaderboardRes?.data || [];

  // ... (keep state and useEffect the same)
  const [pengajuanLimit, setPengajuanLimit] = useState([]);
  const [stats, setStats] = useState({
    hadir: 0,
    tidakHadir: 0,
    sisaHari: 0,
    totalHari: 30,
  });
  const [weeklyStatus, setWeeklyStatus] = useState([]);
  const [shiftToday, setShiftToday] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cutiRes, izinRes, historyRes] = await Promise.all([
          API.get("/cuti"),
          API.get("/izin"),
          API.get("/history"),
        ]);

        // Format cuti
        const cutiFormatted = cutiRes.data.map((item) => {
          const displayDate = new Date(
            (item.status === "Approved" || item.status === "Rejected") &&
              item.approved_at
              ? item.approved_at
              : item.created_at,
          );
          return {
            title: `Cuti`,
            status: item.status,
            date: displayDate.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            time: displayDate
              .toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
              .replace(":", "."),
            timestamp: displayDate.getTime(),
            outerColor: "bg-rose-100 dark:bg-rose-500/20",
            innerColor: "bg-rose-500",
          };
        });

        // Format izin
        const izinFormatted = izinRes.data.map((item) => {
          const displayDate = new Date(
            (item.status === "Approved" || item.status === "Rejected") &&
              item.approved_at
              ? item.approved_at
              : item.created_at,
          );
          return {
            title: "Izin",
            status: item.status,
            date: displayDate.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            time: displayDate
              .toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })
              .replace(":", "."),
            timestamp: displayDate.getTime(),
            outerColor: "bg-indigo-100 dark:bg-indigo-500/20",
            innerColor: "bg-indigo-500",
          };
        });

        const combined = [...cutiFormatted, ...izinFormatted]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 3);

        setPengajuanLimit(combined);

        // Compute Monthly Stats
        const hadirCount = historyRes.data.length; // assumes Absensi history only returns current month and 1 per day max

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const date = now.getDate();
        const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

        const sisaHari = totalDaysInMonth - date;
        const tidakHadir = date - hadirCount;

        setStats({
          hadir: hadirCount,
          tidakHadir: tidakHadir < 0 ? 0 : tidakHadir,
          sisaHari: sisaHari < 0 ? 0 : sisaHari,
          totalHari: totalDaysInMonth,
        });

        // Compute Weekly Status & Shift Today
        const meRes = await API.get("/me");
        const userShifts = meRes.data.shifts || [];

        // Find Today's Shift
        const currentEnglishDay = now.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const todayShift = userShifts.find(
          (s) => s.pivot.hari === currentEnglishDay,
        );
        setShiftToday(todayShift || null);

        // Extract working days in English
        const workingDaysEn = userShifts.map((s) => s.pivot.hari);

        // Map English days to Indonesian for display
        const dayMap = {
          Monday: "Sen",
          Tuesday: "Sel",
          Wednesday: "Rab",
          Thursday: "Kam",
          Friday: "Jum",
          Saturday: "Sab",
          Sunday: "Min",
        };

        const today = new Date();
        const currentDayIndex = today.getDay(); // 0 is Sunday, 1 is Monday
        // Get start of the current week (Monday)
        const startOfWeekDate = new Date(today);
        startOfWeekDate.setDate(
          today.getDate() - (currentDayIndex === 0 ? 6 : currentDayIndex - 1),
        );

        const weekStatusArr = [];

        // Loop through 7 days of the week sequentially
        const englishDaysOrdered = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];

        englishDaysOrdered.forEach((enDay, index) => {
          // Skip if not a working day
          if (!workingDaysEn.includes(enDay)) return;

          // Calculate the exact date for this day of the current week
          const loopDate = new Date(startOfWeekDate);
          loopDate.setDate(startOfWeekDate.getDate() + index);

          const yyyy = loopDate.getFullYear();
          const mm = String(loopDate.getMonth() + 1).padStart(2, "0");
          const dd = String(loopDate.getDate()).padStart(2, "0");
          const formattedLoopDate = `${yyyy}-${mm}-${dd}`;

          // Check history for this date
          const hasAttended = historyRes.data.some(
            (h) => h.tanggal === formattedLoopDate,
          );

          // If loopDate is in the future, it's pending (grey circle)
          loopDate.setHours(23, 59, 59, 999);

          let statusType = "pending";
          if (hasAttended) {
            statusType = "hadir";
          } else if (loopDate < new Date()) {
            statusType = "absen"; // strictly in the past and no attendance record
          }

          weekStatusArr.push({
            dayName: dayMap[enDay],
            status: statusType,
          });
        });

        setWeeklyStatus(weekStatusArr);
      } catch (err) {
        console.error("Failed to fetch pengajuan history:", err);
      }
    };
    fetchData();
  }, []);

  const now = new Date();
  const tanggal = now.getDate();
  const hari = now.toLocaleDateString("id-ID", { weekday: "long" });
  const bulanTahun = now.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const featuredPengumuman =
    pengumumans && pengumumans.length > 0 ? pengumumans[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] pb-24 relative overflow-x-hidden">
      <div className="bg-gradient-to-b from-indigo-600 to-purple-600 h-48 -mx-5 rounded-b-[100px] overflow-hidden absolute inset-x-0 top-0"></div>
      <div className="px-5 relative z-10 pt-10">
        {featuredPengumuman && (
          <div className="mb-6 relative overflow-hidden rounded-[24px] shadow-2xl shadow-indigo-900/20 w-full animate-fade-in-up">
            <div
              className={`absolute inset-0 opacity-90 backdrop-blur-md ${
                featuredPengumuman.category === "Urgent"
                  ? "bg-gradient-to-br from-red-500 to-rose-600"
                  : featuredPengumuman.category === "Event"
                    ? "bg-gradient-to-br from-indigo-500 to-violet-600"
                    : "bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-[#0f172a]"
              }`}
            ></div>

            <div className="relative p-6 text-white z-10">
              <div className="flex justify-between items-start mb-3">
                <span
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 bg-white/20 backdrop-blur-sm border border-white/10`}
                >
                  <Icon
                    icon={
                      featuredPengumuman.category === "Urgent"
                        ? "ph:warning-circle-bold"
                        : featuredPengumuman.category === "Event"
                          ? "ph:calendar-star-bold"
                          : "ph:info-bold"
                    }
                  />
                  {featuredPengumuman.category}
                </span>
                <span className="text-[10px] text-white/70 font-medium">
                  {new Date(featuredPengumuman.created_at).toLocaleDateString(
                    "id-ID",
                    { day: "numeric", month: "short" },
                  )}
                </span>
              </div>
              <h3 className="text-lg font-bold leading-tight mb-2 drop-shadow-md">
                {featuredPengumuman.title}
              </h3>
              <p className="text-xs text-white/80 line-clamp-2 leading-relaxed font-medium">
                {featuredPengumuman.content}
              </p>
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        )}

        {/* Dashboard Main Card (Tanggal) */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl shadow-indigo-900/10 border border-white/10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              {/* Tanggal Otomatis */}
              <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                {tanggal}
              </span>
              <div className="leading-tight">
                <p className="font-bold text-lg text-slate-800 dark:text-white">
                  {hari}
                </p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  {bulanTahun}
                </p>
              </div>
            </div>
            <button className="text-indigo-600 dark:text-indigo-300 text-[11px] font-bold bg-indigo-50 dark:bg-indigo-900/40 px-3 py-2 rounded-xl">
              Lihat Riwayat
            </button>
          </div>

          <div className="mt-8">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-4">
              Status minggu ini
            </p>
            <div className="flex justify-between overflow-x-auto gap-4 scrollbar-hide py-1">
              {weeklyStatus.length > 0 ? (
                weeklyStatus.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 min-w-[32px]"
                  >
                    <p className="text-[10px] font-bold text-slate-400">
                      {item.dayName}
                    </p>
                    <Icon
                      icon={
                        item.status === "absen"
                          ? "ph:x-circle-fill"
                          : item.status === "pending"
                            ? "ph:circle"
                            : "ph:check-circle-fill"
                      }
                      className={
                        item.status === "absen"
                          ? "text-red-500"
                          : item.status === "pending"
                            ? "text-slate-200 dark:text-slate-700"
                            : "text-indigo-500 delay-100 animate-fade-in"
                      }
                      width="24"
                    />
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Memuat jadwal mingguan...
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4 px-1">
            <h4 className="font-bold text-slate-800 dark:text-white text-base tracking-wide flex items-center gap-2">
              <Icon
                icon="ph:chart-polar-fill"
                className="text-indigo-500"
                width="20"
              />
              Statistik{" "}
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                {bulanTahun.split(" ")[0]}
              </span>
            </h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Hadir", val: stats.hadir, color: "text-indigo-600" },
              {
                label: "Tidak Hadir",
                val: stats.tidakHadir,
                color: "text-purple-600",
              },
              {
                label: "Sisa Hari",
                val: stats.sisaHari,
                color: "text-slate-400",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 p-4 rounded-3xl  shadow-xl shadow-indigo-900/10 text-center border border-slate-100 dark:border-slate-700"
              >
                <div className="relative inline-flex items-center justify-center mb-2">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      className="text-slate-100 dark:text-slate-700"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray="125.6"
                      strokeDashoffset={
                        125.6 -
                        (Math.min(stat.val, stats.totalHari) /
                          stats.totalHari) *
                          125.6
                      }
                      className={stat.color}
                    />
                  </svg>
                  <span className="absolute text-xs font-bold dark:text-white">
                    {stat.val}
                  </span>
                </div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Shift Hari Ini Section */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl shadow-indigo-900/10 border border-slate-100 dark:border-slate-800 mt-8">
          <div className="flex justify-between items-center mb-6 px-1 ">
            <h4 className="font-bold text-slate-800 dark:text-white text-lg tracking-wide">
              Shift Hari ini
            </h4>
            <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
              Lihat Semua Shift
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-[#0f172a] p-5 rounded-[24px] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              </div>
              <div>
                <h4 className="font-bold text-[15px] text-slate-800 dark:text-white mb-0.5">
                  {shiftToday ? shiftToday.nama : "Tidak ada jadwal"}
                </h4>
                <p className="text-[12px] font-medium text-slate-500">
                  {shiftToday
                    ? `${shiftToday.jam_masuk?.substring(0, 5) || "--:--"} - ${shiftToday.jam_keluar?.substring(0, 5) || "--:--"}`
                    : "Libur / Off"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[11px] text-slate-800 dark:text-white mb-1">
                Hari ini
              </p>
              <p className="text-[10px] text-slate-500 font-bold">
                {now
                  .toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(":", ".")}
              </p>
            </div>
          </div>
        </div>

        {/* Pengajuan Section */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl shadow-indigo-900/10 border border-slate-100 dark:border-slate-800 mt-8">
          <div className="flex justify-between items-center mb-6 px-1 ">
            <h4 className="font-bold text-slate-800 dark:text-white text-lg tracking-wide">
              Pengajuan
            </h4>
            <button
              onClick={() => navigate("/user/pengajuan")}
              className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {pengajuanLimit.length > 0 ? (
              pengajuanLimit.map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-[24px] flex items-center justify-between active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-11 w-11 rounded-full ${item.outerColor} flex items-center justify-center`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full ${item.innerColor}`}
                      ></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500">
                        {item.status === "Approved"
                          ? "Disetujui"
                          : item.status === "Rejected"
                            ? "Ditolak"
                            : "Tertunda"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[11px] text-slate-800 dark:text-white mb-1">
                      {item.date}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {item.time || "--:--"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 text-xs py-4">
                Belum ada pengajuan.
              </div>
            )}
          </div>
        </div>

        {/* Peringkat & Leaderboard Section */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl shadow-indigo-900/10 border border-slate-100 dark:border-slate-800 mt-8 mb-4">
          <div className="flex justify-between items-center mb-6 px-1 ">
            <h4 className="font-bold text-slate-800 dark:text-white text-lg tracking-wide flex items-center gap-2">
               <Icon icon="ph:medal-military-duotone" className="text-yellow-500 text-xl" />
               Top Leaderboard
            </h4>
            <button
              onClick={() => navigate("/user/point")}
              className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
            >
              Lihat Detail Poin Saya
            </button>
          </div>

          <div className="space-y-3">
            {isLoadingLeaderboard ? (
              <div className="text-center text-slate-500 text-xs py-4">Memuat data...</div>
            ) : topLeaderboard.length > 0 ? (
              topLeaderboard.map((user, index) => {
                const rankColors = ["text-yellow-500", "text-slate-400", "text-amber-600"];
                const isTopThree = index < 3;
                
                return (
                  <div
                    key={user.id}
                    className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-[24px] flex items-center gap-4 transition-all relative overflow-hidden"
                  >
                    {isTopThree && index === 0 && (
                       <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-full blur-[20px]"></div>
                    )}
                    <div className="flex-none w-8 text-center">
                       {isTopThree ? (
                          <Icon icon="ph:medal-fill" className={`mx-auto text-3xl ${rankColors[index]}`} />
                        ) : (
                          <span className="text-slate-500 font-bold text-lg">#{index + 1}</span>
                        )}
                    </div>
                    <div className="h-10 w-10 rounded-full bg-[#E0EAFF] dark:bg-slate-700 flex flex-col items-center justify-center font-medium capitalize text-slate-900 dark:text-white flex-none overflow-hidden border border-white/10">
                      {user.avatar ? (
                          <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-0.5 capitalize">
                        {user.name}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-500">
                        {user.kantor?.name || "-"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700/30 shadow-sm">
                         {user.points} pts
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-slate-500 text-xs py-4">
                Belum ada data poin.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
