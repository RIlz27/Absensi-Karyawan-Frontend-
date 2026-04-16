import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import API from "@/store/api/absensi-service.js";
import { useGetPengumumanUserQuery } from "@/store/api/pengumuman/pengumumanApiSlice";
import PointBadge from "@/components/pointbadge";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { data: pengumumans } = useGetPengumumanUserQuery();

  // ... (keep state and useEffect the same)
  const [pengajuanLimit, setPengajuanLimit] = useState([]);
  const [stats, setStats] = useState({
    hadir: 0,
    tidakHadir: 0,
    sisaHari: 0,
    totalHari: 30,
  });
  const [weeklyStatus, setWeeklyStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shiftToday, setShiftToday] = useState(null);
  const [debugDay, setDebugDay] = useState("");
  const [session, setSession] = useState({ isCheckedIn: false, isCompleted: false, shift: null, todayRecord: null });
  const [timeLeft, setTimeLeft] = useState("");
  const [canCheckout, setCanCheckout] = useState(false);


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
        setDebugDay(currentEnglishDay);
        console.log("Current Day (EN):", currentEnglishDay);
        console.log("User Shifts from /me:", userShifts);

        const todayShifts = userShifts.filter(
          (s) => s.pivot?.hari?.trim().toLowerCase() === currentEnglishDay.toLowerCase(),
        );
        console.log("Matched Shifts:", todayShifts);

        // Prioritaskan shift tambahan jika ada
        const todayShift = todayShifts.find((s) => s.pivot?.tipe?.toLowerCase() === 'tambahan') ||
          todayShifts.find((s) => s.pivot?.tipe?.toLowerCase() === 'biasa') ||
          todayShifts[0] || null;

        setShiftToday(todayShift);

        // Setup state session for today
        const todayYYYY = now.getFullYear();
        const todayMM = String(now.getMonth() + 1).padStart(2, '0');
        const todayDD = String(now.getDate()).padStart(2, '0');
        const todayStr = `${todayYYYY}-${todayMM}-${todayDD}`;

        const todayRecord = historyRes.data.find(h => h.tanggal === todayStr);

        if (todayRecord) {
          if (todayRecord.jam_pulang) {
            setSession({ isCheckedIn: true, isCompleted: true, shift: todayRecord.shift, todayRecord });
          } else {
            setSession({ isCheckedIn: true, isCompleted: false, shift: todayRecord.shift, todayRecord });
          }
        } else {
          setSession({ isCheckedIn: false, isCompleted: false, shift: null, todayRecord: null });
        }

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
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Countdown Effect
  useEffect(() => {
    let timer;
    if (session.isCheckedIn && !session.isCompleted && (shiftToday || session.shift)) {
      const shiftToUse = session.shift || shiftToday;
      if (!shiftToUse?.jam_pulang) return;

      timer = setInterval(() => {
        const now = new Date();
        const [hours, minutes, seconds] = shiftToUse.jam_pulang.split(':');

        const returnTime = new Date();
        returnTime.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || 0), 0);

        const diff = returnTime - now;

        if (diff <= 0) {
          setTimeLeft("00.00.00");
          setCanCheckout(true);
          clearInterval(timer);
        } else {
          const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
          const m = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
          const s = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
          setTimeLeft(`${h}.${m}.${s}`);
          setCanCheckout(false);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [session, shiftToday]);

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] pb-2 relative overflow-x-hidden">
      <div className="px-5 relative z-10">
        {featuredPengumuman && (
          <div className="mb-6 relative w-full animate-fade-in-up group pb-1 mt-2">
            {/* Base Glowing Ambient Layer */}
            <div className={`absolute inset-0 top-2 bottom-0 rounded-[30px] blur-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-70 ${featuredPengumuman.category === "Urgent" ? "bg-red-500" :
                featuredPengumuman.category === "Event" ? "bg-indigo-500" :
                  "bg-blue-500"
              }`}></div>

            <div className="relative overflow-hidden rounded-[28px] bg-white/60 dark:bg-[#0f172a]/70 backdrop-blur-2xl border border-white/60 dark:border-white/10 p-6 z-10 transition-all duration-300 group-hover:-translate-y-1">

              {/* Modern Glass Bubble Blur Effects */}
              <div className={`absolute -top-24 -right-10 w-56 h-56 rounded-full blur-[60px] opacity-60 dark:opacity-40 pointer-events-none ${featuredPengumuman.category === "Urgent" ? "bg-rose-400" :
                  featuredPengumuman.category === "Event" ? "bg-violet-400" :
                    "bg-cyan-400"
                }`}></div>
              <div className={`absolute top-20 -left-20 w-48 h-48 rounded-full blur-[50px] opacity-60 dark:opacity-30 pointer-events-none ${featuredPengumuman.category === "Urgent" ? "bg-orange-300" :
                  featuredPengumuman.category === "Event" ? "bg-fuchsia-400" :
                    "bg-blue-400"
                }`}></div>

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 border backdrop-blur-md shadow-sm ${featuredPengumuman.category === "Urgent"
                        ? "bg-red-50/80 dark:bg-red-500/20 border-red-200/60 dark:border-red-500/30 text-red-700 dark:text-red-300"
                        : featuredPengumuman.category === "Event"
                          ? "bg-indigo-50/80 dark:bg-indigo-500/20 border-indigo-200/60 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300"
                          : "bg-blue-50/80 dark:bg-blue-500/20 border-blue-200/60 dark:border-blue-500/30 text-blue-700 dark:text-blue-300"
                      }`}
                  >
                    <Icon
                      icon={
                        featuredPengumuman.category === "Urgent"
                          ? "ph:warning-circle-duotone"
                          : featuredPengumuman.category === "Event"
                            ? "ph:calendar-star-duotone"
                            : "ph:info-duotone"
                      }
                      className="text-base"
                    />
                    {featuredPengumuman.category}
                  </span>
                  <span className={`text-[10px] font-black tracking-widest uppercase ${featuredPengumuman.category === "Urgent" ? "text-red-500/80 dark:text-red-400" :
                      featuredPengumuman.category === "Event" ? "text-indigo-500/80 dark:text-indigo-400" :
                        "text-blue-500/80 dark:text-blue-400"
                    }`}>
                    {new Date(featuredPengumuman.created_at).toLocaleDateString(
                      "id-ID",
                      { day: "2-digit", month: "short", year: "numeric" },
                    )}
                  </span>
                </div>

                <h3 className="text-[18px] font-black leading-tight mb-2 tracking-tight text-slate-800 dark:text-white drop-shadow-sm">
                  {featuredPengumuman.title}
                </h3>

                <p className="text-xs font-semibold text-slate-600/90 dark:text-slate-300/90 line-clamp-2 leading-relaxed">
                  {featuredPengumuman.content}
                </p>
              </div>
            </div>
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
            <div onClick={() => navigate('/user/gamification')} className="inline-block transition-transform active:scale-95">
              <PointBadge />
            </div>
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
        <div className="bg-white dark:bg-[#1E293B] rounded-[32px] p-6 shadow-xl shadow-indigo-900/10 border border-slate-100 dark:border-[#334155] mt-8">
          <div className="flex justify-between items-center mb-6 px-1 ">
            <h4 className="font-bold text-slate-800 dark:text-white text-lg tracking-wide">
              Shift Hari ini
            </h4>
            <button className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
              Lihat Semua Shift
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-[24px]"></div>
              <div className="flex gap-4">
                <div className="h-14 flex-1 bg-slate-100 dark:bg-slate-800 rounded-[20px]"></div>
                <div className="h-14 flex-1 bg-slate-100 dark:bg-slate-800 rounded-[20px]"></div>
              </div>
              <div className="h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-[16px]"></div>
            </div>
          ) : (() => {
            const activeShift = session.shift || shiftToday;
            if (!activeShift && !session.todayRecord) {
              return (
                <div className="w-full bg-slate-50 dark:bg-[#0f172a]/50 py-10 rounded-[28px] text-center flex flex-col items-center justify-center gap-3 border border-slate-200 dark:border-white/5">
                  <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-1">
                    <Icon icon="ph:calendar-x-duotone" className="text-3xl text-slate-300 dark:text-slate-600" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-black text-slate-500 dark:text-slate-400 block text-sm tracking-tight">Tidak Ada Jadwal Shift</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">{debugDay || "HARI LIBUR"}</span>
                  </div>
                </div>
              );
            }

            const shiftColor = activeShift?.warna || "#3b82f6";
            const shiftName = activeShift?.nama || "Shift Tidak Diketahui";
            const jamMasuk = activeShift?.jam_masuk?.substring(0, 5) || "--.--";
            const jamPulang = activeShift?.jam_pulang?.substring(0, 5) || "--.--";
            const timeNowStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(":", ".");

            return (
              <div className="space-y-4">
                <div className="bg-[#1e293b]/5 dark:bg-[#0f1523] p-5 rounded-[24px] flex items-center justify-between border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center bg-white/5" style={{ backgroundColor: `${shiftColor}20` }}>
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: shiftColor, boxShadow: `0 0 8px ${shiftColor}` }}></div>
                    </div>
                    <h4 className="font-bold text-[15px] text-slate-800 dark:text-white">
                      {shiftName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">Hari ini</p>
                    <p className="font-bold text-xs text-slate-800 dark:text-white">{timeNowStr}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-[#1e293b]/5 dark:bg-[#0f1523] p-4 rounded-[20px] flex items-center gap-3 border border-slate-200 dark:border-white/5">
                    <div className="h-5 w-5 rounded-full flex items-center justify-center bg-blue-500/20">
                      <div className="h-2 w-2 rounded-full shadow-[0_0_6px_rgba(59,130,246,0.8)] bg-blue-600"></div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">Jam Masuk</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{jamMasuk.replace(':', '.')}</p>
                    </div>
                  </div>
                  <div className="flex-1 bg-[#1e293b]/5 dark:bg-[#0f1523] p-4 rounded-[20px] flex items-center gap-3 border border-slate-200 dark:border-white/5">
                    <div className="h-5 w-5 rounded-full flex items-center justify-center bg-red-500/20">
                      <div className="h-2 w-2 rounded-full shadow-[0_0_6px_rgba(220,38,38,0.8)] bg-red-600"></div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">Jam Pulang</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{jamPulang.replace(':', '.')}</p>
                    </div>
                  </div>
                </div>

                {/* Action Banner */}
                {!session.isCheckedIn && (
                  <button onClick={() => navigate('/user/scanner')} className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all py-4 rounded-[16px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30">
                    <Icon icon="ph:qr-code-bold" className="text-xl text-white" />
                    <span className="font-bold text-white text-[15px]">Scan</span>
                  </button>
                )}
                {session.isCheckedIn && !session.isCompleted && (
                  canCheckout ? (
                    <button onClick={() => navigate('/user/scanner')} className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all py-4 rounded-[16px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30">
                      <Icon icon="ph:qr-code-bold" className="text-xl text-white" />
                      <span className="font-bold text-white text-[15px]">Scan</span>
                    </button>
                  ) : (
                    <div className="w-full bg-indigo-600 py-4 rounded-[16px] text-center shadow-lg shadow-indigo-600/30 border border-indigo-500">
                      <span className="font-bold text-white text-[15px]">Sisa {timeLeft || "--.--.--"}</span>
                    </div>
                  )
                )}
                {session.isCompleted && (
                  <div className="w-full bg-indigo-600 py-4 rounded-[16px] text-center shadow-lg shadow-indigo-600/30 border border-indigo-500">
                    <span className="font-bold text-white text-[15px]">Hari ini sudah selesai</span>
                  </div>
                )}
              </div>
            );
          })()}
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

        {/* Peringkat & Leaderboard Section is removed */}
      </div>
    </div>
  );
};

export default UserDashboard;
