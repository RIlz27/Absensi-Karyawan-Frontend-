import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import API, { getKantors } from "@/store/api/absensiService";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";

const GenerateQR = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Ambil ID Kantor dari URL (kalau ada)
  const [selectedKantorId, setSelectedKantorId] = useState(
    searchParams.get("kantor_id"),
  );

  const [qrToken, setQrToken] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  // --- LOGIC 1: Fetch Semua Kantor ---
  const { data: kantors, isLoading: isLoadingKantor } = useQuery({
    queryKey: ["kantors"],
    queryFn: getKantors,
  });

  // --- LOGIC 2: Auto-select jika kantor cuma 1 ---
  useEffect(() => {
    if (!selectedKantorId && kantors) {
      if (kantors.length === 1) {
        setSelectedKantorId(kantors[0].id);
        setSearchParams({ kantor_id: kantors[0].id });
      }
    }
  }, [kantors, selectedKantorId, setSearchParams]);

  // Mutation ke Backend
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const res = await API.post("/generate-qr", payload);
      return res.data;
    },
    onSuccess: (data) => {
      setQrToken(data.qr_string || data.token);
      setTimeLeft(30);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Gagal generate QR");
      setActiveType(null);
    },
  });

  const handleGenerate = useCallback(
    (type) => {
      if (!type || !selectedKantorId) return;
      setActiveType(type);
      // Kita langsung kirim payload ke mutate
      mutate({
        type: type,
        kantor_id: selectedKantorId,
      });
    },
    [mutate, selectedKantorId], // Dependency ini penting
  );

  // --- LOGIC BARU: Watcher Ganti Kantor ---
  useEffect(() => {
    // Kalau kantor berubah dan posisi lagi nampilin QR, langsung refresh QR-nya
    if (selectedKantorId && activeType) {
      handleGenerate(activeType);
    } else if (!selectedKantorId) {
      // Kalau lagi gak milih kantor (pilih list), hapus token lama
      setQrToken(null);
    }
  }, [selectedKantorId]); // Trigger tiap kali ID kantor berubah

  // Logic Timer Auto-Refresh
  useEffect(() => {
    if (qrToken && activeType) {
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGenerate(activeType);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [qrToken, activeType, handleGenerate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // --- UI: Loading State ---
  if (isLoadingKantor)
    return <div className="p-10 text-center">Mengecek Data Kantor...</div>;

  // --- UI: Jika Kantor Belum Ada ---
  if (!kantors || kantors.length === 0) {
    return (
      <Card className="max-w-md mx-auto text-center p-6">
        <Icon
          icon="ph:info-bold"
          className="text-5xl text-warning-500 mx-auto mb-4"
        />
        <p className="mb-4 font-bold">Belum ada kantor terdaftar.</p>
        <Button
          text="Buat Kantor Sekarang"
          className="btn-primary w-full"
          onClick={() => navigate("/admin/kantor")}
        />
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Card title="Panel Generator QR Absensi">
        {/* LOGIC 3: Jika Kantor > 1 dan belum milih, suruh milih dulu */}
        {!selectedKantorId && kantors.length > 1 ? (
          <div className="text-center py-6">
            <h5 className="text-lg font-bold mb-4">
              Pilih Kantor untuk Generate QR
            </h5>
            <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
              {kantors.map((k) => (
                <button
                  key={k.id}
                  onClick={() => {
                    setSelectedKantorId(k.id);
                    setSearchParams({ kantor_id: k.id });
                  }}
                  className="p-4 border rounded-xl hover:bg-slate-50 transition-all flex justify-between items-center group"
                >
                  <span className="font-semibold text-slate-700 dark:text-white">
                    {k.nama}
                  </span>
                  <Icon
                    icon="ph:arrow-right-bold"
                    className="opacity-0 group-hover:opacity-100 transition-all"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h4 className="text-slate-900 dark:text-white text-xl font-bold mb-1">
                Pilih Tipe Absensi
              </h4>
              <p className="text-slate-500 text-xs">
                Kantor:{" "}
                <span className="font-bold text-indigo-600">
                  {kantors.find((k) => k.id == selectedKantorId)?.nama}
                </span>
              </p>
            </div>

            {/* Pemilih Tipe - Compact */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleGenerate("masuk")}
                  disabled={isPending}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                    activeType === "masuk"
                      ? "bg-white dark:bg-slate-800 text-indigo-600 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                  }`}
                >
                  <Icon
                    icon="ph:sign-in-bold"
                    className={`text-base ${activeType === "masuk" ? "text-indigo-600" : "text-slate-400"}`}
                  />
                  <span>Masuk</span>
                </button>

                <div className="w-[1px] h-4 bg-slate-200 self-center mx-1"></div>

                <button
                  type="button"
                  onClick={() => handleGenerate("pulang")}
                  disabled={isPending}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm transition-all duration-200 ${
                    activeType === "pulang"
                      ? "bg-white dark:bg-slate-800 text-red-600 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                  }`}
                >
                  <Icon
                    icon="ph:sign-out-bold"
                    className={`text-base ${activeType === "pulang" ? "text-red-600" : "text-slate-400"}`}
                  />
                  <span>Pulang</span>
                </button>
              </div>
            </div>

            {qrToken && (
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl dark:bg-slate-900 bg-slate-50/50 animate-fade-in transition-all">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 mb-5">
                  <QRCodeCanvas
                    value={qrToken}
                    size={220}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div className="w-full max-w-[220px] mb-3">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 10 ? "bg-red-500" : "bg-indigo-600"}`}
                      style={{ width: `${(timeLeft / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                    REFRESH DALAM
                  </span>
                  <div
                    className={`text-3xl font-mono font-black leading-none ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-slate-800 dark:text-white"}`}
                  >
                    {formatTime(timeLeft)}
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${activeType === "masuk" ? "bg-indigo-400" : "bg-red-400"}`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${activeType === "masuk" ? "bg-indigo-600" : "bg-red-600"}`}
                      ></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      {activeType}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <div className="flex justify-center gap-3">
        {selectedKantorId && kantors.length > 1 && (
          <Button
            text="Ganti Kantor"
            className="btn-light"
            onClick={() => setSelectedKantorId(null)}
          />
        )}
        <Button
          icon="ph:arrow-left"
          text="Kembali ke Manajemen"
          className="btn-light"
          onClick={() => navigate("/admin/kantor")}
        />
      </div>
    </div>
  );
};

export default GenerateQR;
