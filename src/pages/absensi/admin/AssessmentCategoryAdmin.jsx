import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  getAssessmentCategories,
  createAssessmentCategory,
  updateAssessmentCategory,
  deleteAssessmentCategory,
  getQuestionsByCategory,
  createQuestion,
  deleteQuestion,
} from "@/store/api/absensiService";

export default function AssessmentCategoryAdmin() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [isMsgLoading, setIsMsgLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  // State untuk Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Data Form
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    is_active: true,
  });

  // Fetch Data Awal
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getAssessmentCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal menarik data kategori:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageQuestions = async (category) => {
    setSelectedCategory(category);
    setShowQuestionModal(true);
    fetchQuestions(category.id);
  };

  const fetchQuestions = async (catId) => {
    setIsMsgLoading(true);
    try {
      const data = await getQuestionsByCategory(catId);
      setQuestions(data);
    } finally {
      setIsMsgLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestionText) return;
    try {
      await createQuestion({
        category_id: selectedCategory.id,
        question_text: newQuestionText,
      });
      setNewQuestionText("");
      fetchQuestions(selectedCategory.id);
    } catch (e) {
      alert("Gagal tambah pertanyaan");
    }
  };

  const confirmDelete = (q) => {
    setQuestionToDelete(q);
    setShowDeleteConfirm(true);
  };

  const executeDelete = async () => {
    if (!questionToDelete) return;
    try {
      await deleteQuestion(questionToDelete.id);
      fetchQuestions(selectedCategory.id); // Refresh list
      setShowDeleteConfirm(false);
      setQuestionToDelete(null);
    } catch (error) {
      alert("Gagal menghapus data");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Buka Modal Tambah Baru
  const handleAddNew = () => {
    setFormData({ id: null, name: "", description: "", is_active: true });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Buka Modal Edit
  const handleEdit = (category) => {
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || "",
      is_active: category.is_active,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Hapus Data
  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        `Yakin mau menghapus kategori "${name}"? Data yang sudah dihapus tidak bisa dikembalikan.`,
      )
    ) {
      try {
        await deleteAssessmentCategory(id);
        fetchCategories(); // Refresh data
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert(
          "Gagal menghapus kategori. Mungkin sedang digunakan di penilaian.",
        );
      }
    }
  };

  // Submit Form (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateAssessmentCategory(formData.id, formData);
      } else {
        await createAssessmentCategory(formData);
      }
      setIsModalOpen(false);
      fetchCategories(); // Refresh data setelah sukses
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      alert("Gagal menyimpan data. Cek koneksi atau isian form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading UI
  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
        <Icon
          icon="ph:spinner-gap-bold"
          className="text-4xl text-violet-600 animate-spin"
        />
        <p className="text-violet-600 font-bold text-sm">
          Memuat Master Kategori...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 space-y-6 pt-2">
      {/* Header Area */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Master KPI
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Kelola indikator penilaian karyawan
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all"
        >
          <Icon icon="ph:plus-bold" className="text-lg" />
          <span className="hidden sm:inline">Tambah Kategori</span>
        </button>
      </div>

      {/* Daftar Kategori (Grid Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight">
                    {cat.name}
                  </h3>
                  {cat.is_active ? (
                    <span className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      Aktif
                    </span>
                  ) : (
                    <span className="bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      Nonaktif
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                  {cat.description || (
                    <em className="text-slate-400">Tidak ada deskripsi.</em>
                  )}
                </p>
              </div>

              <div className="flex gap-2 justify-end border-t border-slate-100 dark:border-slate-800 pt-3 mt-2">
                <button
                  onClick={() => handleManageQuestions(cat)}
                  className="flex items-center gap-1 text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Icon icon="ph:list-plus-bold" className="text-sm" /> Kelola
                  Pertanyaan
                </button>

                <button
                  onClick={() => handleEdit(cat)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-violet-600 bg-slate-100 hover:bg-violet-50 dark:bg-slate-800 dark:hover:bg-violet-600/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Icon icon="ph:pencil-simple-bold" className="text-sm" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Icon icon="ph:trash-bold" className="text-sm" /> Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <Icon
              icon="ph:folder-open-duotone"
              className="text-5xl mx-auto text-slate-400 mb-3"
            />
            <p className="text-slate-500 font-medium">
              Belum ada kategori penilaian.
            </p>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                {isEditing ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                <Icon icon="ph:x-bold" className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Indikator <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:text-white"
                  placeholder="Contoh: Kerja Sama Tim"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/50 dark:text-white"
                  placeholder="Jelaskan detail indikator ini..."
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-600"></div>
                </label>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {formData.is_active ? "Status Aktif" : "Status Nonaktif"}
                </span>
              </div>

              <div className="flex gap-3 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-violet-600/30 text-sm disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <Icon
                      icon="ph:spinner-gap-bold"
                      className="animate-spin text-lg"
                    />
                  ) : (
                    "Simpan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQuestionModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-violet-600 text-white">
              <div>
                <h2 className="text-lg font-bold">List Pertanyaan</h2>
                <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">
                  {selectedCategory?.name}
                </p>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="hover:rotate-90 transition-transform"
              >
                <Icon icon="ph:x-bold" className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Input Tambah Pertanyaan */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Ketik pertanyaan baru..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-violet-600/50 outline-none"
                />
                <button
                  onClick={handleAddQuestion}
                  className="bg-violet-600 text-white px-4 rounded-xl font-bold text-sm hover:bg-violet-700 transition-colors"
                >
                  Tambah
                </button>
              </div>

              {/* List Pertanyaan Terdaftar */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {isMsgLoading ? (
                  <p className="text-center text-xs text-slate-400 py-4 italic">
                    Loading pertanyaan...
                  </p>
                ) : (
                  questions.map((q, i) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group"
                    >
                      <span className="text-sm text-slate-700 font-medium">
                        <span className="text-violet-600 mr-2 font-bold">
                          {i + 1}.
                        </span>{" "}
                        {q.question_text}
                      </span>
                      <button
                       onClick={() => confirmDelete(q)}
                        className="text-slate-300 hover:text-rose-600 transition-colors"
                      >
                        <Icon icon="ph:trash-bold" />
                      </button>
                    </div>
                  ))
                )}
                {!isMsgLoading && questions.length === 0 && (
                  <p className="text-center text-xs text-slate-400 py-4 italic">
                    Belum ada pertanyaan di kategori ini.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* --- MODAL KONFIRMASI HAPUS --- */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in duration-150">
            <div className="bg-rose-100 dark:bg-rose-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon
                icon="ph:warning-circle-bold"
                className="text-3xl text-rose-600"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Hapus Pertanyaan?
            </h3>
            <p className="text-xs text-slate-500 mt-2 mb-6">
              Tindakan ini tidak bisa dibatalkan. Pertanyaan{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                "{questionToDelete?.question_text}"
              </span>{" "}
              akan dihapus permanen.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all active:scale-95"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
