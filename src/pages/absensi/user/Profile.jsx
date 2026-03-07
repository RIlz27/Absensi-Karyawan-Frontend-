import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import API from "@/store/api/absensiService.js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser } from "@/store/api/auth/authSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/me");
      setUser(res.data);
      setFormData({ name: res.data.name, password: "" });
      if (res.data.avatar) {
        // Build the full URL assuming Laravel default setup, or use AbsensiService logic
        // Because "asset('storage/X')" brings full URL from backend, 
        // we might just need to construct it if it's relative.
        // For safety we assume it's relative like "avatars/xxx.jpg"
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:8000";
        setAvatarPreview(`${baseUrl}/storage/${res.data.avatar}`);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data profil.");
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.warning("Ukuran maksimal file foto adalah 2MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) {
        toast.info("Pilih foto terlebih dahulu sebelum menyimpan.");
        return;
    }
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      // Using generic axios to allow multipart/form-data or AbsensiService
      const res = await API.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      
      // Update local and potentially global state
      if (res.data.user) {
        // Update local storage to persist the avatar URL
        const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedCache = { ...cachedUser, ...res.data.user };
        localStorage.setItem("user", JSON.stringify(updatedCache));
        
        // Update Redux state so NavMenu/Header updates instantly
        dispatch(setReduxUser(updatedCache));
      }
      
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal mengunggah foto profil.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      const res = await API.post("/profile", payload);
      toast.success(res.data.message);
      
      if (res.data.user) {
        // Update local storage to persist the name
        const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedCache = { ...cachedUser, ...res.data.user };
        localStorage.setItem("user", JSON.stringify(updatedCache));
        
        // Update Redux state so NavMenu/Header updates instantly
        dispatch(setReduxUser(updatedCache));
      }

      // Re-fetch to confirm update
      fetchProfile();
      setFormData(prev => ({ ...prev, password: "" })); // Clear password field
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a]">
        <Icon icon="ph:spinner-gap-bold" className="animate-spin text-indigo-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] pb-24">
      {/* Decorative Background */}
      <div className="bg-gradient-to-b from-indigo-600 to-purple-600 h-64 -mx-5 rounded-b-[64px] absolute inset-x-0 top-0 z-0"></div>

      <div className="px-5 pt-10 relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h2 className="text-2xl font-black mb-1">Profil Karyawan</h2>
          <p className="text-indigo-100 text-sm font-medium">Kelola informasi data dirimu</p>
        </div>

        {/* Avatar Section */}
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl flex flex-col items-center mb-6">
          <div className="relative mb-4 group">
            <div className={`w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center ${uploadingAvatar ? 'opacity-50' : ''}`}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <Icon icon="ph:user-circle-bold" className="text-6xl text-slate-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 h-10 w-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform transform hover:scale-105 active:scale-95">
              <Icon icon="ph:camera-plus-bold" className="text-xl" />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </div>
          
          <div className="text-center">
             <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{user?.name}</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{user?.role === 'admin' ? 'Administrator' : 'Karyawan'}</p>
          </div>

          {avatarFile && (
            <button 
              onClick={uploadAvatar}
              disabled={uploadingAvatar}
              className="mt-4 flex items-center gap-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 font-bold px-5 py-2 rounded-xl text-sm transition-all hover:bg-indigo-100"
            >
              {uploadingAvatar ? <Icon icon="ph:spinner-gap-bold" className="animate-spin" /> : <Icon icon="ph:upload-simple-bold" />}
              {uploadingAvatar ? "Mengunggah..." : "Simpan Foto"}
            </button>
          )}
        </div>

        {/* Profile Details Form */}
        <form onSubmit={saveProfile} className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                NIP (Nomor Induk Pegawai)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={user?.nip}
                  disabled
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-12 py-3 text-slate-500 dark:text-slate-400 font-medium focus:outline-none cursor-not-allowed"
                />
                <Icon icon="ph:identification-card-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
              </div>
              <p className="text-[10px] text-slate-400 mt-2">*NIP bersifat unik dan tidak dapat diubah oleh Pihak Karyawan.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-12 py-3 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
                <Icon icon="ph:user-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Ganti Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-12 py-3 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  minLength="6"
                />
                <Icon icon="ph:lock-key-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-2xl py-4 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {savingProfile ? (
                  <Icon icon="ph:spinner-gap-bold" className="animate-spin text-xl" />
                ) : (
                  <Icon icon="ph:floppy-disk-back-fill" className="text-xl" />
                )}
                {savingProfile ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
