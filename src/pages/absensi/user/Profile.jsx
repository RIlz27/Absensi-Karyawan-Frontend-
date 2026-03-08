import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import API from "@/store/api/absensiService.js";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser } from "@/store/api/auth/authSlice";
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Helper function to handle center crop
function getCenterCrop(mediaWidth, mediaHeight) {
  return centerCrop(
    makeAspectCrop(
      { unit: '%', width: 90 },
      1, // 1:1 Aspect Ratio (Square)
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

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
  const [avatarBlob, setAvatarBlob] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Cropping State
  const [imgSrc, setImgSrc] = useState('');
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/me");
      setUser(res.data);
      setFormData({ name: res.data.name, password: "" });
      if (res.data.avatar) {
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

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.warning("Ukuran maksimal file foto adalah 2MB");
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
        setCropModalOpen(true); // Open the modal once image is loaded in memory
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setCrop(getCenterCrop(width, height));
  };

  const getCroppedImg = async () => {
    const image = imgRef.current;
    if (!image || !completedCrop) return;

    // Batas maksimal ukuran foto profil (mencegah memory crash di HP)
    const MAX_DIMENSION = 512; 

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    // Ukuran asli dari crop (bisa mencapai ribuan pixel di HP)
    const cropWidthOriginal = completedCrop.width * scaleX;
    const cropHeightOriginal = completedCrop.height * scaleY;

    // Hitung ratio untuk melakukan downscale jika gambar aslinya terlalu besar
    let ratio = 1;
    if (cropWidthOriginal > MAX_DIMENSION || cropHeightOriginal > MAX_DIMENSION) {
        ratio = Math.min(MAX_DIMENSION / cropWidthOriginal, MAX_DIMENSION / cropHeightOriginal);
    }

    const finalWidth = Math.floor(cropWidthOriginal * ratio);
    const finalHeight = Math.floor(cropHeightOriginal * ratio);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set ukuran canvas langsung ke ukuran final (misal 512x512)
    canvas.width = finalWidth;
    canvas.height = finalHeight;
    ctx.imageSmoothingQuality = 'high';

    // Bersihkan canvas dan gambar area terpilih sambil menerapkan scale
    ctx.drawImage(
      image,
      completedCrop.x * scaleX, // titik X di gambar asli
      completedCrop.y * scaleY, // titik Y di gambar asli
      cropWidthOriginal,        // lebar area crop di gambar asli
      cropHeightOriginal,       // tinggi area crop di gambar asli
      0,
      0,
      finalWidth,              // lebar canvas akhir 
      finalHeight              // tinggi canvas akhir
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Gagal melakukan crop pada gambar.");
          resolve(null);
          return;
        }
        
        // Kompres hingga 0.8 untuk kualitas yang masih sangat tajam tapi ringan
        const finalBlob = new Blob([blob], { type: 'image/jpeg' });
        
        const previewUrl = URL.createObjectURL(finalBlob);
        setAvatarPreview(previewUrl);
        setAvatarBlob(finalBlob);
        setCropModalOpen(false); // Tutup Modal

        setImgSrc(""); // Reset
        resolve(finalBlob);
      }, "image/jpeg", 0.8); 
    });
  };

  const uploadAvatar = async () => {
    if (!avatarBlob) {
        toast.info("Pilih dan sesuaikan foto terlebih dahulu.");
        return;
    }
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      // append the generic blob with a generic name
      formData.append("avatar", avatarBlob, "profile_avatar.jpg");

      const res = await API.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Foto profil berhasil diperbarui, tampilan mungkin membutuhkan beberapa saat untuk terefresh sepenuhnya.");
      
      if (res.data.user) {
        const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedCache = { ...cachedUser, ...res.data.user };
        localStorage.setItem("user", JSON.stringify(updatedCache));
        dispatch(setReduxUser(updatedCache));
      }
      
      fetchProfile();
      setAvatarBlob(null); // Clear blob so the button disappears after success
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Gagal mengunggah foto profil, format tidak didukung.");
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
        const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedCache = { ...cachedUser, ...res.data.user };
        localStorage.setItem("user", JSON.stringify(updatedCache));
        dispatch(setReduxUser(updatedCache));
      }

      fetchProfile();
      setFormData(prev => ({ ...prev, password: "" }));
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] pb-24 relative overflow-x-hidden">
     <div className="bg-gradient-to-b from-indigo-600 to-purple-600 h-48 -mx-3 rounded-b-[100px] overflow-hidden absolute inset-x-0 top-0"></div>
      <div className="px-5 relative z-10 max-w-2xl mx-auto">
        <div className="text-center text-white mb-8">

        </div>
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl flex flex-col items-center mb-6">
          <div className="relative mb-4 group">
            <div className={`w-36 h-36 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center ${uploadingAvatar ? 'opacity-50' : ''}`}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex w-full h-full items-center justify-center rounded-full bg-indigo-500 text-white font-bold text-5xl uppercase">
                  {user?.name ? (user.name.split(" ").length > 1 ? user.name.split(" ")[0][0] + user.name.split(" ")[1][0] : user.name.split(" ")[0][0]) : "U"}
                </div>
              )}
            </div>
            <label className="absolute bottom-1 right-1 h-11 w-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform transform hover:scale-105 active:scale-95 border-2 border-white">
              <Icon icon="ph:camera-plus-bold" className="text-xl" />
              <input type="file" className="hidden" accept="image/*" onChange={onSelectFile} />
            </label>
          </div>
          
          <div className="text-center">
             <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{user?.name}</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{user?.role === 'admin' ? 'Administrator' : 'Karyawan'}</p>
          </div>

          {avatarBlob && (
            <div className="mt-5 w-full flex flex-col gap-2">
              <button 
                onClick={uploadAvatar}
                disabled={uploadingAvatar}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-2xl text-sm transition-all hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
              >
                {uploadingAvatar ? <Icon icon="ph:spinner-gap-bold" className="animate-spin text-lg" /> : <Icon icon="ph:upload-simple-bold" className="text-lg" />}
                {uploadingAvatar ? "Mengunggah..." : "Simpan Foto Profile"}
              </button>
              <button 
                onClick={() => { setAvatarBlob(null); fetchProfile(); }}
                disabled={uploadingAvatar}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold py-3 rounded-2xl text-sm transition-all hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                Batalkan
              </button>
            </div>
          )}
        </div>

        {/* Profile Data Form */}
        <form onSubmit={saveProfile} className="bg-white dark:bg-slate-800 rounded-[32px] p-6 shadow-xl space-y-5 mb-5">
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
                  type="text"
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
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-700 dark:to-slate-600 text-white font-bold rounded-2xl py-4 shadow-xl hover:shadow-2xl transition-all active:scale-95 disabled:opacity-70"
              >
                {savingProfile ? (
                  <Icon icon="ph:spinner-gap-bold" className="animate-spin text-xl" />
                ) : (
                  <Icon icon="ph:floppy-disk-back-fill" className="text-xl" />
                )}
                {savingProfile ? "Menyimpan..." : "Simpan Username / Sandi"}
              </button>
            </div>
        </form>
      </div>

      {/* CROP MODAL */}
      {cropModalOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-2xl w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 text-center">Sesuaikan Foto Profile</h3>
            
            <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center max-h-[50vh]">
              {!!imgSrc && (
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    onLoad={onImageLoad}
                    className="max-h-[50vh] w-auto object-contain"
                  />
                </ReactCrop>
              )}
            </div>

            <p className="text-xs text-center text-slate-400 mt-3">Gunakan jari atau mouse untuk menggeser kotak pemotong area wajah yang diinginkan.</p>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => { setCropModalOpen(false); setImgSrc(''); }}
                className="py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-white hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={getCroppedImg}
                disabled={!completedCrop?.width || !completedCrop?.height}
                className="py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-colors"
              >
                Terapkan Foto
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserProfile;

