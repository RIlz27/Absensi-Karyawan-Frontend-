import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, deleteUser, updateUserRole, getKantors, updateUser } from "@/store/api/absensi-service.js";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";

export default function AddUser() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    nip: "",
    role: "karyawan",
    kantor_id: "",
  });

  // Queries
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["fetch-users"],
    queryFn: getUsers,
  });

  const { data: kantors = [], isLoading: isLoadingKantors } = useQuery({
    queryKey: ["fetch-kantors"],
    queryFn: getKantors,
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: (newUser) => createUser(newUser),
    onSuccess: () => {
      toast.success("Karyawan berhasil didaftarkan!");
      setForm({ name: "", nip: "", role: "karyawan", kantor_id: "" });
      setShowAddForm(false);
      queryClient.invalidateQueries(["fetch-users"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal mendaftarkan karyawan");
    }
  });

  const roleUpdateMutation = useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: (data) => {
      toast.success(data.message || "Role berhasil diubah!");
      queryClient.invalidateQueries(["fetch-users"]);
      if (selectedUser) {
        setSelectedUser({ ...selectedUser, role: data.user?.role || selectedUser.role });
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal mengubah role");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      toast.success("Karyawan berhasil dihapus");
      setSelectedUser(null);
      queryClient.invalidateQueries(["fetch-users"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal menghapus karyawan");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (res) => {
      toast.success(res.message || "Penempatan berhasil diubah!");
      queryClient.invalidateQueries(["fetch-users"]);
      if (selectedUser) {
        setSelectedUser({ ...selectedUser, ...res.user });
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal mengubah penempatan");
    }
  });

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.nip || !form.kantor_id) {
      toast.error("Harap isi nama, NIP, dan kantor!");
      return;
    }
    mutation.mutate(form);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus karyawan ini?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    if (window.confirm(`Yakin ingin mengubah role karyawan menjadi ${newRole.toUpperCase()}?`)) {
      roleUpdateMutation.mutate({ id: userId, role: newRole });
    }
  };

  const handleKantorChange = (userId, newKantorId) => {
    if (window.confirm("Yakin ingin mengubah penempatan kantor karyawan ini?")) {
      updateMutation.mutate({ id: userId, data: { kantor_id: newKantorId } });
    }
  };

  // Helper styles
  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-slate-500 outline-none focus:ring-2 ring-indigo-500/40 transition-all appearance-none";
  const labelClass = "text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 block";

  // Helpers
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };
  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const baseUrl = API_BASE.replace("/api", "");
    return `${baseUrl}/storage/${path}`;
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] p-4 lg:p-8 pb-[100px] relative overflow-hidden font-inter">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/20 px-3 py-1.5 rounded-full mb-3">
              <Icon icon="ph:users-three-bold" className="text-indigo-400" />
              <span className="text-[12px] text-indigo-300 font-semibold tracking-wide">HR Management</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Kelola <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Karyawan</span></h1>
            <p className="text-slate-400 text-sm mt-1">Daftarkan dan atur hak akses pengguna sistem.</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setSelectedUser(null);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 w-fit"
          >
            {showAddForm ? (
              <>
                <Icon icon="ph:x-bold" className="text-lg" /> Batal Tambah
              </>
            ) : (
              <>
                <Icon icon="ph:user-plus-bold" className="text-lg" /> Tambah Karyawan
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SIDE: LIST OR DETAILS */}
          <div className="space-y-6 lg:col-span-12">
            
            {/* USER DETAIL VIEW */}
            <AnimatePresence>
              {selectedUser && !showAddForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="bg-[#111827] border border-white/[0.07] rounded-[32px] p-6 shadow-2xl relative overflow-hidden"
                >
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 transition-colors"
                  >
                    <Icon icon="ph:x-bold" />
                  </button>

                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-24 h-24 rounded-full border-4 border-[#1e293b] overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-xl shadow-black/50">
                      {selectedUser.avatar ? (
                        <img src={getAvatarUrl(selectedUser.avatar)} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-black text-white">{getInitials(selectedUser.name)}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-white capitalize">{selectedUser.name}</h2>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 mb-4">
                        <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-slate-300">NIP: {selectedUser.nip}</span>
                        <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs flex items-center gap-1 text-slate-300">
                           <Icon icon="ph:buildings" /> {selectedUser.kantor?.nama || "Tanpa Kantor"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 bg-white/5 p-2 rounded-2xl border border-white/5 w-fit">
                        <select
                          className={`text-[11px] font-bold uppercase tracking-wider rounded-xl px-3 py-1.5 outline-none cursor-pointer border-none appearance-none pr-8 bg-no-repeat bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill text-white" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>')] bg-[length:10px_10px] bg-[position:right_8px_center] transition-colors ${
                            selectedUser.role === "admin"
                              ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                              : selectedUser.role === "manager"
                              ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                              : "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                          }`}
                          value={selectedUser.role}
                          onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
                          disabled={roleUpdateMutation.isPending}
                        >
                          <option value="karyawan" className="text-slate-800 bg-white">KARYAWAN</option>
                          <option value="manager" className="text-slate-800 bg-white">MANAGER</option>
                          <option value="admin" className="text-slate-800 bg-white">ADMIN</option>
                        </select>
                        
                        <div className="w-px h-6 bg-white/10 mx-1"></div>

                        <select
                          className={`text-[11px] font-bold uppercase tracking-wider rounded-xl px-3 py-1.5 outline-none cursor-pointer border-none appearance-none pr-8 bg-no-repeat bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill text-white" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>')] bg-[length:10px_10px] bg-[position:right_8px_center] transition-colors bg-teal-500/20 text-teal-400 hover:bg-teal-500/30`}
                          value={selectedUser.kantor_id || ""}
                          onChange={(e) => handleKantorChange(selectedUser.id, e.target.value)}
                          disabled={updateMutation.isPending}
                        >
                          <option value="" className="text-slate-800 bg-white" disabled>TANPA KANTOR</option>
                          {kantors.map((k) => (
                            <option key={k.id} value={k.id} className="text-slate-800 bg-white">{k.nama}</option>
                          ))}
                        </select>

                        <div className="w-px h-6 bg-white/10 mx-1"></div>

                        <button
                          onClick={() => handleDelete(selectedUser.id)}
                          disabled={deleteMutation.isPending}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          {deleteMutation.isPending ? <Icon icon="line-md:loading-loop" /> : <Icon icon="ph:trash-bold" />} Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* USER GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {isLoadingUsers ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-44 bg-white/5 border border-white/5 rounded-[24px] animate-pulse"></div>
                ))
              ) : users.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500">Belum ada karyawan terdaftar.</div>
              ) : (
                users.map((user) => (
                  <motion.div
                    layout
                    key={user.id}
                    onClick={() => {
                      if (!showAddForm) setSelectedUser(user);
                    }}
                    className={`bg-[#0f1523] border border-white/[0.07] rounded-[24px] p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 hover:border-indigo-500/30 ${selectedUser?.id === user.id ? 'ring-2 ring-indigo-500/50' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={getAvatarUrl(user.avatar)} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-black text-slate-400">{getInitials(user.name)}</span>
                        )}
                      </div>
                      <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500'}`}></div>
                    </div>
                    
                    <h3 className="text-base font-bold text-white capitalize truncate">{user.name}</h3>
                    <p className="text-xs font-mono text-slate-500 mt-1">{user.nip}</p>
                    
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                         user.role === 'admin' ? 'bg-rose-500/20 text-rose-400' 
                         : user.role === 'manager' ? 'bg-amber-500/20 text-amber-400' 
                         : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

          </div>

          {/* RIGHT SIDE: ADD FORM */}
          <Modal
            activeModal={showAddForm}
            onClose={() => setShowAddForm(false)}
            centered
            isBlur
            className="max-w-md !bg-[#111827] !border !border-white/[0.07] !rounded-[32px] !p-0 overflow-hidden"
          >
            <div className="p-6 sm:p-8">
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-white">Form Registrasi</h2>
                  <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white p-1">
                    <Icon icon="ph:x-bold" className="text-xl" />
                  </button>
                </div>
                <p className="text-slate-400 text-sm mt-1">Tambahkan akun pengguna baru</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className={labelClass}>Nama Lengkap</label>
                      <input
                        className={inputClass}
                        placeholder="Nama Karyawan"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={labelClass}>Login ID (NIP)</label>
                      <input
                        className={inputClass}
                        placeholder="Nomor Induk Pegawai"
                        value={form.nip}
                        onChange={(e) => setForm({ ...form, nip: e.target.value })}
                        required
                      />
                      <p className="text-[10px] text-slate-500 mt-1 italic">*NIP akan digunakan sebagai password awal.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Role Akses</label>
                        <select
                          className={inputClass + " pr-10"}
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          required
                        >
                          <option className="text-slate-800 bg-white" value="karyawan">Karyawan</option>
                          <option className="text-slate-800 bg-white" value="manager">Manager</option>
                          <option className="text-slate-800 bg-white" value="admin">Admin</option>
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>Penempatan</label>
                        <select
                          className={inputClass + " pr-10"}
                          value={form.kantor_id}
                          onChange={(e) => setForm({ ...form, kantor_id: e.target.value })}
                          required
                        >
                          <option className="text-slate-800 bg-white" value="" disabled>Pilih Kantor</option>
                          {kantors.map((k) => (
                            <option className="text-slate-800 bg-white" key={k.id} value={k.id}>
                              {k.nama}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={mutation.isPending || isLoadingKantors}
                      className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 rounded-2xl font-bold text-[15px] text-white transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
                    >
                      {mutation.isPending ? (
                        <>
                          <Icon icon="line-md:loading-loop" className="text-xl animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Icon icon="ph:user-plus-bold" className="text-lg" />
                          Daftarkan Akun
                        </>
                      )}
                    </button>
                  </form>
            </div>
          </Modal>

        </div>
      </div>
    </div>
  );
}
