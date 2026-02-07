import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateQr } from "@/store/api/absensiService";
import Card from "@/components/ui/Card"; // Pake komponen card bawaan template lo
import Button from "@/components/ui/Button"; 
import { QRCodeCanvas } from "qrcode.react";

const AbsensiPage = () => {
  const [qrToken, setQrToken] = useState(null);

  const { mutate, isLoading } = useMutation({
    mutationFn: generateQr,
    onSuccess: (data) => {
      setQrToken(data.token);
    },
    onError: () => {
      alert("Gagal generate QR");
    }
  });

  return (
    <div className="grid grid-cols-1 gap-5">
      <Card title="Generator QR Absensi">
        <div className="flex gap-4 mb-6">
          <Button 
            text="Absen Masuk" 
            className="btn-primary" 
            onClick={() => mutate({ type: 'masuk', kantor_id: 1 })}
            isLoading={isLoading}
          />
          <Button 
            text="Absen Pulang" 
            className="btn-danger" 
            onClick={() => mutate({ type: 'pulang', kantor_id: 1 })}
            isLoading={isLoading}
          />
        </div>

        {qrToken && (
          <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-md">
            <QRCodeCanvas value={qrToken} size={200} />
            <p className="mt-4 text-sm font-medium text-slate-600">Scan QR ini untuk Absensi</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AbsensiPage;