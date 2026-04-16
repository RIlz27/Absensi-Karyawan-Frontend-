import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  getSubordinates,
  getAssessmentCategories,
  submitAssessment,
} from "@/store/api/absensi-service";

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

// Array warna biar icon kategorinya warna-warni kayak di desain lu
const bgColors = [
  "bg-violet-600",
  "bg-amber-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-rose-500",
];

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

        // Data per karyawan per id
        const employee = (Array.isArray(subsData) ? subsData : []).find(
          (sub) => sub.id === parseInt(id),
        );
        setEvaluatee(employee);

        // Filter aktif kategori
        const activeCategories = (
          Array.isArray(catsData) ? catsData : []
        ).filter((c) => c.is_active && c.questions && c.questions.length > 0);

        setCategories(activeCategories);
      } catch (error) {
        console.error("Gagal menarik data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleScoreChange = (questionId, score) => {
    setScores((prev) => ({ ...prev, [questionId]: score }));
  };

  const handleSubmit = async () => {
    const totalQuestions = categories.reduce(
      (acc, cat) => acc + (cat.questions ? cat.questions.length : 0),
      0
    );

    // Validasi: Pastiin semua kategori udah diisi nilainya
    if (Object.keys(scores).length < totalQuestions) {
      alert(`Baru ${Object.keys(scores).length} dari ${totalQuestions} pertanyaan yang dinilai. Harap isi semua!`);
      return;
    }

    setIsSubmitting(true);
    const today = new Date();
    const periodName = `${today.toLocaleString("id-ID", { month: "long" })} ${today.getFullYear()}`;

    const payload = {
      evaluatee_id: parseInt(id),
      assessment_date: today.toISOString().split("T")[0],
      period_type: "Bulanan",
      period_name: periodName,
      general_notes: notes || "-",
      is_visible: true,
      details: Object.entries(scores).map(([qId, val]) => ({
        question_id: parseInt(qId),
        score: parseInt(val),
      })),
    };

    try {
      console.log("Payload dikirim:", payload); // Buat debug
      await submitAssessment(payload);
      alert("Penilaian berhasil disimpan!");
      navigate("/admin/assessments");
    } catch (error) {
      // TIPS: Biar tau error 422-nya karena apa
      if (error.response && error.response.status === 422) {
        console.error("Detail Error Validation:", error.response.data.errors);
        alert("Gagal: Data tidak valid. Cek console log!");
      } else {
        alert("Terjadi kesalahan saat menyimpan penilaian.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Icon
          icon="ph:spinner-gap-bold"
          className="text-4xl text-violet-600 animate-spin"
        />
        <p className="text-violet-600 font-bold text-sm">
          Menyiapkan Form Penilaian...
        </p>
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
        <button
          onClick={() => navigate(-1)}
          className="text-violet-600 flex size-10 items-center justify-center rounded-full hover:bg-violet-600/10 transition-colors"
        >
          <Icon icon="ph:arrow-left-bold" className="text-xl" />
        </button>
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">
          Penilaian Kinerja
        </h2>
        <div className="w-10"></div> {/* Spacer biar judul di tengah */}
      </div>

      {/* Employee Profile Header */}
      <div className="flex flex-col items-center px-6 py-4 bg-white dark:bg-slate-900 mx-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-6">
        <div
          className="bg-center bg-no-repeat bg-cover rounded-full ring-4 ring-violet-600/10 size-24 mb-3"
          style={{ backgroundImage: `url(${getAvatarUrl(evaluatee.avatar)})` }}
        ></div>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-slate-900 dark:text-slate-100 text-xl font-bold capitalize">
            {evaluatee.name}
          </p>
          <p className="text-violet-600 font-bold text-xs uppercase tracking-wider mt-1">
            {evaluatee.role} • NIP: {evaluatee.nip || "-"}
          </p>
        </div>
      </div>

      {/* Rating Categories */}
      <div className="px-4">
        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">
          Indikator Penilaian (1 - 5)
        </h3>

        <div className="space-y-3">
          {categories.length > 0 ? (
            categories.map((cat, index) => {
              const colorClass = bgColors[index % bgColors.length]; // Rotasi warna icon
              const currentScore = scores[cat.id];

              return (
                <div key={cat.id} className="space-y-3">
                  {/* 1. Header Kategori (Gaya asli lu) */}
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div
                      className={`text-white flex items-center justify-center rounded-lg ${colorClass} shrink-0 size-10`}
                    >
                      <Icon icon="ph:star-fill" className="text-xl" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-slate-900 dark:text-slate-100 text-sm font-bold leading-tight">
                        {cat.name}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider mt-0.5">
                        {cat.description || "Penilaian Standar"}
                      </p>
                    </div>
                  </div>

                  {/* 2. Daftar Pertanyaan (Iterasi di bawah Header) */}
                  <div className="pl-4 space-y-3 border-l-2 border-slate-200 dark:border-slate-800 ml-5">
                    {cat.questions.map((q) => (
                      <div
                        key={q.id}
                        className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-3"
                      >
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-relaxed">
                          {q.question_text}
                        </p>

                        {/* Tombol Skor 1-5 per Pertanyaan */}
                        <div className="flex gap-2 w-full justify-between">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              onClick={() => handleScoreChange(q.id, num)}
                              className={`flex-1 py-2 rounded-lg border-2 font-bold transition-all ${scores[q.id] === num
                                ? "border-violet-600 bg-violet-600 text-white scale-105 shadow-md shadow-violet-600/20"
                                : "border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-violet-600/50"
                                }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 bg-white dark:bg-slate-900 rounded-xl">
              <p className="text-slate-500 text-sm">
                Belum ada kategori aktif dari Admin.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Area */}
      <div className="p-4 mt-2">
        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-1">
          Catatan & Evaluasi (Opsional)
        </h3>
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
