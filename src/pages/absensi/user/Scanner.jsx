import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useMutation } from "@tanstack/react-query";
import { scanQr } from "@/store/api/absensiService";
import Card from "@/components/ui/Card";
import { useNavigate } from "react-router-dom"; // Asumsi pake react-router

const Scanner = () => {
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [absensiData, setAbsensiData] = useState(null);
  
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const processingRef = useRef(false); 

  const mutation = useMutation({
    mutationFn: scanQr,
    onSuccess: (data) => {
      // Set data buat ditampilin di modal
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

  useEffect(() => {
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
      } catch (e) {
        console.warn("Gagal pause:", e);
      }

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
          setStatus({ type: "error", msg: "Izin GPS diperlukan!" });
        },
        { enableHighAccuracy: true }
      );
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Gagal clear scanner:", error);
        });
      }
    };
  }, []); 

  return (
    <Card title="Karyawan - Scan QR Absensi">
      <div className="max-w-md mx-auto relative">
        <div 
          id="reader" 
          className="w-full overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-black min-h-[300px]"
        ></div>

        {/* Status Text (Keep this or remove if modal is enough) */}
        {status.msg && !showSuccessModal && (
          <div className={`mt-6 p-4 rounded-md text-center font-medium ${
              status.type === "success" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
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
          <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/60 transition-opacity duration-300">
            <div className="w-full max-w-md transform rounded-t-[32px] bg-white p-6 pb-10 shadow-2xl transition-transform duration-500 translate-y-0 animate-in slide-in-from-bottom-full">
              
              {/* Handle Bar (Aksen biar kayak app asli) */}
              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-slate-300"></div>

              <div className="text-center">
                {/* Icon Success */}
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-slate-800">Berhasil Absen!</h3>
                <p className="mt-2 text-slate-600">
                  Status: <span className="font-bold text-green-600">{absensiData?.status}</span>
                </p>
                
                <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                  <p>Jam Masuk: <span className="font-medium text-slate-800">{absensiData?.jam_masuk?.split(' ')[1] || '-'}</span></p>
                  <p>Tanggal: <span className="font-medium text-slate-800">{absensiData?.tanggal}</span></p>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-8 flex flex-col gap-3">
                  <button
                    onClick={() => navigate("/history")}
                    className="w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 active:scale-95 transition-all"
                  >
                    Lihat Riwayat Absen
                  </button>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full py-2 font-medium text-slate-400"
                  >
                    Tutup
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