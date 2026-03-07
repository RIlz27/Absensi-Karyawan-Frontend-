import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, deleteUser, getKantors } from "@/store/api/absensiService.js";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

const EmployeeManagement = () => {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    nip: "",
    role: "karyawan",
    kantor_id: "",
  });

  // Fetch Kantors
  const { data: kantorsData } = useQuery({
    queryKey: ["fetch-kantors"],
    queryFn: getKantors,
  });
  const kantors = Array.isArray(kantorsData) ? kantorsData : [];

  // Fetch Karyawan
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["fetch-users"],
    queryFn: getUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: (data) => {
      // Data yang diterima ini diambil dari response JSON Laravel lo
      toast.success(data.message || "Karyawan berhasil dihapus!");
      setSelectedUser(null);
      queryClient.invalidateQueries(["fetch-users"]);
    },
    onError: (error) => {
      // Ini bakal nangkep 403 Forbidden dari backend lo
      const message =
        error.response?.data?.message || "Gagal menghapus karyawan";
      toast.error(message);
    },
  });

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus karyawan ini? Data yang dihapus tidak bisa dikembalikan.",
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const users = Array.isArray(usersData) ? usersData : usersData?.data || [];

  const mutation = useMutation({
    mutationFn: (newUser) => createUser(newUser),
    onSuccess: () => {
      toast.success("Karyawan berhasil didaftarkan!");
      setForm({ name: "", nip: "", role: "karyawan", kantor_id: "" });
      setShowAddForm(false);
      queryClient.invalidateQueries(["fetch-users"]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      // Jika kantor_id kosong, pakai kantor pertama yang tersedia
      kantor_id: form.kantor_id || (kantors.length > 0 ? kantors[0].id : 1),
    };

    mutation.mutate(payload);
  };

  const inputClass =
    "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-slate-100";
  const labelClass =
    "text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block ml-1";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-2 ">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Manajemen Karyawan
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total {users.length} personel terdaftar dalam sistem.
            </p>
          </div>
          <Button
            text={showAddForm ? "Batal" : "Tambah Karyawan"}
            icon={showAddForm ? "ph:x-bold" : "ph:user-plus-bold"}
            onClick={() => setShowAddForm(!showAddForm)}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
              showAddForm
                ? "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
            }`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: LIST SECTION */}
          <div className="lg:col-span-5 space-y-3 h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 italic bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                <Icon
                  icon="line-md:loading-twotone-loop"
                  className="text-3xl mb-2"
                />
                <p className="text-sm">Menarik data...</p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`group p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    selectedUser?.id === user.id
                      ? "bg-white dark:bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500"
                      : "bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
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

          {/* RIGHT: DETAIL / FORM SECTION */}
          <div className="lg:col-span-7">
            {showAddForm ? (
              <Card className="border-none shadow-xl dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-lg font-bold dark:text-white">
                    Form Karyawan Baru
                  </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div>
                    <label className={labelClass}>Nama Lengkap</label>
                    <input
                      className={inputClass}
                      placeholder="Contoh: Budi Santoso"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>NIP</label>
                      <input
                        className={inputClass}
                        placeholder="12345"
                        value={form.nip}
                        onChange={(e) =>
                          setForm({ ...form, nip: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Role Akses</label>
                      <select
                        className={inputClass}
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                      >
                        <option value="karyawan">Karyawan</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Penempatan Kantor</label>
                    <select
                      className={inputClass}
                      value={form.kantor_id}
                      onChange={(e) => setForm({ ...form, kantor_id: e.target.value })}
                      required
                    >
                      <option value="" disabled>-- Pilih Kantor --</option>
                      {kantors.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    type="submit"
                    text={
                      mutation.isPending ? "Memproses..." : "Daftarkan Sekarang"
                    }
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
                    disabled={mutation.isPending}
                  />
                </form>
              </Card>
            ) : selectedUser ? (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-300">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-viol et-500 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-500/40 mb-4 ring-4 ring-white dark:ring-slate-800">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                      {selectedUser.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-slate-400 italic">
                        ID: {selectedUser.nip}
                      </span>
                      <button
                        onClick={() => handleDelete(selectedUser.id)}
                        disabled={deleteMutation.isPending}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all border border-transparent hover:border-rose-100"
                        title="Hapus Karyawan"
                      >
                        {deleteMutation.isPending ? (
                          <Icon
                            icon="line-md:loading-twotone-loop"
                            className="text-xl"
                          />
                        ) : (
                          <Icon icon="ph:trash-bold" className="text-xl" />
                        )}
                      </button>
                      <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                      <span className="text-xs font-bold text-indigo-500 uppercase">
                        {selectedUser.role}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* DETAIL KANTOR */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon
                          icon="ph:buildings-bold"
                          className="text-amber-500 text-lg"
                        />
                        <span className={labelClass}>Penempatan Kantor</span>
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {selectedUser.kantor?.nama || "Tidak ada data"}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed italic">
                        {selectedUser.kantor?.alamat ||
                          "Alamat belum ditambahkan."}
                      </p>
                    </div>

                    {/* DETAIL SHIFT */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon
                          icon="ph:clock-bold"
                          className="text-indigo-500 text-lg"
                        />
                        <span className={labelClass}>Jadwal Kerja</span>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedUser?.shifts &&
                        selectedUser.shifts.length > 0 ? (
                          Array.from(
                            new Map(
                              selectedUser.shifts.map((s) => [s.id, s]),
                            ).values(),
                          ).map((s) => (
                            <div
                              key={s.id}
                              className="flex items-center justify-between bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{
                                    backgroundColor: s.color || "#6366f1",
                                  }}
                                />
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                  {s.day}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-medium text-slate-500">
                                {s.jam_masuk} - {s.jam_pulang}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-slate-400 italic py-2">
                            Jadwal belum dikonfigurasi.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white/30 dark:bg-slate-900/30 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Icon
                  icon="ph:user-focus-duotone"
                  className="text-6xl mb-4 opacity-20"
                />
                <p className="text-sm font-medium uppercase tracking-[3px]">
                  Pilih Karyawan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
