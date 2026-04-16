import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default leaflet icon
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// ------- LEAFLET HELPERS -------
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
    },
  });
  return null;
}

const neonIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute h-10 w-10 animate-ping rounded-full bg-indigo-500 opacity-20"></div>
      <div class="relative h-4 w-4 rounded-full border-2 border-white bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.9)]"></div>
    </div>
  `,
  className: "custom-neon-icon",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// ------- DAYS CONFIG -------
const DAYS = [
  { label: "Senin",  value: "Monday" },
  { label: "Selasa", value: "Tuesday" },
  { label: "Rabu",   value: "Wednesday" },
  { label: "Kamis",  value: "Thursday" },
  { label: "Jumat",  value: "Friday" },
  { label: "Sabtu",  value: "Saturday" },
  { label: "Minggu", value: "Sunday" },
];

// ------- STEPPER CONFIG -------
const steps = [
  { id: 1, label: "Kantor", icon: "ph:buildings-bold" },
  { id: 2, label: "Shift",  icon: "ph:clock-bold" },
  { id: 3, label: "Admin",  icon: "ph:user-circle-gear-bold" },
];

// ------- FIELD WRAPPER -------
function Field({ label, children, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-slate-500 outline-none focus:ring-2 ring-indigo-500/40 transition-all";

// ------- STEP 1: KANTOR (with embedded Map) -------
function StepKantor({ data, setData, errors }) {
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));

  const hasCoords =
    data.latitude !== "" &&
    data.longitude !== "" &&
    !isNaN(data.latitude) &&
    !isNaN(data.longitude);

  const lat = hasCoords ? parseFloat(data.latitude) : -6.175392;
  const lng = hasCoords ? parseFloat(data.longitude) : 106.827153;

  const handleMapClick = (lat, lng) => {
    setData((d) => ({ ...d, latitude: lat, longitude: lng }));
  };

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      alert("GPS tidak didukung oleh browser Anda.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setData((d) => ({
          ...d,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
      },
      () => alert("Gagal mendapatkan lokasi GPS."),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-4">
      {/* Form fields */}
      <Field label="Nama Kantor" error={errors.nama}>
        <input className={inputCls} placeholder="PT. Absensi Indonesia" value={data.nama} onChange={set("nama")} />
      </Field>
      <Field label="Alamat Lengkap" error={errors.alamat}>
        <textarea className={inputCls} rows={2} placeholder="Jl. Contoh No. 1, Jakarta" value={data.alamat} onChange={set("alamat")} />
      </Field>

      {/* Map */}
      <Field label="Lokasi Kantor (Klik peta untuk pin)" error={errors.latitude || errors.longitude}>
        <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-white/10">
          <MapContainer
            center={[lat, lng]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            <ChangeView center={[lat, lng]} />
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[lat, lng]} icon={neonIcon} />
            <Circle
              center={[lat, lng]}
              radius={parseInt(data.radius_meter) || 100}
              pathOptions={{
                color: "#6366f1",
                fillColor: "#6366f1",
                fillOpacity: 0.15,
                weight: 2,
                dashArray: "5, 10",
              }}
            />
            <MapClickHandler onMapClick={handleMapClick} />
          </MapContainer>

          {/* GPS Button overlay */}
          <button
            type="button"
            onClick={handleGetGPS}
            className="absolute top-3 right-3 z-[1000] bg-slate-900/80 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-1.5 border border-white/10 text-indigo-400 text-xs font-bold hover:bg-slate-800/90 hover:scale-105 transition-all"
          >
            <Icon icon="ph:navigation-arrow-fill" className="text-base animate-pulse" />
            Lokasi Saya
          </button>
        </div>

        {/* Coordinates display (read-only) */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400">
            <span className="text-slate-500 uppercase text-[10px] font-bold block mb-0.5">Latitude</span>
            <span className="text-white font-mono">{data.latitude || "—"}</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-400">
            <span className="text-slate-500 uppercase text-[10px] font-bold block mb-0.5">Longitude</span>
            <span className="text-white font-mono">{data.longitude || "—"}</span>
          </div>
        </div>
      </Field>

      {/* Radius & Toleransi */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Radius Absensi (Meter)" error={errors.radius_meter}>
          <input className={inputCls} type="number" min={10} placeholder="100" value={data.radius_meter} onChange={set("radius_meter")} />
        </Field>
        <Field label="Toleransi Terlambat (Menit)" error={errors.toleransi_menit}>
          <input className={inputCls} type="number" min={0} placeholder="15" value={data.toleransi_menit} onChange={set("toleransi_menit")} />
        </Field>
      </div>
    </div>
  );
}

// ------- STEP 2: SHIFT -------
function StepShift({ data, setData, errors }) {
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));
  const toggleDay = (val) =>
    setData((d) => ({
      ...d,
      hari_kerja: d.hari_kerja.includes(val)
        ? d.hari_kerja.filter((h) => h !== val)
        : [...d.hari_kerja, val],
    }));

  return (
    <div className="space-y-4">
      <Field label="Nama Shift" error={errors.nama}>
        <input className={inputCls} placeholder="Office Hour" value={data.nama} onChange={set("nama")} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Jam Masuk" error={errors.jam_masuk}>
          <input className={inputCls} type="time" value={data.jam_masuk} onChange={set("jam_masuk")} />
        </Field>
        <Field label="Jam Pulang" error={errors.jam_pulang}>
          <input className={inputCls} type="time" value={data.jam_pulang} onChange={set("jam_pulang")} />
        </Field>
      </div>
      <Field label="Hari Kerja" error={errors.hari_kerja}>
        <div className="flex flex-wrap gap-2 mt-1">
          {DAYS.map((d) => {
            const active = data.hari_kerja.includes(d.value);
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                className={`px-3 py-1.5 rounded-xl text-[13px] font-semibold border transition-all duration-150 ${
                  active
                    ? "bg-indigo-600 border-indigo-500 text-white"
                    : "bg-white/5 border-white/10 text-slate-400 hover:border-indigo-500/40"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}

