import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMap } from "react-leaflet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import API, { getKantors } from "@/store/api/absensiService.js";
import { toast } from "react-toastify";

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

const Kantor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const initialForm = {
    nama: "",
    alamat: "",
    latitude: -6.175392,
    longitude: 106.827153,
    radius_meter: 100,
    toleransi_menit: 15,
  };

  const [formData, setFormData] = useState(initialForm);

  const { data: kantors, isLoading } = useQuery({
    queryKey: ["kantors"],
    queryFn: getKantors,
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) return toast.error("GPS tidak didukung!");
    toast.info("Mendeteksi lokasi...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        toast.success("Lokasi terkunci!");
      },
      () => toast.error("Gagal ambil lokasi!"),
      { enableHighAccuracy: true },
    );
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setFormData({
      nama: item.nama,
      alamat: item.alamat || "",
      latitude: item.latitude,
      longitude: item.longitude,
      radius_meter: item.radius_meter,
      toleransi_menit: item.toleransi_menit || 15,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData(initialForm);
  };

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editId) {
        return await API.put(`/kantor/${editId}`, data);
      } else {
        return await API.post("/kantor", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kantors"] });
      toast.success(editId ? "Kantor diperbarui!" : "Kantor ditambahkan!");
      handleCloseModal();
    },
    onError: () => {
      toast.error("Gagal menyimpan kantor!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await API.delete(`/kantor/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kantors"] });
      toast.success("Kantor dihapus!");
    },
  });

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

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          latitude: e.latlng.lat.toFixed(6),
          longitude: e.latlng.lng.toFixed(6),
        }));
      },
    });
    return null;
  };

  if (isLoading) return <div className="p-10 text-center">Memuat Data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-bold text-2xl text-slate-900 dark:text-white">
            Manajemen Lokasi
          </h4>
          <p className="text-sm text-slate-500">
            Kelola titik lokasi absensi karyawan
          </p>
        </div>
        <Button
          text="Tambah Kantor"
          className="btn-primary"
          icon="ph:plus-bold"
          onClick={() => {
            setEditId(null);
            setFormData(initialForm);
            setShowModal(true);
          }}
        />
      </div>

      {/* CARD GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {kantors?.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                <Icon icon="ph:buildings-bold" className="text-2xl" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                >
                  <Icon icon="ph:pencil-line-bold" className="text-xl" />
                </button>
                <button
                  onClick={() =>
                    window.confirm("Hapus kantor ini?") &&
                    deleteMutation.mutate(item.id)
                  }
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <Icon icon="ph:trash-bold" className="text-xl" />
                </button>
              </div>
            </div>

            <div>
              <h5 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {item.nama}
              </h5>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                {item.alamat || "Alamat tidak tersedia"}
              </p>
            </div>

            <div className="flex items-center gap-4 py-3 border-t border-slate-50 dark:border-slate-700 mb-4">
              <div className="flex-1 text-xs">
                <span className="text-slate-400 block uppercase font-semibold">
                  Radius
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {item.radius_meter} Meter
                </span>
              </div>
              <div className="flex-1 text-xs">
                <span className="text-slate-400 block uppercase font-semibold">
                  Koordinat
                </span>
                <span className="font-bold text-slate-700 dark:text-slate-200 truncate block">
                  {item.latitude}, {item.longitude}
                </span>
              </div>
            </div>

            <Button
              text="Generate QR Absen"
              className="btn-light w-full text-sm"
              icon="ph:qr-code-bold"
              onClick={() =>
                navigate(`/admin/generate-qr?kantor_id=${item.id}`)
              }
            />
          </div>
        ))}
      </div>

      {/* MODAL (ADD & EDIT) */}
      {showModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row max-h-[90vh] animate-slide-up overflow-y-auto overflow-x-hidden">
            {/* MAP SIDE */}
            <div className="w-full md:w-3/5 h-[200px] md:h-[550px] relative bg-slate-900 flex-shrink-0">
              <MapContainer
                center={[formData.latitude, formData.longitude]}
                zoom={16}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
              >
                <ChangeView center={[formData.latitude, formData.longitude]} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; CARTO"
                />
                <Marker
                  position={[formData.latitude, formData.longitude]}
                  icon={neonIcon}
                />
                <Circle
                  center={[formData.latitude, formData.longitude]}
                  radius={parseInt(formData.radius_meter) || 0}
                  pathOptions={{
                    color: "#6366f1",
                    fillColor: "#6366f1",
                    fillOpacity: 0.15,
                    weight: 2,
                    dashArray: "5, 10",
                  }}
                />
                <MapClickHandler />
              </MapContainer>

              <button
                type="button"
                onClick={handleGetLocation}
                className="absolute top-4 right-4 z-[1000] bg-slate-800/90 backdrop-blur-sm p-3 rounded-xl shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all text-xs font-black uppercase tracking-wider text-indigo-400 border border-slate-700"
              >
                <Icon
                  icon="ph:navigation-arrow-fill"
                  className="text-lg animate-pulse"
                />
                Lokasi Saya
              </button>
            </div>

            <div className="w-full md:w-2/5 p-8 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h5 className="text-2xl font-black">
                  {editId ? "Edit" : "Tambah"} Kantor
                </h5>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-slate-100 rounded-full transition-all"
                >
                  <Icon icon="ph:x-bold" className="text-xl" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveMutation.mutate(formData);
                }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Nama Kantor
                  </label>
                  <input
                    type="text"
                    className="w-full border-slate-200 rounded-xl p-3 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none border transition-all"
                    placeholder="Contoh: Kantor Cabang Bandung"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-400">
                    Alamat
                  </label>
                  <textarea
                    className="w-full border-slate-200 rounded-xl p-3 dark:bg-slate-900 outline-none border"
                    rows="2"
                    value={formData.alamat}
                    onChange={(e) =>
                      setFormData({ ...formData, alamat: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      LATITUDE
                    </label>
                    <input
                      type="text"
                      className="w-full border-none rounded-xl p-3 text-sm bg-slate-100 dark:bg-slate-900"
                      value={formData.latitude}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      LONGITUDE
                    </label>
                    <input
                      type="text"
                      className="w-full border-none rounded-xl p-3 text-sm bg-slate-100 dark:bg-slate-900"
                      value={formData.longitude}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-sm font-bold mb-3">
                    <span>Radius Absensi</span>
                    <span className="text-indigo-600">
                      {formData.radius_meter}m
                    </span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    value={formData.radius_meter}
                    onChange={(e) =>
                      setFormData({ ...formData, radius_meter: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-indigo-300">
                    Toleransi Keterlambatan (Menit)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded bg-slate-700 p-2 text-white border border-indigo-500/30 focus:border-indigo-500 outline-none"
                    value={formData.toleransi_menit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        toleransi_menit: e.target.value,
                      })
                    }
                    placeholder="Contoh: 15"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    text="Batal"
                    className="btn-light flex-1"
                    onClick={handleCloseModal}
                    type="button"
                  />
                  <Button
                    text={editId ? "Simpan Perubahan" : "Simpan Lokasi"}
                    className="btn-primary flex-1 shadow-lg"
                    type="submit"
                    isLoading={saveMutation.isPending}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kantor;
