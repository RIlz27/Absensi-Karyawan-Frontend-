import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useMutation } from "@tanstack/react-query";
import { scanQr, scanSelfie } from "@/store/api/absensiService.js";
import Card from "@/components/ui/Card";
import { useNavigate } from "react-router-dom"; // Asumsi pake react-router

const Scanner = () => {
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [absensiData, setAbsensiData] = useState(null);
  
  // State for UX Cooldown & Countdown
  const [session, setSession] = useState({ loading: true, isCheckedIn: false, shift: null });
  const [timeLeft, setTimeLeft] = useState("");
  const [canCheckout, setCanCheckout] = useState(false);

  const [cameraMode, setCameraMode] = useState("qr"); // "qr" or "selfie"
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const processingRef = useRef(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Cek Status Absen Hari Ini
  useEffect(() => {
    const checkState = async () => {
      try {
        // Since backend already handles double-in, we just prevent the UI
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        const res = await API.get("/history");
        const todayRecord = res.data.find(a => a.tanggal === todayStr);

        if (todayRecord && !todayRecord.jam_pulang) {
          setSession({ loading: false, isCheckedIn: true, shift: todayRecord.shift });
        } else {
          setSession({ loading: false, isCheckedIn: false, shift: null });
        }
      } catch (e) {
        setSession({ loading: false, isCheckedIn: false, shift: null });
      }
    };
    checkState();
  }, [showSuccessModal]); // Re-run when modal closes after successful scan

  // Countdown Timer Logic
  useEffect(() => {
    let timer;
    if (session.isCheckedIn && session.shift) {
      timer = setInterval(() => {
        const now = new Date();
        const [hours, minutes, seconds] = session.shift.jam_pulang.split(':');
        
        const returnTime = new Date();
        returnTime.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || 0), 0);

        const diff = returnTime - now;

        if (diff <= 0) {
          setTimeLeft("Waktu Pulang Tiba!");
          setCanCheckout(true);
          clearInterval(timer);
        } else {
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${h}j ${m}m ${s}d`);
          setCanCheckout(false);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [session]);

  const switchMode = async (mode) => {
    setCameraMode(mode);
    if (mode === "selfie") {
      if (scannerRef.current) {
        try { await scannerRef.current.clear(); } catch (e) {}
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        setStatus({ type: "error", msg: "Akses kamera ditolak" });
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    }
  };

  const mutationSelfie = useMutation({
    mutationFn: scanSelfie,
    onSuccess: (data) => {
      setAbsensiData(data.data); 
      setShowSuccessModal(true);
      setStatus({ type: "success", msg: data.message });
      setIsProcessing(false);
    },
    onError: (error) => {
      setStatus({ type: "error", msg: error.response?.data?.message || "Gagal Absen Selfie" });
      setIsProcessing(false);
    },
  });

  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsProcessing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas exact same dimensions as video source
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const foto = canvas.toDataURL('image/jpeg', 0.8);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Basic Mock Detection (Anti Fraud Pillar 6)
        // Devices that mock often return perfectly 0 altitude and altitude accuracy
        const isMock = position.coords.altitude === 0 && position.coords.altitudeAccuracy === 0;
        if (isMock) {
             setStatus({ type: "error", msg: "Aplikasi mendeteksi GPS Palsu (Mock Location)" });
             setIsProcessing(false);
             return;
        }

        mutationSelfie.mutate({
          foto: foto,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        setIsProcessing(false);
        let errorMsg = "Gagal mengambil lokasi GPS.";
        if (err.code === 1) errorMsg = "Izin akses Lokasi ditolak oleh browser (Coba cek gembok URL/Pengaturan).";
        else if (err.code === 2) errorMsg = "Sinyal GPS tidak ditemukan. Pastikan GPS menyala.";
        else if (err.code === 3) errorMsg = "Pencarian lokasi habis waktu (Timeout). Coba di area terbuka.";
        setStatus({ type: "error", msg: errorMsg });
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  };

  const mutation = useMutation({
    mutationFn: scanQr,
    onSuccess: (data) => {
      setAbsensiData(data.data); 
      setShowSuccessModal(true);
      setStatus({ type: "success", msg: data.message });
      
      setTimeout(() => {
        processingRef.current = false;
        setIsProcessing(false);
        if (scannerRef.current) {
          try { scannerRef.current.resume(); } catch (e) {}
        }
      }, 5000);
    },
    onError: (error) => {
      setStatus({
        type: "error",
        msg: error.response?.data?.message || "Gagal Absen",
      });
      setTimeout(() => {
        processingRef.current = false;
        setIsProcessing(false);
        if (scannerRef.current) {
          try { scannerRef.current.resume(); } catch (e) {}
        }
      }, 3000);
    },
  });

  // Scanner Initialization Logic
  useEffect(() => {
    if (session.loading) return;

    // Hanya render scanner jika BELUM check-in, ATAU SUDAH waktunya checkout (canCheckout)
    if ((!session.isCheckedIn || canCheckout) && cameraMode === "qr") {
       // Wait a bit for the DOM element to exist
       setTimeout(() => {
           const readerNode = document.getElementById('reader');
           if (!readerNode) return;

           const scanner = new Html5QrcodeScanner("reader", {
             fps: 10,
             qrbox: { width: 250, height: 250 },
             aspectRatio: 1.0,
             showTorchButtonIfSupported: true,
           });
           
           scannerRef.current = scanner;

           scanner.render((result) => {
             if (processingRef.current) return;

             processingRef.current = true; 
             setIsProcessing(true); 

             try {
               scanner.pause(true);
             } catch (e) {}

             navigator.geolocation.getCurrentPosition(
               (position) => {
                 mutation.mutate({
                   kode_qr: result,
                   latitude: position.coords.latitude,
                   longitude: position.coords.longitude,
                 });
               },
               (err) => {
                 processingRef.current = false; 
                 setIsProcessing(false);
                 try { scanner.resume(); } catch (e) {}
                 let errorMsg = "Gagal mengambil lokasi GPS.";
                 if (err.code === 1) errorMsg = "Izin akses Lokasi ditolak oleh browser (Coba cek gembok URL/Pengaturan).";
                 else if (err.code === 2) errorMsg = "Sinyal GPS tidak ditemukan. Pastikan GPS menyala.";
                 else if (err.code === 3) errorMsg = "Pencarian lokasi habis waktu (Timeout). Coba di area terbuka.";
                 setStatus({ type: "error", msg: errorMsg });
               },
               { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
             );
           });
       }, 100);
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
      }
      if (videoRef.current && videoRef.current.srcObject) {
         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [session, canCheckout, cameraMode]); 

  const getDisplayTime = (timeStr) => {
    if (!timeStr) return "-";
    if (timeStr.includes(" ")) return timeStr.split(" ")[1].substring(0, 5);
    try {
      const d = new Date(timeStr);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":");
    } catch(e) {
      return "-";
    }
  };

  return (
    <Card title="Karyawan - Scan QR Absensi">
      <div className="max-w-md mx-auto relative">
        
        {session.loading ? (
             <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
        ) : (
            session.isCheckedIn && !canCheckout ? (
                // UI Cooldown / Countdown
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-center text-white shadow-xl shadow-indigo-500/30">
                    <div className="mx-auto bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                       <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Anda Sedang Bekerja</h3>
                    <p className="text-indigo-100 text-sm mb-8">Pemindai QR akan aktif kembali setelah jam shift Anda berakhir.</p>
                    
                    <div className="bg-white/10 rounded-2xl p-4 border border-white/20 backdrop-blur-md">
                        <p className="text-xs uppercase tracking-widest text-indigo-100 font-bold mb-2">Menunggu Jam Pulang</p>
                        <p className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-indigo-100">{timeLeft}</p>
                    </div>
                </div>
            ) : (
                // UI Scanner
                <div className="flex flex-col gap-4">
                  <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-sm mx-auto">
                    <button 
                      onClick={() => switchMode("qr")} 
                      className={`flex-1 py-2 font-bold text-sm rounded-lg transition-all ${cameraMode === "qr" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                      Scan QR
                    </button>
                    <button 
                      onClick={() => switchMode("selfie")} 
                      className={`flex-1 py-2 font-bold text-sm rounded-lg transition-all ${cameraMode === "selfie" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                      Selfie (Darurat)
                    </button>
                  </div>

                  {cameraMode === "qr" ? (
                    <div 
                      id="reader" 
                      className="w-full overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-black min-h-[300px]"
                    ></div>
                  ) : (
                    <div className="relative w-full overflow-hidden rounded-lg border-2 border-slate-300 bg-black aspect-square flex flex-col items-center justify-center group">
                      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover"></video>
                      <button 
                        onClick={captureSelfie}
                        disabled={isProcessing}
                        className="absolute bottom-6 bg-white hover:bg-slate-100 text-indigo-600 font-bold py-3 px-8 rounded-full shadow-2xl active:scale-95 transition-all flex items-center gap-2 z-10 disabled:opacity-50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Jepret & Absen
                      </button>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
            )
        )}

        {/* Status Text */}
        {status.msg && !showSuccessModal && (
          <div className={`mt-6 p-4 rounded-md text-center font-medium ${
              status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
            {status.msg}
          </div>
        )}

        {(mutation.isPending || isProcessing) && (
          <div className="mt-4 flex flex-col items-center">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="mt-2 text-blue-600 font-bold">Verifikasi Absensi...</p>
          </div>
        )}

        {/* --- BOTTOM SHEET MODAL --- */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/60 transition-opacity duration-300 backdrop-blur-sm">
            <div className="w-full max-w-md transform rounded-t-[32px] bg-white dark:bg-slate-900 p-6 pb-10 shadow-2xl transition-transform duration-500 translate-y-0 animate-in slide-in-from-bottom-full border-t border-white/10">
              
              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-700"></div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10">
                  <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Berhasil Absen!</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
                  Status: <span className="font-bold px-2 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg text-sm">{absensiData?.status}</span>
                </p>
                
                <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 p-5 text-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Jam</span>
                    <span className="font-bold text-slate-800 dark:text-white text-lg">
                      {getDisplayTime(absensiData?.jam_pulang || absensiData?.jam_masuk)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700/50">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Tanggal</span>
                    <span className="font-semibold text-slate-800 dark:text-white">{absensiData?.tanggal || "-"}</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                  <button
                    onClick={() => {
                        setShowSuccessModal(false);
                        navigate("/user/riwayat"); 
                    }}
                    className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-4 font-bold text-white shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:shadow-[0_8px_30px_rgb(79,70,229,0.4)] active:scale-95 transition-all text-[15px]"
                  >
                    Lihat Riwayat Absen
                  </button>
                  <button
                    onClick={() => {
                        setShowSuccessModal(false);
                        navigate("/user/dashboard"); 
                    }}
                    className="w-full rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-4 font-bold text-slate-700 dark:text-slate-300 active:scale-95 transition-all text-[15px]"
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Scanner;