// ------- STEP 3: ADMIN -------
function StepAdmin({ data, setData, errors }) {
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.value }));
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  return (
    <div className="space-y-4">
      <Field label="Nama Lengkap" error={errors.name}>
        <input className={inputCls} placeholder="Airil Jahran" value={data.name} onChange={set("name")} />
      </Field>
      <Field label="NIP Admin" error={errors.nip}>
        <input className={inputCls} placeholder="0085689927" value={data.nip} onChange={set("nip")} />
      </Field>
      <Field label="Password" error={errors.password}>
        <div className="relative">
          <input
            className={inputCls + " pr-11"}
            type={showPw ? "text" : "password"}
            placeholder="Min. 8 karakter"
            value={data.password}
            onChange={set("password")}
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors" onClick={() => setShowPw((v) => !v)}>
            <Icon icon={showPw ? "ph:eye-slash-bold" : "ph:eye-bold"} className="text-xl" />
          </button>
        </div>
      </Field>
      <Field label="Konfirmasi Password" error={errors.password_confirmation}>
        <div className="relative">
          <input
            className={inputCls + " pr-11"}
            type={showCpw ? "text" : "password"}
            placeholder="Ulangi password"
            value={data.password_confirmation}
            onChange={set("password_confirmation")}
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors" onClick={() => setShowCpw((v) => !v)}>
            <Icon icon={showCpw ? "ph:eye-slash-bold" : "ph:eye-bold"} className="text-xl" />
          </button>
        </div>
      </Field>
    </div>
  );
}

