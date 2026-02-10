import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, getKantors } from "@/store/api/absensiService";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table"; // Asumsi lo punya komponen table
import Modal from "@/components/ui/Modal"; // Asumsi lo punya komponen modal
import { toast } from "react-toastify";

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "karyawan",
    kantor_id: "",
  });

  // Fetch Data
  const { data: users, isLoading } = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const { data: kantors } = useQuery({ queryKey: ["kantors"], queryFn: getKantors });

  // Mutation Create
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User berhasil ditambahkan");
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", role: "karyawan", kantor_id: "" });
    },
    onError: (err) => toast.error(err.response?.data?.message || "Gagal simpan"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Manajemen Karyawan & Admin</h3>
        <Button 
          text="Tambah User" 
          icon="ph:user-plus-bold" 
          className="btn-primary" 
          onClick={() => setIsModalOpen(true)} 
        />
      </div>

      <Card noborder>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="table-th">Nama</th>
                <th className="table-th">Email</th>
                <th className="table-th">Role</th>
                <th className="table-th">Kantor</th>
                <th className="table-th">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
              {users?.map((user) => (
                <tr key={user.id}>
                  <td className="table-td">{user.name}</td>
                  <td className="table-td">{user.email}</td>
                  <td className="table-td">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="table-td">{user.kantor?.nama || "-"}</td>
                  <td className="table-td text-right">
                     <Button icon="ph:pencil-line" className="btn-sm btn-outline-dark" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Form */}
      <Modal
        title="Tambah User Baru"
        active={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Nama Lengkap</label>
            <input 
              type="text" className="form-control" placeholder="Masukkan nama"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input 
              type="email" className="form-control" placeholder="email@kantor.com"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input 
              type="password" className="form-control" placeholder="Min. 8 karakter"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Role</label>
              <select 
                className="form-control"
                value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="karyawan">Karyawan</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="form-label">Penempatan Kantor</label>
              <select 
                className="form-control"
                value={formData.kantor_id} onChange={(e) => setFormData({...formData, kantor_id: e.target.value})}
                required={formData.role === 'karyawan'}
              >
                <option value="">Pilih Kantor</option>
                {kantors?.map(k => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button text="Simpan User" className="btn-primary w-full" type="submit" isLoading={createMutation.isPending} />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserManagement;