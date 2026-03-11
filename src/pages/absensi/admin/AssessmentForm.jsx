import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getSubordinates, getAssessmentCategories, submitAssessment } from "@/store/api/absensiService";

// Helper Avatar
const getAvatarUrl = (path) => {
  if (!path) return "https://ui-avatars.com/api/?name=User&background=7f13ec&color=fff";
  if (path.startsWith("http")) return path;
  const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://127.0.0.1:8000";
  return `${baseUrl}/storage/${path}`;
};

// Array warna biar icon kategorinya warna-warni kayak di desain lu
const bgColors = ["bg-violet-600", "bg-amber-500", "bg-blue-500", "bg-emerald-500", "bg-rose-500"];

export default function AssessmentForm() {
  const { id } = useParams(); // ID karyawan yang mau dinilai
  const navigate = useNavigate();

  const [evaluatee, setEvaluatee] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [scores, setScores] = useState({}); // nyimpen { category_id: score }
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subsData, catsData] = await Promise.all([
          getSubordinates(),
          getAssessmentCategories(),
        ]);

        // Cari data karyawan berdasarkan ID dari URL
        const employee = (Array.isArray(subsData) ? subsData : []).find(sub => sub.id === parseInt(id));
        setEvaluatee(employee);

        // Filter cuma kategori yang aktif aja yang ditampilin
        const activeCategories = (Array.isArray(catsData) ? catsData : []).filter(c => c.is_active);
        setCategories(activeCategories);

      } catch (error) {
        console.error("Gagal menarik data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleScoreChange = (categoryId, score) => {
    setScores((prev) => ({ ...prev, [categoryId]: score }));
  };

  const handleSubmit = async () => {
    // Validasi: Pastiin semua kategori udah diisi nilainya
    if (Object.keys(scores).length < categories.length) {
      alert("Harap isi semua nilai indikator sebelum menyimpan!");
      return;
    }

    setIsSubmitting(true);
    const today = new Date();
    const periodName = `${today.toLocaleString("id-ID", { month: "long" })} ${today.getFullYear()}`; // Cth: Maret 2026

    const payload = {
      evaluatee_id: id,
      assessment_date: today.toISOString().split("T")[0],
      period_type: "Bulanan",
      period_name: periodName,
      general_notes: notes,
      is_visible: true,
      details: Object.entries(scores).map(([category_id, score]) => ({
        category_id: parseInt(category_id),
        score: parseInt(score),
      })),
    };

    try {
      await submitAssessment(payload);
      alert("Penilaian berhasil disimpan!");
      navigate("/admin/assessments"); // Balik ke dashboard KPI
    } catch (error) {
      console.error("Gagal submit:", error);
      alert("Terjadi kesalahan saat menyimpan penilaian.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Icon icon="ph:spinner-gap-bold" className="text-4xl text-violet-600 animate-spin" />
        <p className="text-violet-600 font-bold text-sm">Menyiapkan Form Penilaian...</p>
      </div>
    );
  }

  if (!evaluatee) {
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-500 font-bold">
        Karyawan tidak ditemukan atau tidak berada di bawah tanggung jawab lu.
      </div>
    );
  }

  return (
    <div className="w-full pb-24 space-y-2 pt-2 bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* Top App Bar */}
      <div className="flex items-center px-4 mb-4 justify-between">
        <button onClick={() => navigate(-1)} className="text-violet-600 flex size-10 items-center justify-center rounded-full hover:bg-violet-600/10 transition-colors">
          <Icon icon="ph:arrow-left-bold" className="text-xl" />
        </button>
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">Penilaian Kinerja</h2>
        <div className="w-10"></div> {/* Spacer biar judul di tengah */}
      </div>

      {/* Employee Profile Header */}
      <div className="flex flex-col items-center px-6 py-4 bg-white dark:bg-slate-900 mx-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
        <div className="bg-center bg-no-repeat bg-cover rounded-full ring-4 ring-violet-600/10 size-24 mb-3" 
             style={{ backgroundImage: `url(${getAvatarUrl(evaluatee.avatar)})` }}>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-slate-900 dark:text-slate-100 text-xl font-bold capitalize">{evaluatee.name}</p>
          <p className="text-violet-600 font-bold text-xs uppercase tracking-wider mt-1">{evaluatee.role} • NIP: {evaluatee.nip || '-'}</p>
        </div>
      </div>

      {/* Rating Categories */}
      <div className="px-4">
        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">Indikator Penilaian (1 - 5)</h3>
        
        <div className="space-y-3">
          {categories.length > 0 ? categories.map((cat, index) => {
            const colorClass = bgColors[index % bgColors.length]; // Rotasi warna icon
            const currentScore = scores[cat.id];

            return (
              <div key={cat.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className={`text-white flex items-center justify-center rounded-lg ${colorClass} shrink-0 size-10`}>
                    <Icon icon="ph:star-fill" className="text-xl" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-bold leading-tight">{cat.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider mt-0.5">{cat.description || "Penilaian Standar"}</p>
                  </div>
                </div>
                
                {/* Tombol Bintang 1-5 */}
                <div className="flex gap-2 w-full justify-between pt-2">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const isSelected = currentScore === num;
                    return (
                      <button
                        key={num}
                        onClick={() => handleScoreChange(cat.id, num)}
                        className={`flex-1 py-2.5 rounded-lg border-2 font-bold transition-all ${
                          isSelected 
                            ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105" 
                            : "border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-violet-600/50 hover:text-violet-600"
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-6 bg-white dark:bg-slate-900 rounded-xl">
              <p className="text-slate-500 text-sm">Belum ada kategori aktif dari Admin.</p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Area */}
      <div className="p-4 mt-2">
        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">Catatan & Evaluasi (Opsional)</h3>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full min-h-[120px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-600/50 focus:border-violet-600 p-4 text-sm resize-none" 
          placeholder="Berikan feedback atau saran pengembangan untuk karyawan ini..."
        ></textarea>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-10">
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting || categories.length === 0}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          {isSubmitting ? (
            <Icon icon="ph:spinner-gap-bold" className="animate-spin text-xl" />
          ) : (
            <>
              <Icon icon="ph:check-circle-bold" className="text-xl" />
              Simpan Penilaian
            </>
          )}
        </button>
      </div>

    </div>
  );
}