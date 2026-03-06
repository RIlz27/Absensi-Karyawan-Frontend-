import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

const Laporan = () => {
    const [filter, setFilter] = useState({ start_date: '', end_date: '', kantor_id: '' });

    const { data: reports, isLoading, refetch } = useQuery({
        queryKey: ['laporan', filter],
        queryFn: () => axios.get('/api/laporan-absensi', { params: filter }).then(res => res.data)
    });

    const { data: kantors } = useQuery({ 
        queryKey: ['fetch-kantors'], 
        queryFn: () => axios.get('/api/fetch-kantors').then(res => res.data) 
    });

    return (
        <div className="space-y-5">
            <Card title="Filter Laporan Absensi">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                    <input type="date" className="form-control border p-2 rounded" 
                        onChange={(e) => setFilter({...filter, start_date: e.target.value})} />
                    <input type="date" className="form-control border p-2 rounded" 
                        onChange={(e) => setFilter({...filter, end_date: e.target.value})} />
                    <select className="form-control border p-2 rounded" 
                        onChange={(e) => setFilter({...filter, kantor_id: e.target.value})}>
                        <option value="">Semua Kantor</option>
                        {kantors?.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                    </select>
                    <Button text="Cari" className="btn-primary w-full" onClick={() => refetch()} />
                </div>
            </Card>

            <Card title="Data Absensi Karyawan">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th className="table-th">Nama / NIP</th>
                                <th className="table-th">Tanggal</th>
                                <th className="table-th">Jam Masuk</th>
                                <th className="table-th">Jam Pulang</th>
                                <th className="table-th">Kantor</th>
                                <th className="table-th">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                            {reports?.map((row) => (
                                <tr key={row.id}>
                                    <td className="table-td">
                                        <div className="font-semibold">{row.user.name}</div>
                                        <div className="text-xs text-slate-500">{row.user.nip}</div>
                                    </td>
                                    <td className="table-td">{row.tanggal}</td>
                                    <td className="table-td">{row.jam_masuk ?? '--:--'}</td>
                                    <td className="table-td">{row.jam_pulang ?? '--:--'}</td>
                                    <td className="table-td">{row.kantor.nama}</td>
                                    <td className="table-td text-center">
                                        <span className={`px-2 py-1 rounded text-[10px] text-white ${row.jam_masuk ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {row.jam_masuk ? 'Hadir' : 'Alpha'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Laporan;