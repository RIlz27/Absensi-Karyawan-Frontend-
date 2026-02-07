import React, { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useMutation } from "@tanstack/react-query";
import { scanQr } from "@/store/api/absensiService";
import Card from "@/components/ui/Card";

const Scanner = () => {
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Refs untuk menjaga persistensi data tanpa trigger re-render
  const scannerRef = useRef(null);
  const processingRef = useRef(false); 

  const mutation = useMutation({
    mutationFn: scanQr,
    onSuccess: (data) => {
      setStatus({ type: "success", msg: data.message });
      setTimeout(() => {
        processingRef.current = false;
        setIsProcessing(false);
        // Resume kamera kalau sukses dan mau scan lagi nanti
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
    // 1. Pastikan container 'reader' kosong sebelum inisialisasi
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
        { enableHighAccuracy: true } // Akurasi tinggi buat absen
      );
    });

    // 2. CLEANUP: Ini kunci biar gak muncul removeChild error
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Gagal clear scanner secara aman:", error);
        });
      }
    };
  }, []); 

  return (
    <Card title="Karyawan - Scan QR Absensi">
      <div className="max-w-md mx-auto">
        {/* PENTING: ID 'reader' jangan dipakein conditional rendering (if/&&) */}
        <div 
          id="reader" 
          className="w-full overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-black min-h-[300px]"
        ></div>

        {status.msg && (
          <div className={`mt-6 p-4 rounded-md text-center font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
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
      </div>
    </Card>
  );
};

export default Scanner;