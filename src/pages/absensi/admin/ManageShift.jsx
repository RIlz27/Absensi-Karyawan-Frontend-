import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Card from "@/components/ui/Card";
import { Icon } from "@iconify/react"; // Pastikan lo install @iconify/react

const ManageShift = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        user_id: '',
        shift_id: '',
        kantor_id: '',
        hari: 'Monday',
        copy_all_week: false
    });

    // 1. Fetch Data untuk Dropdown
    const { data: users, isLoading: loadUser } = useQuery({ 
        queryKey: ['fetch-users'], 
        queryFn: () => axios.get('/api/fetch-users').then(res => res.data) 
    });
    const { data: shifts, isLoading: loadShift } = useQuery({ 
        queryKey: ['fetch-shifts'], 
        queryFn: () => axios.get('/api/fetch-shifts').then(res => res.data) 
    });
    const { data: kantors, isLoading: loadKantor } = useQuery({ 
        queryKey: ['fetch-kantors'], 
        queryFn: () => axios.get('/api/fetch-kantors').then(res => res.data) 
    });

    // 2. Fetch Data List Jadwal untuk Tabel
    const { data: listJadwal, isLoading: loadList } = useQuery({ 
        queryKey: ['user-shifts'], 
        queryFn: () => axios.get('/api/user-shifts').then(res => res.data) 
    });

    // 3. Mutation untuk Simpan Jadwal
    const mutation = useMutation({
        mutationFn: (data) => axios.post('/api/user-shifts', data),
        onSuccess: (res) => {
            alert(res.data.message);
            setFormData(prev => ({ ...prev, user_id: '' }));
            queryClient.invalidateQueries(['user-shifts']);
        },
        onError: (err) => {
            alert(err.response?.data?.message || "Gagal menyimpan jadwal");
        }
    });

    // 4. Mutation untuk Hapus Jadwal
    const deleteMutation = useMutation({
        mutationFn: (id) => axios.delete(`/api/user-shifts/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['user-shifts']);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!formData.user_id || !formData.shift_id || !formData.kantor_id) {
            return alert("Lengkapi semua pilihan bro!");
        }
        mutation.mutate(formData);
    };

    const isDataLoading = loadUser || loadShift || loadKantor;

    return (
        <div className="space-y-6">
            <Card title="Management - Plotting Jadwal Karyawan">
                {isDataLoading ? (
                    <div className="p-10 text-center text-slate-500">Memuat data pilihan...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 p-4">
                        {/* Select User */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700">Pilih Karyawan</label>
                            <select 
                                className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.user_id}
                                onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                                required
                            >
                                <option value="">-- Pilih User --</option>
                                {users?.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} (NIP: {u.nip})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Select Shift */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Pilih Shift</label>
                                <select 
                                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.shift_id}
                                    onChange={(e) => setFormData({...formData, shift_id: e.target.value})}
                                    required
                                >
                                    <option value="">-- Pilih Shift --</option>
                                    {shifts?.map(s => (
                                        <option key={s.id} value={s.id}>{s.nama} ({s.jam_masuk.substring(0,5)})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Select Kantor */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-700">Lokasi Kantor</label>
                                <select 
                                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.kantor_id}
                                    onChange={(e) => setFormData({...formData, kantor_id: e.target.value})}
                                    required
                                >
                                    <option value="">-- Pilih Kantor --</option>
                                    {kantors?.map(k => (
                                        <option key={k.id} value={k.id}>{k.nama}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {!formData.copy_all_week && (
                            <div className="animate-in fade-in duration-300">
                                <label className="block text-sm font-medium mb-1 text-slate-700">Pilih Hari</label>
                                <select 
                                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.hari}
                                    onChange={(e) => setFormData({...formData, hari: e.target.value})}
                                >
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100 mt-2 hover:bg-indigo-100 transition-all">
                            <input 
                                type="checkbox" 
                                id="copy_all"
                                className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
                                checked={formData.copy_all_week}
                                onChange={(e) => setFormData({...formData, copy_all_week: e.target.checked})}
                            />
                            <label htmlFor="copy_all" className="text-sm font-semibold text-indigo-800 cursor-pointer select-none">
                                Terapkan Jadwal Senin - Jumat
                            </label>
                        </div>

                        <button 
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:bg-slate-300 mt-4"
                        >
                            {mutation.isPending ? 'Menyimpan...' : 'Simpan Jadwal'}
                        </button>
                    </form>
                )}
            </Card>

            {/* TABEL LIST JADWAL */}
            <Card title="Daftar Plotting Jadwal Aktif">
                <div className="overflow-x-auto p-4">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 text-slate-600 font-semibold">Karyawan</th>
                                <th className="p-4 text-slate-600 font-semibold">Hari</th>
                                <th className="p-4 text-slate-600 font-semibold">Shift</th>
                                <th className="p-4 text-slate-600 font-semibold">Kantor</th>
                                <th className="p-4 text-slate-600 font-semibold text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadList ? (
                                <tr><td colSpan="5" className="p-10 text-center">Loading list jadwal...</td></tr>
                            ) : listJadwal?.length === 0 ? (
                                <tr><td colSpan="5" className="p-10 text-center text-slate-400">Belum ada plotting jadwal.</td></tr>
                            ) : (
                                listJadwal?.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{item.user?.name}</div>
                                            <div className="text-xs text-slate-500">NIP: {item.user?.nip}</div>
                                        </td>
                                        <td className="p-4 font-medium text-indigo-600">{item.hari}</td>
                                        <td className="p-4">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs font-semibold">
                                                {item.shift?.nama} ({item.shift?.jam_masuk?.substring(0,5)})
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600">{item.kantor?.nama}</td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => confirm('Hapus jadwal ini?') && deleteMutation.mutate(item.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus Jadwal"
                                            >
                                                <Icon icon="heroicons:trash" className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ManageShift;