// ------- STEPPER INDICATOR -------
function Stepper({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, i) => {
        const done = s.id < current;
        const active = s.id === current;
        return (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  done
                    ? "bg-indigo-600"
                    : active
                    ? "bg-indigo-500 ring-4 ring-indigo-500/30"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {done ? (
                  <Icon icon="ph:check-bold" className="text-white text-lg" />
                ) : (
                  <Icon
                    icon={s.icon}
                    className={`text-xl ${active ? "text-white" : "text-slate-500"}`}
                  />
                )}
              </div>
              <span
                className={`text-[11px] font-semibold mt-1.5 uppercase tracking-wider ${
                  active ? "text-indigo-400" : done ? "text-indigo-400/60" : "text-slate-600"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-12 mb-5 mx-1 transition-all duration-500 ${
                  s.id < current ? "bg-indigo-600" : "bg-white/10"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ------- MAIN WIZARD -------
export default function SetupWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);

  const [kantor, setKantor] = useState({
    nama: "",
    alamat: "",
    latitude: "",
    longitude: "",
    radius_meter: 100,
    toleransi_menit: 15,
  });

  const [shift, setShift] = useState({
    nama: "Office Hour",
    jam_masuk: "08:00",
    jam_pulang: "17:00",
    hari_kerja: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  });

  const [admin, setAdmin] = useState({
    name: "",
    nip: "",
    password: "",
    password_confirmation: "",
  });

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!kantor.nama) e.nama = "Nama kantor wajib diisi";
      if (!kantor.alamat) e.alamat = "Alamat wajib diisi";
      if (!kantor.latitude) e.latitude = "Klik peta untuk menentukan lokasi";
      if (!kantor.longitude) e.longitude = "Klik peta untuk menentukan lokasi";
      if (!kantor.radius_meter || kantor.radius_meter < 10) e.radius_meter = "Minimal 10 meter";
      if (kantor.toleransi_menit === "" || kantor.toleransi_menit < 0) e.toleransi_menit = "Wajib diisi";
    } else if (step === 2) {
      if (!shift.nama) e.nama = "Nama shift wajib diisi";
      if (!shift.jam_masuk) e.jam_masuk = "Jam masuk wajib diisi";
      if (!shift.jam_pulang) e.jam_pulang = "Jam pulang wajib diisi";
      if (!shift.hari_kerja || shift.hari_kerja.length === 0) e.hari_kerja = "Pilih minimal 1 hari kerja";
    } else if (step === 3) {
      if (!admin.name) e.name = "Nama wajib diisi";
      if (!admin.nip) e.nip = "NIP wajib diisi";
      if (!admin.password || admin.password.length < 8) e.password = "Password minimal 8 karakter";
      if (admin.password !== admin.password_confirmation) e.password_confirmation = "Password tidak cocok";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, 3));
  };

  const back = () => {
    setDirection(-1);
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const submit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setGlobalError(null);
    try {
      await axios.post(`${API_BASE}/initial-setup`, {
        kantor: {
          ...kantor,
          latitude: parseFloat(kantor.latitude),
          longitude: parseFloat(kantor.longitude),
          radius_meter: parseInt(kantor.radius_meter),
          toleransi_menit: parseInt(kantor.toleransi_menit),
        },
        shift,
        admin: {
          ...admin,
          nip: admin.nip.trim(),
          password: admin.password.trim(),
          password_confirmation: admin.password_confirmation.trim()
        },
      }, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      setDone(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Terjadi kesalahan saat setup.";
      setGlobalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const variants = {
    enter:  (dir) => ({ x: dir > 0 ? 60  : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir) => ({ x: dir > 0 ? -60 :  60, opacity: 0 }),
  };

  // ------- SUCCESS SCREEN -------
  if (done) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center max-w-sm"
        >
          <div className="w-24 h-24 rounded-full bg-indigo-600/20 flex items-center justify-center mx-auto mb-6 ring-4 ring-indigo-500/20">
            <Icon icon="ph:check-circle-bold" className="text-5xl text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Setup Selesai! 🎉</h1>
          <p className="text-slate-400 text-[15px] mb-8">
            Sistem berhasil dikonfigurasi. Silakan login dengan akun admin yang telah dibuat.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-white transition-all active:scale-95 shadow-xl shadow-indigo-600/30"
          >
            Pergi ke Halaman Login
          </button>
        </motion.div>
      </div>
    );
  }

  const titles = [
    { title: "Konfigurasi Kantor", sub: "Klik peta untuk menentukan lokasi absensi, lalu isi detail kantor" },
    { title: "Konfigurasi Shift",  sub: "Tentukan jam kerja dan hari kerja default" },
    { title: "Registrasi Admin",   sub: "Buat akun administrator pertama sistem" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-4 lg:p-8">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/20 px-4 py-2 rounded-full mb-4">
            <Icon icon="ph:sparkle-fill" className="text-indigo-400" />
            <span className="text-[13px] text-indigo-300 font-semibold">Setup Awal Sistem</span>
          </div>
          <h1 className="text-2xl font-black text-white">Absensi Karyawan</h1>
          <p className="text-slate-500 text-sm mt-1">Konfigurasi sistem sebelum digunakan pertama kali</p>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-white/[0.07] rounded-[32px] p-6 sm:p-8 shadow-2xl">
          <Stepper current={step} />

          {/* Step title */}
          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">{titles[step - 1].title}</h2>
            <p className="text-slate-400 text-sm mt-0.5">{titles[step - 1].sub}</p>
          </div>

          {globalError && (
            <div className="mb-4 flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
              <Icon icon="ph:warning-circle-bold" className="text-rose-400 text-xl flex-shrink-0 mt-0.5" />
              <p className="text-rose-400 text-sm">{globalError}</p>
            </div>
          )}

          {/* Animated step content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              {step === 1 && <StepKantor data={kantor} setData={setKantor} errors={errors} />}
              {step === 2 && <StepShift data={shift} setData={setShift} errors={errors} />}
              {step === 3 && <StepAdmin data={admin} setData={setAdmin} errors={errors} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={back}
                className="flex-shrink-0 w-12 h-12 rounded-2xl border border-white/10 text-slate-400 hover:text-white hover:border-white/20 flex items-center justify-center transition-all"
              >
                <Icon icon="ph:arrow-left-bold" />
              </button>
            )}
            <button
              type="button"
              onClick={step < 3 ? next : submit}
              disabled={submitting}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 disabled:opacity-50 rounded-2xl font-bold text-[15px] text-white transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Icon icon="line-md:loading-loop" className="text-xl animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : step < 3 ? (
                <>
                  <span>Lanjut</span>
                  <Icon icon="ph:arrow-right-bold" />
                </>
              ) : (
                <>
                  <Icon icon="ph:check-bold" />
                  <span>Selesaikan Setup</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-[12px] text-slate-600 mt-6">
          Halaman ini hanya muncul sekali saat sistem pertama kali digunakan.
        </p>
      </div>
    </div>
  );
}
