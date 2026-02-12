import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

const AddUser = () => {
    const queryClient = useQueryClient();
    const [form, setForm] = useState({ name: '', email: '', nip: '', password: '', role: 'karyawan' });

    const mutation = useMutation({
        mutationFn: (newUser) => axios.post('/api/users', newUser),
        onSuccess: () => {
            toast.success("Karyawan baru berhasil ditambahkan!");
            setForm({ name: '', email: '', nip: '', password: '', role: 'karyawan' });
            queryClient.invalidateQueries(['fetch-users']); // Refresh list user di ManageShift
        },
        onError: (err) => toast.error(err.response?.data?.message || "Gagal simpan")
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    return (
        <Card title="Tambah Karyawan Baru">
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4">
                <input type="text" placeholder="Nama Lengkap" className="w-full border p-2 rounded" 
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                
                <input type="text" placeholder="NIP" className="w-full border p-2 rounded" 
                    value={form.nip} onChange={e => setForm({...form, nip: e.target.value})} required />
                
                <input type="email" placeholder="Email" className="w-full border p-2 rounded" 
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                
                <input type="password" placeholder="Password" className="w-full border p-2 rounded" 
                    value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                
                <select className="w-full border p-2 rounded" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                    <option value="karyawan">Karyawan</option>
                    <option value="admin">Admin</option>
                </select>

                <Button text="Daftarkan Karyawan" className="w-full bg-indigo-600 text-white" isLoading={mutation.isPending} />
            </form>
        </Card>
    );
};

export default AddUser;