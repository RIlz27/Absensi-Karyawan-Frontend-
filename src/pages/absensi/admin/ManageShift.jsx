import React, { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import axios from "axios";
import { toast } from "react-toastify";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import API, {
  postShiftTambahan,
  postShiftBiasa,
  getUsers,
} from "@/store/api/absensi-service.js";

const ManageShift = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [savedDefaultShift, setSavedDefaultShift] = useState("");

  const [extraShifts, setExtraShifts] = useState(() => {
    const saved = localStorage.getItem("master_extra_shifts");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("master_extra_shifts", JSON.stringify(extraShifts));
  }, [extraShifts]);

  const [tempSelectedDays, setTempSelectedDays] = useState([]);

  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showApplyShiftModal, setShowApplyShiftModal] = useState(false);
  const [showHariModal, setShowHariModal] = useState(false);
  const [modalMode, setModalMode] = useState("biasa");

  const [selectedJam, setSelectedJam] = useState("08");
  const [selectedMenit, setSelectedMenit] = useState("00");
  const [selectedJamPulang, setSelectedJamPulang] = useState("17");
  const [selectedMenitPulang, setSelectedMenitPulang] = useState("00");
  const [selectedDay, setSelectedDay] = useState("Senin");
  const [selectedColor, setSelectedColor] = useState("#EAB308");
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [userSpecificShifts, setUserSpecificShifts] = useState([]);
  const [editingShiftId, setEditingShiftId] = useState(null);

  const token = localStorage.getItem("token");

  const { data: shiftData, isLoading: isShiftLoading } = useQuery({
    queryKey: ["shift-master"],
    queryFn: async () => {
      const { data } = await API.get("/shifts");
      return data && data.length > 0 ? data[0] : null;
    },
    staleTime: 5000,
  });

  const { data: allMasterShifts, isLoading: loadingMaster } = useQuery({
    queryKey: ["shift-all"],
    queryFn: async () => {
      const { data } = await API.get("/shifts");
      return data;
    },
  });

  const dayMap = {
    Monday: "Senin",
    Tuesday: "Selasa",
    Wednesday: "Rabu",
    Thursday: "Kamis",
    Friday: "Jumat",
    Saturday: "Sabtu",
    Sunday: "Minggu",
  };

  const activeDaysFromApi =
    (shiftData?.hari_kerja || shiftData?.hariKerja)?.map(
      (d) => dayMap[d.hari],
    ) || [];

  useEffect(() => {
    if (shiftData) {
      const jamMasuk = shiftData.jam_masuk?.substring(0, 5) || "08:00";
      const jamPulang = shiftData.jam_pulang?.substring(0, 5) || "17:00";

      setSavedDefaultShift(`${jamMasuk} - ${jamPulang}`);

      if (activeDaysFromApi.length > 0) {
        setTempSelectedDays(activeDaysFromApi);
        setSelectedDay(activeDaysFromApi[0]);
      }
    }
  }, [shiftData]);

  const saveShiftMutation = useMutation({
    mutationFn: (payload) => postShiftTambahan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["user-shifts", selectedUserDetail?.id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Gagal simpan shift tambahan");
    },
  });

  // 2. MUTATION SHIFT BIASA
  const saveShiftBiasaMutation = useMutation({
    mutationFn: (payload) => postShiftBiasa(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["user-shifts", selectedUserDetail?.id]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Gagal simpan shift biasa");
    },
  });

  // 3. FUNGSI EKSEKUSI TOMBOL SIMPAN
  const handleSaveAllShiftsToBackend = async () => {
    if (!selectedUserDetail?.id) {
      toast.error("Pilih karyawan terlebih dahulu!");
      return;
    }

    const basePayload = {
      user_ids: [selectedUserDetail.id],
      shift_id: shiftData?.id || 1,
      kantor_id: selectedUserDetail?.kantor_id || 1, 
    };

    try {
      await saveShiftBiasaMutation.mutateAsync(basePayload);
      if (userSpecificShifts.length > 0) {
        const tambahanPromises = userSpecificShifts.map((shift) => {
          const indoToEng = {
            Senin: "Monday",
            Selasa: "Tuesday",
            Rabu: "Wednesday",
            Kamis: "Thursday",
            Jumat: "Friday",
            Sabtu: "Saturday",
            Minggu: "Sunday",
          };
          const hariInggris = indoToEng[shift.day] || shift.day;

          return saveShiftMutation.mutateAsync({
            ...basePayload,
            shift_id: shift.shift_id, 
            hari: hariInggris,
          });
        });
        await Promise.all(tambahanPromises);
      }

      toast.success("Seluruh jadwal shift berhasil diplot!");
    } catch (error) {
      console.error("Gagal proses shift:", error);
    }
  };
  // ==========================================

  const jamList = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const menitList = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  const updateHariMutation = useMutation({
    mutationFn: async (newDays) => {
      const indoToEng = {
        Senin: "Monday",
        Selasa: "Tuesday",
        Rabu: "Wednesday",
        Kamis: "Thursday",
        Jumat: "Friday",
        Sabtu: "Saturday",
        Minggu: "Sunday",
      };

      const formattedDays = newDays.map((day) => indoToEng[day] || day);
      if (!shiftData?.id) throw new Error("ID Master Shift tidak ditemukan");
      return await API.put(`/shifts/${shiftData.id}`, {
        hari_kerja: formattedDays,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-master"] });
      setShowHariModal(false);
      toast.success("Berhasil memperbarui hari kerja!");
    },
    onError: (err) => {
      const message = err.response?.data?.message || err.message;
      toast.error("Error: " + message);
    },
  });

  const handleOpenTambahShift = () => {
    if (shiftData) {
      const [hIn, mIn] = shiftData.jam_masuk.split(":");
      const [hOut, mOut] = shiftData.jam_pulang.split(":");
      setSelectedJam(hIn);
      setSelectedMenit(mIn);
      setSelectedJamPulang(hOut);
      setSelectedMenitPulang(mOut);
    }
    setModalMode("tambahan");
    setShowShiftModal(true);
  };

  const handleEditShift = (s) => {
    setModalMode("tambahan");
    setEditingShiftId(s.id);
    setSelectedDay(s.day);
    setSelectedColor(s.color || "#EAB308");
    const [masuk, pulang] = s.time.split(" - ");
    const [hIn, mIn] = masuk.split(":");
    const [hOut, mOut] = pulang.split(":");
    setSelectedJam(hIn);
    setSelectedMenit(mIn);
    setSelectedJamPulang(hOut);
    setSelectedMenitPulang(mOut);
    setShowShiftModal(true);
  };

  const handleEditMasterShift = (s) => {
    setModalMode("tambahan");
    setEditingShiftId(s.id);
    if (s.warna) setSelectedColor(s.warna);

    // Attempt to extract Day from string "Shift Selasa (08:00)" if exists
    if (s.nama && s.nama.includes("Shift ")) {
      const possibleDay = s.nama.split(" ")[1];
      if (daysEnum.find((d) => d.value === possibleDay))
        setSelectedDay(possibleDay);
    }

    const [hIn, mIn] = s.jam_masuk.split(":");
    const [hOut, mOut] = s.jam_pulang.split(":");
    setSelectedJam(hIn);
    setSelectedMenit(mIn);
    setSelectedJamPulang(hOut);
    setSelectedMenitPulang(mOut);
    setShowShiftModal(true);
  };

  const handleSelectShift = (preset) => {
    if (!userSpecificShifts.find((s) => s.id === preset.id)) {
      setUserSpecificShifts([...userSpecificShifts, preset]);
    }
    setShowApplyShiftModal(false);
  };

  const onSelectShift = (master) => {
    setUserSpecificShifts([
      ...userSpecificShifts,
      {
        id: Date.now(),
        shift_id: master.id,
        day: selectedDay,
        time: `${master.jam_masuk.substring(0, 5)} - ${master.jam_pulang.substring(0, 5)}`,
      },
    ]);
  };

  const handleScroll = (e, type) => {
    const index = Math.round(e.target.scrollTop / 48);
    const val = type.includes("jam") ? jamList[index] : menitList[index];
    if (!val) return;
    if (type === "jamMasuk") setSelectedJam(val);
    else if (type === "menitMasuk") setSelectedMenit(val);
    else if (type === "jamPulang") setSelectedJamPulang(val);
    else if (type === "menitPulang") setSelectedMenitPulang(val);
  };

  const handleConfirmShift = async () => {
    const jamMasuk = `${selectedJam}:${selectedMenit}:00`;
    const jamPulang = `${selectedJamPulang}:${selectedMenitPulang}:00`;

    const payload = {
      nama: `Shift ${selectedDay} (${selectedJam}:${selectedMenit})`,
      jam_masuk: jamMasuk,
      jam_pulang: jamPulang,
      warna: selectedColor,
    };

    try {
      if (editingShiftId) {
        await API.put(`/shifts/${editingShiftId}`, payload);
        toast.success("Master Shift berhasil diperbarui!");
      } else {
        await API.post("/shifts", payload);
        toast.success("Master Shift baru berhasil masuk Database!");
      }
      queryClient.invalidateQueries({ queryKey: ["shift-all"] });
      setShowShiftModal(false);
    } catch (error) {
      toast.error("Gagal simpan ke database");
    }
  };

  const { data: userShifts, refetch } = useQuery({
    queryKey: ["user-shifts", selectedUserDetail?.id],
    queryFn: () =>
      API.get(`/user-shifts/${selectedUserDetail.id}`).then((res) => res.data),
    enabled: !!selectedUserDetail,
  });

  const daysEnum = [
    { label: "Senin", value: "Senin" },
    { label: "Selasa", value: "Selasa" },
    { label: "Rabu", value: "Rabu" },
    { label: "Kamis", value: "Kamis" },
    { label: "Jumat", value: "Jumat" },
    { label: "Sabtu", value: "Sabtu" },
    { label: "Minggu", value: "Minggu" },
  ];

  const colorOptions = [
    "#10B981",
    "#22C55E",
    "#3B82F6",
    "#A855F7",
    "#EC4899",
    "#EAB308",
    "#F97316",
  ];

  const { data: usersData } = useQuery({
    queryKey: ["fetch-users"],
    queryFn: getUsers,
  });
  const users = Array.isArray(usersData) ? usersData : usersData?.data || [];
  const filteredUsers = users.filter((u) =>
    u?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white p-5 pb-4 space-y-6 transition-colors duration-300">
      {/* HEADER: HARI KERJA */}
      <div className="bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 rounded-3xl p-5 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest">
            Hari Kerja Terpilih
          </h2>
          <div className="flex flex-wrap gap-1">
            {tempSelectedDays.map((d) => (
              <span
                key={d}
                className="text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-2 py-2 rounded-full border border-indigo-200 dark:border-indigo-500/30"
              >
                {d.substring(0, 3)}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowHariModal(true)}
          className="w-10 h-10 rounded-full bg-white dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/30 shadow-sm"
        >
          <Icon
            icon="ph:pencil-simple-line-bold"
            className="text-indigo-500 dark:text-indigo-400"
          />
        </button>
      </div>

      {/* MANAGE SHIFT CARD */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[32px] p-6 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-2xl space-y-4">
        <h2 className="text-lg text-slate-900 dark:text-white font-bold flex items-center gap-2">
          <Icon
            icon="ph:clock-user-bold"
            className="text-indigo-500 text-2xl"
          />{" "}
          Manage Shift
        </h2>

        <div className="h-px w-full bg-slate-200 dark:bg-white/5 lg:my-2"></div>

        {/* DEFAULT SECTION */}
        <div className="space-y-4">
          <p className="text-[14px] font-medium text-slate-500 dark:text-slate-400">
            Shift Hari Biasa
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 pr-4 pl-3 py-2 rounded-full">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-[14px] font-medium text-slate-700 dark:text-white flex-1 truncate">
                Setiap Hari, {savedDefaultShift}
              </span>
            </div>
            <button
              onClick={() => {
                setModalMode("biasa");
                if (shiftData) {
                  const [hIn, mIn] = shiftData.jam_masuk.split(":");
                  setSelectedJam(hIn);
                  setSelectedMenit(mIn);
                  const [hOut, mOut] = shiftData.jam_pulang.split(":");
                  setSelectedJamPulang(hOut);
                  setSelectedMenitPulang(mOut);
                  setEditingShiftId(shiftData.id);
                  setSelectedColor(shiftData.warna || "#3B82F6");
                }
                setShowShiftModal(true);
              }}
              className="w-[38px] h-[38px] flex-shrink-0 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center transition-colors hover:bg-slate-200 dark:hover:bg-white/20"
            >
              <Icon
                icon="ph:pencil-simple-fill"
                className="text-slate-500 dark:text-slate-300 text-lg"
              />
            </button>
          </div>
        </div>

        <div className="h-px w-full bg-slate-200 dark:bg-white/5 lg:my-2"></div>

        {/* TAMBAHAN SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-medium text-slate-500 dark:text-slate-400">
              Shift Tambahan
            </p>
            <button className="text-[14px] font-bold text-indigo-600 dark:text-[#7f66f6] hover:text-indigo-500 transition-colors">
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {allMasterShifts
              ?.filter((s) => s.id !== shiftData?.id)
              .map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleEditMasterShift(s)}
                  className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 pl-3 pr-2 py-2 rounded-full text-[14px] font-medium text-slate-700 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: s.warna || "#3B82F6" }}
                    />
                    <span className="whitespace-nowrap">
                      {s.nama.includes("Shift ")
                        ? s.nama.split("Shift ")[1]
                        : s.nama}
                      , {s.jam_masuk.substring(0, 5)} -{" "}
                      {s.jam_pulang.substring(0, 5)}
                    </span>
                  </div>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (window.confirm(`Hapus master shift "${s.nama}"?`)) {
                        try {
                          await API.delete(`/shifts/${s.id}`);
                          queryClient.invalidateQueries(["shift-all"]);
                          toast.success("Master Shift dihapus");
                        } catch (err) {
                          toast.error("Gagal menghapus shift");
                        }
                      }
                    }}
                    className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors ml-1"
                  >
                    <Icon icon="ph:x-bold" className="text-xs" />
                  </button>
                </div>
              ))}

            {/* Tombol Tambah Master Shift Baru */}
            <button
              onClick={() => {
                setEditingShiftId(null);
                setModalMode("tambahan");
                setShowShiftModal(true);
              }}
              className="w-[38px] h-[38px] rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-white transition-all"
            >
              <Icon icon="ph:plus-bold" />
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 rounded-[18px] font-bold text-[15px] tracking-wide text-white shadow-lg active:scale-95 transition-all"
          >
            Pilih Cepat
          </button>
        </div>
      </div>

      {/* SEARCH & LIST KARYAWAN */}
      <div className="space-y-4">
        <div className="relative">
          <Icon
            icon="ph:magnifying-glass"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Cari Nama Karyawan"
            className="w-full bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none text-slate-900 dark:text-white shadow-sm focus:ring-2 ring-indigo-500/20 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="lg:col-span-5 space-y-3 h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
          {filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 italic bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <Icon
                  icon="line-md:loading-twotone-loop"
                  className="text-3xl mb-2"
                />
                <p className="text-sm">Menarik data...</p>
              </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  setSelectedUserDetail(user);
                  setUserSpecificShifts([]);
                }}
                className={`group p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  selectedUserDetail?.id === user.id
                    ? "bg-white dark:bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500"
                    : "bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center overflow-hidden text-indigo-600 dark:text-indigo-400 font-bold border-2 border-transparent group-hover:border-indigo-500/50 transition-colors">
                    {user.avatar ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/avatars/${user.avatar}`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => { 
                          e.target.onerror = null; 
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`; 
                        }}
                      />
                    ) : (
                      <>{user.name.charAt(0)}</>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                      {user.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      NIP: {user.nip}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-tight ${
                    user.role === "admin"
                      ? "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {user.role}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL HARI KERJA */}
      {showHariModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-[32px] p-6 border border-slate-200 dark:border-white/10 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-sm font-bold mb-5 text-center text-slate-800 dark:text-slate-200">
              Setel Hari Kerja Default
            </h3>
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto no-scrollbar">
              {daysEnum.map((day) => {
                const isSelected = tempSelectedDays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button" // Biasakan kasih type button biar gak submit form sengaja
                    onClick={() =>
                      setTempSelectedDays((prev) =>
                        isSelected
                          ? prev.filter((d) => d !== day.value)
                          : [...prev, day.value],
                      )
                    }
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500/50"
                        : "bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-white/5"
                    }`}
                  >
                    <span
                      className={`text-sm font-bold ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}
                    >
                      {day.label}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-indigo-500 border-indigo-500"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {isSelected && (
                        <Icon
                          icon="ph:check-bold"
                          className="text-xs text-white"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => updateHariMutation.mutate(tempSelectedDays)}
              disabled={updateHariMutation.isPending}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-sm text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {updateHariMutation.isPending
                ? "Menyimpan ke DB..."
                : "Simpan Hari"}
            </button>
          </div>
        </div>
      )}

      {selectedUserDetail && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md"
          onClick={() => setSelectedUserDetail(null)}
        >
          <div
            className="bg-white dark:bg-[#1a2332] w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-slate-200 dark:border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-[52px] h-[52px] rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border">
                {selectedUserDetail.avatar ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL?.replace("/api", "")}/storage/avatars/${selectedUserDetail.avatar}`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUserDetail.name)}&background=6366f1&color=fff`; 
                    }}
                  />
                ) : (
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUserDetail.name)}&background=3b82f6&color=fff`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="text-xl font-medium text-slate-900 dark:text-white leading-tight">
                  {selectedUserDetail.name}
                </h3>
                <p className="text-[14px] text-slate-500 dark:text-slate-400 font-normal">
                  Karyawan
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-slate-200 dark:bg-white/5 mb-5"></div>

            <div className="space-y-5">
              <div>
                <p className="text-[14px] font-medium text-slate-500 dark:text-slate-400 mb-3">
                  Shift default
                </p>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-3 py-2 rounded-full w-fit">
                  <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-[14px] font-medium text-slate-700 dark:text-white">
                    Setiap Hari, {savedDefaultShift}
                  </span>
                </div>
              </div>

              <div className="h-px w-full bg-slate-200 dark:bg-white/5"></div>

              <div>
                <p className="text-[14px] font-medium text-slate-500 dark:text-slate-400 mb-3">
                  Shift Tambahan
                </p>
                <div className="flex flex-wrap gap-2 items-center">
                  {userShifts
                    ?.filter((s) => s.tipe === "tambahan")
                    .map((s) => (
                      <div
                        key={`db-${s.id}`}
                        className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 pl-3 pr-2 py-2 rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: s.shift?.warna || "#10B981",
                          }}
                        />
                        <span className="text-[14px] font-medium text-slate-700 dark:text-white">
                          {dayMap[s.hari] || s.hari},{" "}
                          {s.shift?.jam_masuk?.substring(0, 5)} -{" "}
                          {s.shift?.jam_pulang?.substring(0, 5)}
                        </span>
                        <button
                          onClick={async () => {
                            if (window.confirm("Hapus jadwal dari database?")) {
                              try {
                                await API.delete(`/user-shifts/${s.id}`);
                                queryClient.invalidateQueries([
                                  "user-shifts",
                                  selectedUserDetail?.id,
                                ]);
                                toast.success("Jadwal dihapus permanen");
                              } catch (err) {
                                toast.error("Gagal hapus");
                              }
                            }
                          }}
                          className="hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors w-5 h-5 flex items-center justify-center rounded-full ml-1"
                        >
                          <Icon icon="ph:x-bold" className="text-[10px]" />
                        </button>
                      </div>
                    ))}

                  {/* 2. Tampilkan data DRAF (yang baru dipilih tapi belum disimpan) */}
                  {userSpecificShifts.map((s) => (
                    <div
                      key={`temp-${s.id}`}
                      className="flex items-center gap-2 bg-amber-50 dark:bg-white/5 border border-amber-200 dark:border-white/5 pl-3 pr-2 py-2 rounded-full cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors animate-pulse"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: s.color || "#10B981" }}
                      />
                      <span className="text-[14px] font-medium text-amber-700 dark:text-amber-400">
                        {s.day}, {s.time}
                      </span>
                      <button
                        onClick={() =>
                          setUserSpecificShifts((prev) =>
                            prev.filter((x) => x.id !== s.id),
                          )
                        }
                        className="hover:bg-rose-500/10 text-amber-500/50 hover:text-rose-500 transition-colors w-5 h-5 flex items-center justify-center rounded-full ml-1"
                      >
                        <Icon icon="ph:x-bold" className="text-[10px]" />
                      </button>
                    </div>
                  ))}

                  {/* Tombol Dropdown Tambah Master Shift ke dalam Draf */}
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="w-[38px] h-[38px] rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-white transition-all">
                      <Icon icon="ph:plus-bold" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95 z-0"
                      enterTo="transform opacity-100 scale-100 z-50"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100 z-50"
                      leaveTo="transform opacity-0 scale-95 z-0"
                    >
                      <Menu.Items className="absolute left-2 mt-2 w-72 origin-top-right rounded-2xl bg-white dark:bg-[#1a222c] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-[9999]">
                        <div className="p-3 border-b border-slate-100 dark:border-white/5">
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Pilih Shift Tambahan
                          </p>
                        </div>
                        <div className="p-2 space-y-1 max-h-60 overflow-y-auto no-scrollbar">
                          {loadingMaster ? (
                            <div className="text-center py-4 text-xs text-slate-400">
                              Loading...
                            </div>
                          ) : allMasterShifts?.length > 0 ? (
                            allMasterShifts.map((master) => (
                              <Menu.Item key={master.id}>
                                {({ active }) => (
                                  <button
                                    onClick={() => {
                                      const newShiftEntry = {
                                        id: Date.now(),
                                        shift_id: master.id,
                                        day: master.nama.includes("Shift ") ? master.nama.split(" ")[1] : "Biasa",
                                        time: `${master.jam_masuk.substring(0, 5)} - ${master.jam_pulang.substring(0, 5)}`,
                                        color: master.warna || "#10B981",
                                        nama: master.nama,
                                      };
                                      setUserSpecificShifts([
                                        ...userSpecificShifts,
                                        newShiftEntry,
                                      ]);
                                    }}
                                    className={`${
                                      active
                                        ? "bg-slate-50 dark:bg-white/5"
                                        : ""
                                    } w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-transparent dark:border-white/5 transition-all mb-1`}
                                  >
                                    <div
                                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                      style={{
                                        backgroundColor:
                                          master.warna || "#10B981",
                                      }}
                                    />
                                    <div className="text-left font-medium text-[13px] text-slate-700 dark:text-slate-300">
                                      {master.nama.includes("Shift ")
                                        ? master.nama.split("Shift ")[1]
                                        : master.nama}
                                      , {master.jam_masuk.substring(0, 5)} -{" "}
                                      {master.jam_pulang.substring(0, 5)}
                                    </div>
                                  </button>
                                )}
                              </Menu.Item>
                            ))
                          ) : (
                            <div className="text-center py-4 text-xs text-slate-500">
                              Tidak ada shift tersedia
                            </div>
                          )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveAllShiftsToBackend}
                  disabled={
                    saveShiftBiasaMutation.isPending ||
                    saveShiftMutation.isPending
                  }
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-semibold text-[15px] tracking-wide text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saveShiftBiasaMutation.isPending ||
                  saveShiftMutation.isPending
                    ? "Menyimpan ke Database..."
                    : "Konfirmasi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SHIFT PICKER (TIME PICKER) */}
      {showShiftModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-slate-900/80 dark:bg-black/90 backdrop-blur-md">
          <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-[40px] p-8 border border-slate-200 dark:border-white/10 animate-in zoom-in duration-200">
            <h3 className="text-center font-bold mb-6 text-sm tracking-widest uppercase text-slate-400 dark:text-slate-500">
              {modalMode === "biasa" ? "Edit Shift Default" : "Tambah Shift"}
            </h3>
            {modalMode === "tambahan" && (
              <>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {daysEnum
                    .filter((day) => activeDaysFromApi.includes(day.value))
                    .map((day) => (
                      <button
                        key={day.value}
                        onClick={() => setSelectedDay(day.value)}
                        className={`px-4 py-2 rounded-xl font-bold transition-all ${
                          selectedDay === day.value
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                </div>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-md ${selectedColor === color ? "ring-2 ring-indigo-500 scale-110" : "opacity-40"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </>
            )}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                {
                  label: "Masuk",
                  jam: selectedJam,
                  mnt: selectedMenit,
                  tJam: "jamMasuk",
                  tMnt: "menitMasuk",
                  color: "text-indigo-600 dark:text-indigo-400",
                },
                {
                  label: "Pulang",
                  jam: selectedJamPulang,
                  mnt: selectedMenitPulang,
                  tJam: "jamPulang",
                  tMnt: "menitPulang",
                  color: "text-rose-500 dark:text-rose-400",
                },
              ].map((picker, idx) => (
                <div key={idx} className="space-y-2">
                  <div
                    className={`text-xs font-black text-center uppercase ${picker.color}`}
                  >
                    {picker.label}
                  </div>
                  <div className="flex items-center justify-center h-48 overflow-hidden relative bg-slate-50 dark:bg-slate-900/60 rounded-[24px] border border-slate-200 dark:border-white/5">
                    <div className="absolute inset-x-0 h-12 border-y border-slate-200 dark:border-white/10 pointer-events-none z-20" />
                    <div
                      onScroll={(e) => handleScroll(e, picker.tJam)}
                      className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar text-center py-[72px]"
                    >
                      {jamList.map((j) => (
                        <div
                          key={j}
                          className={`h-12 flex items-center justify-center snap-center text-xl font-bold ${picker.jam === j ? "text-indigo-600 dark:text-white" : "text-slate-300 dark:text-slate-600"}`}
                        >
                          {j}
                        </div>
                      ))}
                    </div>
                    <div
                      onScroll={(e) => handleScroll(e, picker.tMnt)}
                      className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar text-center py-[72px]"
                    >
                      {menitList.map((m) => (
                        <div
                          key={m}
                          className={`h-12 flex items-center justify-center snap-center text-xl font-bold ${picker.mnt === m ? "text-indigo-600 dark:text-white" : "text-slate-300 dark:text-slate-600"}`}
                        >
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* GRID BUTTON AKSI */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowShiftModal(false)}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full font-bold text-sm active:scale-95 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmShift}
                className="flex-[2] py-4 bg-indigo-600 rounded-full font-bold text-sm text-white shadow-xl dark:shadow-indigo-500/20 active:scale-95 transition-all"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageShift;
