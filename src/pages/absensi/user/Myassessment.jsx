import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { getAssessments } from "@/store/api/absensi-service";

// Helper Avatar
const getAvatarUrl = (path) => {
  if (!path)
    return "https://ui-avatars.com/api/?name=User&background=7f13ec&color=fff";
  if (path.startsWith("http")) return path;
  const baseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:8000";
  return `${baseUrl}/storage/${path}`;
};

export default function MyAssessment() {
  const { user } = useSelector((state) => state.auth);
  const [assessment, setAssessment] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const allData = await getAssessments("Bulanan");
        // Filter cuma buat user ini
        const myData = (Array.isArray(allData) ? allData : [])
          .filter((a) => a.evaluatee_id === user.id)
          .sort(
            (a, b) => new Date(b.assessment_date) - new Date(a.assessment_date),
          );

        setHistory(myData);
        setAssessment(myData[0]); // Ambil penilaian terbaru sebagai primary view
      } catch (error) {
        console.error("Gagal ambil data penilaian:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyData();
  }, [user.id]);

  // Kalkulasi Statistik (Versi Anti-NaN)
  const stats = useMemo(() => {
    // Pastiin assessment dan details-nya ada isinya dulu
    if (!assessment || !assessment.details || assessment.details.length === 0) {
      return { aggregatePercentage: 0, highest: null, lowest: null };
    }

    const details = assessment.details;
    let totalScore = 0;
    let highest = details[0];
    let lowest = details[0];

    details.forEach((d) => {
      totalScore += d.score;
      if (d.score > (highest?.score || 0)) highest = d;
      if (d.score < (lowest?.score || 5)) lowest = d;
    });

    const totalPossible = details.length * 5;
    const aggregatePercentage =
      totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

    return { aggregatePercentage, highest, lowest };
  }, [assessment]);

  // Logic Radar (Sama kayak Detail Admin)
  const radarData = useMemo(() => {
    if (!assessment || !assessment.details) return { polygon: "", labels: [] };
    const details = assessment.details;
    const cx = 100,
      cy = 100,
      maxR = 60,
      labelR = 85;
    const angleStep = (Math.PI * 2) / details.length;

    const points = details.map((d, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const r = (d.score / 5) * maxR;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    });

    const labels = details.map((d, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      let textAnchor = "middle";
      if (Math.cos(angle) > 0.1) textAnchor = "start";
      if (Math.cos(angle) < -0.1) textAnchor = "end";
      return {
        name: d.category?.name,
        x: cx + labelR * Math.cos(angle),
        y: cy + labelR * Math.sin(angle),
        textAnchor,
      };
    });

    return { polygon: points.join(" "), labels };
  }, [assessment]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Icon
          icon="ph:spinner-gap-bold"
          className="text-4xl text-violet-600 animate-spin"
        />
        <p className="text-violet-600 font-bold text-sm">
          Menghitung Rapormu...
        </p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed m-6">
        <Icon
          icon="ph:info-bold"
          className="text-5xl mx-auto text-slate-300 mb-4"
        />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Belum Ada Penilaian
        </p>
        <p className="text-sm text-slate-400 mt-2">
          Manager-mu belum memberikan penilaian untuk periode ini.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-24 font-inter">
      {/* Profile Header (Karyawan View) */}
      <div className="p-6 bg-white dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="bg-violet-600/20 p-1 rounded-full border-2 border-violet-600 shrink-0 shadow-lg shadow-violet-600/20">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24"
              style={{ backgroundImage: `url(${getAvatarUrl(user?.avatar)})` }}
            ></div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
              {user?.name}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
              <span className="bg-violet-600/10 text-violet-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                My Performance Review
              </span>
              <span className="text-slate-500 text-xs flex items-center gap-1">
                <Icon icon="ph:calendar-blank-bold" /> {assessment.period_name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Radar & History */}
        <div className="lg:col-span-8 space-y-6">
          {/* Radar Chart Section */}
          <section className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold dark:text-white mb-1">
              Pemetaan Kompetensi
            </h3>
            <p className="text-xs text-slate-500 mb-8 font-medium italic">
              Visualisasi kekuatanmu berdasarkan feedback Manager
            </p>

            <div className="relative flex items-center justify-center aspect-square max-w-[320px] mx-auto">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {[60, 45, 30, 15].map((r) => (
                  <circle
                    key={r}
                    className="fill-none stroke-slate-200 dark:stroke-slate-700"
                    cx="100"
                    cy="100"
                    r={r}
                    strokeWidth="1"
                  />
                ))}
                {radarData.labels.map((lbl, idx) => {
                  const angle =
                    -Math.PI / 2 +
                    idx * ((Math.PI * 2) / assessment.details.length);
                  return (
                    <line
                      key={idx}
                      className="stroke-slate-200 dark:stroke-slate-700"
                      x1="100"
                      y1="100"
                      x2={100 + 60 * Math.cos(angle)}
                      y2={100 + 60 * Math.sin(angle)}
                    />
                  );
                })}
                <polygon
                  className="fill-violet-600/30 stroke-violet-600"
                  points={radarData.polygon}
                  strokeWidth="2.5"
                />
                {radarData.polygon.split(" ").map((pt, idx) => {
                  const [x, y] = pt.split(",");
                  return (
                    <circle
                      key={idx}
                      className="fill-violet-600 shadow-xl"
                      cx={x}
                      cy={y}
                      r="3.5"
                    />
                  );
                })}
                {radarData.labels.map((lbl, idx) => (
                  <text
                    key={idx}
                    x={lbl.x}
                    y={lbl.y}
                    textAnchor={lbl.textAnchor}
                    className="text-[9px] font-bold fill-slate-700 dark:fill-slate-300 uppercase tracking-tighter"
                  >
                    {lbl.name}
                  </text>
                ))}
              </svg>
            </div>
          </section>

          {/* History Section (Karyawan View) */}
          <section className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold dark:text-white">Riwayat Raporku</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold">
                  <tr>
                    <th className="px-6 py-4">Bulan</th>
                    <th className="px-6 py-4">Penilai</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {history.map((h) => (
                    <tr
                      key={h.id}
                      className={
                        h.id === assessment.id
                          ? "bg-violet-50/50 dark:bg-violet-900/10"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                        {h.period_name}
                      </td>
                      <td className="px-6 py-4 text-slate-500 capitalize">
                        {h.evaluator?.name}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${h.id === assessment.id ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500"}`}
                        >
                          {h.id === assessment.id ? "Terbaru" : "Arsip"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Kolom Kanan: Stats & Feedback */}
        <div className="lg:col-span-4 space-y-6">
          {/* Score Card */}
          <div className="bg-violet-600 p-6 rounded-2xl text-white shadow-xl shadow-violet-600/30">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">
              Aggregate Score
            </p>
            <div className="flex items-end gap-2 my-2">
              <span className="text-6xl font-black">
                {stats?.aggregatePercentage}
              </span>
              <span className="text-xl opacity-60 font-bold mb-1">/ 100</span>
            </div>
            <p className="text-[10px] bg-white/20 px-3 py-1 rounded-full w-fit font-bold mt-4">
              Berdasarkan {assessment.details.length} Indikator
            </p>
          </div>

          {/* Analysis */}
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold mb-5 dark:text-white text-sm">
              Analisis Performa
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-500/10 p-2.5 rounded-xl text-emerald-600 shrink-0">
                  <Icon icon="ph:crown-bold" className="text-xl" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Kekuatan Terbesarmu
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Kamu sangat hebat di{" "}
                    <span className="font-bold text-emerald-600 uppercase">
                      {stats?.highest?.category?.name}
                    </span>
                    . Pertahankan konsistensimu!
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-amber-100 dark:bg-amber-500/10 p-2.5 rounded-xl text-amber-600 shrink-0">
                  <Icon icon="ph:rocket-launch-bold" className="text-xl" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Peluang Pertumbuhan
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Fokuslah untuk meningkatkan{" "}
                    <span className="font-bold text-amber-600 uppercase">
                      {stats?.lowest?.category?.name}
                    </span>{" "}
                    di periode berikutnya.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-200 dark:border-amber-800/30 relative">
            <Icon
              icon="ph:quotes-fill"
              className="absolute top-4 right-4 text-4xl text-amber-200 dark:text-amber-800/40"
            />
            <p className="text-xs font-bold text-amber-700 dark:text-amber-500 mb-3 flex items-center gap-2">
              <Icon icon="ph:user-focus-bold" /> PESAN MANAGER
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "
              {assessment.general_notes ||
                "Terus berikan yang terbaik bagi tim, progresmu sudah terlihat nyata!"}
              "
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
