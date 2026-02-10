import React, { useState } from "react";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";

// Schema Validasi
const schema = yup.object({
  nama: yup.string().required("Nama kantor wajib diisi"),
  alamat: yup.string().required("Alamat wajib diisi"),
  latitude: yup.number().typeError("Harus angka").required("Latitude wajib"),
  longitude: yup.number().typeError("Harus angka").required("Longitude wajib"),
  radius_meter: yup.number().typeError("Harus angka").required("Radius wajib"),
}).required();

const KantorForm = ({ fetchKantors, closeModal }) => {
  const [loadingLoc, setLoadingLoc] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // FUNGSI SAKTI: Ambil Lokasi GPS Browser
  const getMyLocation = () => {
    setLoadingLoc(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", position.coords.latitude);
          setValue("longitude", position.coords.longitude);
          toast.success("Lokasi berhasil diambil!");
          setLoadingLoc(false);
        },
        (error) => {
          toast.error("Gagal ambil lokasi. Pastikan GPS aktif.");
          setLoadingLoc(false);
        }
      );
    } else {
      toast.error("Browser lo gak support Geolocation");
      setLoadingLoc(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/kantor", data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Kantor Berhasil Ditambahkan");
      fetchKantors(); // Refresh tabel
      closeModal();   // Tutup modal
    } catch (error) {
      toast.error("Gagal simpan data");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputGroup name="nama" label="Nama Kantor" placeholder="Contoh: Kantor Pusat" register={register} error={errors.nama} />
      
      <InputGroup name="alamat" label="Alamat" placeholder="Jl. Nama Jalan No. XX" register={register} error={errors.alamat} />

      <div className="grid grid-cols-2 gap-4">
        <InputGroup name="latitude" label="Latitude" placeholder="-6.xxxx" register={register} error={errors.latitude} />
        <InputGroup name="longitude" label="Longitude" placeholder="106.xxxx" register={register} error={errors.longitude} />
      </div>

      {/* Tombol Ambil Lokasi */}
      <Button
        type="button"
        text={loadingLoc ? "Mengambil..." : "Ambil Lokasi Saat Ini"}
        className="btn-outline-dark w-full btn-sm"
        icon="ph:map-pin-bold"
        onClick={getMyLocation}
        disabled={loadingLoc}
      />

      <InputGroup name="radius_meter" label="Radius Absensi (Meter)" placeholder="Contoh: 50" register={register} error={errors.radius_meter} />

      <div className="flex justify-end space-x-3">
        <Button type="submit" text="Simpan Kantor" className="btn-primary" />
      </div>
    </form>
  );
};

export default KantorForm;