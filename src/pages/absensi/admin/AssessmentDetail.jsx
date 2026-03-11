import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getAssessmentById, getAssessments } from "@/store/api/absensiService";

// Helper Avatar
const getAvatarUrl = (path) => {
  if (!path) return "https://ui-avatars.com/api/?name=User&background=7f13ec&color=fff";
  if (path.startsWith("http")) return path;
  const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://127.0.0.1:8000";
  return `${baseUrl}/storage/${path}`;
};

export default function AssessmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tarik data detail assessment saat ini
        const currentData = await getAssessmentById(id);
        setAssessment(currentData);

        // Tarik semua assessment buat dapetin history si karyawan ini
        const allAssessments = await getAssessments();
        const userHistory = (Array.isArray(allAssessments) ? allAssessments : [])
          .filter((a) => a.evaluatee_id === currentData.evaluatee_id)
          .sort((a, b) => new Date(b.assessment_date) - new Date(a.assessment_date)); // Urut dari terbaru
        
        setHistory(userHistory);
      } catch (error) {
        console.error("Gagal menarik data detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Kalkulasi Statistik
  const stats = useMemo(() => {
    if (!assessment || !assessment.details || assessment.details.length === 0) return null;

    const details = assessment.details;
    const maxScorePerItem = 5; // Karena form kita skalanya 1-5
    
    let totalScore = 0;
    let highest = details[0];
    let lowest = details[0];

    details.forEach(d => {
      totalScore += d.score;
      if (d.score > highest.score) highest = d;
      if (d.score < lowest.score) lowest = d;
    });

    const aggregatePercentage = Math.round((totalScore / (details.length * maxScorePerItem)) * 100);

    return { totalScore, aggregatePercentage, highest, lowest };
  }, [assessment]);

  // Logic Generate Titik Koordinat buat Grafik Radar SVG
  const radarData = useMemo(() => {
    if (!assessment || !assessment.details) return { polygon: "", labels: [] };
    
    const details = assessment.details;
    const cx = 100, cy = 100, maxR = 60; // Max radius chart
    const labelR = 85; // Jarak teks label
    const angleStep = (Math.PI * 2) / details.length;

    const points = [];
    const labels = [];

    details.forEach((d, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      
      // Hitung koordinat Polygon (Skala 1-5)
      const r = (d.score / 5) * maxR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x},${y}`);

      // Hitung koordinat Label
      const lx = cx + labelR * Math.cos(angle);
      const ly = cy + labelR * Math.sin(angle);
      
      // Bikin teks label rapi (rata kiri/tengah/kanan)
      let textAnchor = "middle";
      if (Math.cos(angle) > 0.1) textAnchor = "start";
      if (Math.cos(angle) < -0.1) textAnchor = "end";

      labels.push({ id: d.id, name: d.category?.name || "Kategori", x: lx, y: ly, textAnchor });
    });

    return { polygon: points.join(" "), labels };
  }, [assessment]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Icon icon="ph:spinner-gap-bold" className="text-4xl text-violet-600 animate-spin" />
        <p className="text-violet-600 font-bold text-sm">Menyiapkan Laporan...</p>
      </div>
    );
  }

  if (!assessment) return <div className="p-8 text-center font-bold text-rose-500">Laporan tidak ditemukan.</div>;

  const { evaluatee } = assessment;

  return (
    <div className="max-w-5xl mx-auto pb-24 font-inter">
      {/* Profile Section */}
      <div className="p-6 bg-white dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="bg-violet-600/20 p-1 rounded-full border-2 border-violet-600 shrink-0">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 md:h-32 md:w-32" 
                 style={{ backgroundImage: `url(${getAvatarUrl(evaluatee?.avatar)})` }}>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white capitalize">{evaluatee?.name}</h2>
              <span className="bg-violet-600/10 text-violet-600 text-xs font-bold px-2 py-1 rounded-full w-fit mx-auto md:mx-0 uppercase">
                {evaluatee?.role}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 mt-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2">
                <Icon icon="ph:identification-card-bold" /> NIP: {evaluatee?.nip || '-'}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2">
                <Icon icon="ph:calendar-blank-bold" /> Dinilai: {assessment.assessment_date}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2">
                <Icon icon="ph:envelope-simple-bold" /> {evaluatee?.email}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2">
                <Icon icon="ph:buildings-bold" /> Periode: {assessment.period_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Radar & History */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Radar Chart Section */}
          <section className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold dark:text-white">Pemetaan Kompetensi</h3>
                <p className="text-sm text-slate-500">Visualisasi nilai performa periode ini</p>
              </div>
            </div>
            
            <div className="relative flex items-center justify-center aspect-square max-w-sm mx-auto py-4">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Garis Jaring (Background) */}
                <circle className="fill-none stroke-slate-200 dark:stroke-slate-700" cx="100" cy="100" r="60" strokeWidth="1"></circle>
                <circle className="fill-none stroke-slate-200 dark:stroke-slate-700" cx="100" cy="100" r="45" strokeWidth="1"></circle>
                <circle className="fill-none stroke-slate-200 dark:stroke-slate-700" cx="100" cy="100" r="30" strokeWidth="1"></circle>
                <circle className="fill-none stroke-slate-200 dark:stroke-slate-700" cx="100" cy="100" r="15" strokeWidth="1"></circle>
                
                {/* Sumbu Silang (Sesuai jumlah kategori) */}
                {radarData.labels.map((lbl, idx) => {
                  const angle = -Math.PI / 2 + idx * ((Math.PI * 2) / assessment.details.length);
                  return (
                    <line key={`axis-${idx}`} className="stroke-slate-200 dark:stroke-slate-700" x1="100" y1="100" x2={100 + 60 * Math.cos(angle)} y2={100 + 60 * Math.sin(angle)} />
                  );
                })}

                {/* Data Shape (Jaring Ungu) */}
                <polygon className="fill-violet-600/30 stroke-violet-600" points={radarData.polygon} strokeWidth="2"></polygon>
                
                {/* Titik Sudut */}
                {radarData.polygon.split(" ").map((pt, idx) => {
                  if(!pt) return null;
                  const [x, y] = pt.split(",");
                  return <circle key={`pt-${idx}`} className="fill-violet-600" cx={x} cy={y} r="3"></circle>;
                })}

                {/* Teks Label Kategori */}
                {radarData.labels.map((lbl, idx) => (
                  <text 
                    key={`lbl-${idx}`} 
                    x={lbl.x} y={lbl.y} 
                    textAnchor={lbl.textAnchor} 
                    alignmentBaseline="middle"
                    className="text-[8px] font-bold fill-slate-700 dark:fill-slate-300"
                  >
                    {lbl.name}
                  </text>
                ))}
              </svg>
            </div>
          </section>

          {/* History Section */}
          <section className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold dark:text-white">Riwayat Penilaian</h3>
              <p className="text-sm text-slate-500">History evaluasi {evaluatee?.name} sebelumnya</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Periode</th>
                    <th className="px-6 py-4 font-semibold">Penilai</th>
                    <th className="px-6 py-4 font-semibold">Catatan Feedback</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {history.map((hist) => (
                    <tr key={hist.id}>
                      <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{hist.period_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 capitalize">{hist.evaluator?.name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {hist.general_notes ? (
                           <span className="line-clamp-2">{hist.general_notes}</span>
                        ) : (
                           <em className="text-slate-400">Tidak ada catatan.</em>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {hist.id === assessment.id ? (
                          <span className="inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-900/30 px-2 py-1 text-[10px] font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider">Sedang Dibuka</span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-slate-500 text-sm">Belum ada riwayat penilaian.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>

        {/* Kolom Kanan: Stats Bar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Current Score */}
          <div className="bg-violet-600 p-6 rounded-xl text-white shadow-lg shadow-violet-600/20">
            <p className="text-white/80 text-sm font-medium">Skor Keseluruhan</p>
            <div className="flex items-end gap-2 my-2">
              <span className="text-5xl font-bold">{stats?.aggregatePercentage || 0}</span>
              <span className="text-xl opacity-60">/ 100</span>
            </div>
            <div className="flex items-center gap-1 text-xs bg-white/20 w-fit px-3 py-1.5 rounded-full mt-4 font-medium">
              <Icon icon="ph:info-bold" />
              <span>Berdasarkan {assessment.details.length} kriteria KPI</span>
            </div>
          </div>

          {/* Growth Areas */}
          <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold mb-4 dark:text-white">Analisis Kinerja</h3>
            <div className="space-y-5">
              
              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Icon icon="ph:trend-up-bold" className="text-xl" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Kekuatan Utama</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unggul di <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats?.highest?.category?.name}</span> dengan nilai {stats?.highest?.score}/5.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2.5 rounded-lg text-amber-600 dark:text-amber-400 shrink-0">
                  <Icon icon="ph:warning-circle-bold" className="text-xl" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Area Pengembangan</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Perlu fokus ke <span className="font-bold text-amber-600 dark:text-amber-400">{stats?.lowest?.category?.name}</span> (Nilai: {stats?.lowest?.score}/5).
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Feedback Notes Card */}
          <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl border border-amber-200 dark:border-amber-800/30 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-amber-700 dark:text-amber-500">
              <Icon icon="ph:quotes-fill" className="text-xl" />
              <p className="text-sm font-bold">Catatan Evaluator</p>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
              "{assessment.general_notes || 'Tidak ada catatan khusus yang diberikan pada periode ini.'}"
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}