import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateQr } from "@/store/api/absensiService";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { QRCodeCanvas } from "qrcode.react";

const GenerateQR = () => {
  const [qrToken, setQrToken] = useState(null);
  // Tambahkan state untuk melacak tipe yang sedang loading
  const [activeType, setActiveType] = useState(null);

  const { mutate } = useMutation({
    mutationFn: generateQr,
    onSuccess: (data) => {
      setQrToken(data.token);
      setActiveType(null); // Reset setelah sukses
    },
    onError: (err) => {
      console.error("Error:", err);
      alert("Gagal: " + (err.response?.data?.message || err.message));
      setActiveType(null); // Reset setelah error
    },
  });

  const handleGenerate = (type) => {
    setActiveType(type);

    const payload = {
      type: type, // ini isinya 'masuk' atau 'pulang'
      kantor_id: 1,
    };

    console.log("Kirim payload:", payload); // Cek di console log buat mastiin
    mutate(payload);
  };

  return (
    <div className="space-y-5">
      <Card title="Panel Generator QR Absensi">
        <div className="text-center mb-8">
          <h4 className="text-slate-900 text-xl font-medium mb-2">
            Pilih Tipe Absensi
          </h4>
          <p className="text-slate-500 text-sm">
            Klik tombol di bawah untuk membuat QR Code baru (berlaku 2 menit).
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <Button
            text="QR Absen Masuk"
            className="btn-primary"
            onClick={() => handleGenerate("masuk")}
            // Tombol loading cuma jika activeType sesuai
            isLoading={activeType === "masuk"}
            // Disable kedua tombol jika ada proses apa pun
            disabled={activeType !== null}
          />
          <Button
            text="QR Absen Pulang"
            className="btn-danger"
            onClick={() => handleGenerate("pulang")}
            isLoading={activeType === "pulang"}
            disabled={activeType !== null}
          />
        </div>

        {qrToken && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 animate-fade-in">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100">
              <QRCodeCanvas
                value={qrToken}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="mt-6 text-center">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Token Aktif:
              </span>
              <code className="bg-slate-200 px-2 py-1 rounded text-slate-700 text-sm">
                {qrToken.substring(0, 10)}...
              </code>
              <p className="mt-4 text-warning-500 text-xs font-bold flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-warning-500 rounded-full animate-ping"></span>
                Berlaku selama 2 menit
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default GenerateQR;
