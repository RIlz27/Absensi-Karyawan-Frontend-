import React, { useState } from "react";
import { 
  useGetLeaderboardQuery, 
  useAdjustPointsMutation 
} from "@/store/api/point/pointApiSlice";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import { toast } from "react-toastify";

const LeaderboardAdmin = () => {
  const { data: response, isLoading, refetch } = useGetLeaderboardQuery(20);
  const users = response?.data || [];

  const [adjustPoint] = useAdjustPointsMutation();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ adjust_amount: "", reason: "" });
  const [type, setType] = useState("tambah"); // tambah, kurang

  const openModal = (user) => {
    setSelectedUser(user);
    setFormData({ adjust_amount: "", reason: "" });
    setType("tambah");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.adjust_amount || !formData.reason) {
      toast.error("Semua field harus diisi!");
      return;
    }

    try {
      let amount = parseInt(formData.adjust_amount, 10);
      if (type === "kurang") amount = -Math.abs(amount);
      if (type === "tambah") amount = Math.abs(amount);

      await adjustPoint({
        id: selectedUser.id,
        data: { adjust_amount: amount, reason: formData.reason },
      }).unwrap();
      
      toast.success("Point berhasil diupdate!");
      closeModal();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Gagal mengupdate point");
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Memuat Leaderboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          Leaderboard & Engagement
        </h4>
      </div>

      <Card title="Peringkat Karyawan (Poin Reset Otomatis di Akhir Bulan)">
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                <thead className="bg-slate-200 dark:bg-slate-700">
                  <tr>
                    <th scope="col" className="table-th text-center">Rank</th>
                    <th scope="col" className="table-th">Karyawan</th>
                    <th scope="col" className="table-th">Kantor</th>
                    <th scope="col" className="table-th text-center">Poin</th>
                    <th scope="col" className="table-th text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                  {users.map((user, index) => {
                    const isTopThree = index < 3;
                    const rankColors = ["text-yellow-500", "text-slate-400", "text-amber-600"];
                    const badgeBg = isTopThree ? "bg-indigo-50 dark:bg-indigo-900/30" : "";
                    return (
                      <tr key={user.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${badgeBg}`}>
                        <td className="table-td text-center font-bold text-lg">
                          {isTopThree ? (
                            <Icon icon="ph:medal-fill" className={`mx-auto text-2xl ${rankColors[index]}`} />
                          ) : (
                            <span className="text-slate-500">#{index + 1}</span>
                          )}
                        </td>
                        <td className="table-td">
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="flex-none">
                              <div className="h-10 w-10 rounded-full text-sm bg-[#E0EAFF] dark:bg-slate-700 flex flex-col items-center justify-center font-medium capitalize text-slate-900 dark:text-white">
                                {user.avatar ? (
                                   <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  user.name.charAt(0)
                                )}
                              </div>
                            </div>
                            <div className="flex-1 text-start">
                              <span className="text-sm text-slate-600 dark:text-slate-300 capitalize font-medium">
                                {user.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="table-td text-sm text-slate-500">
                          {user.kantor?.name || "-"}
                        </td>
                        <td className="table-td text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                            {user.points} pts
                          </span>
                        </td>
                        <td className="table-td text-center">
                          <button
                            onClick={() => openModal(user)}
                            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 p-2 rounded transition-colors"
                            title="Adjust Poin"
                          >
                            <Icon icon="ph:plus-minus-bold" className="text-lg" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="5" className="table-td text-center py-6 text-slate-500">
                        Belum ada data leaderboad.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        title="Sesuaikan Poin Karyawan"
        label="Modal"
        labelClass="btn-outline-dark"
        uncontrol
        disableBackdrop
        activeModal={isModalOpen}
        onClose={closeModal}
      >
        {selectedUser && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 mb-4">
              <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedUser.name}</p>
              <p className="text-sm text-slate-500">Poin Saat Ini: {selectedUser.points}</p>
            </div>

            <Select
              label="Tindakan"
              options={[
                { value: "tambah", label: "Tambah Poin (Bonus/Reward)" },
                { value: "kurang", label: "Kurangi Poin (Penalti/Sanksi)" },
              ]}
              value={type}
              onChange={(e) => setType(e.target.value)}
            />

            <Textinput
              label="Jumlah Poin"
              type="number"
              placeholder="Contoh: 15"
              value={formData.adjust_amount}
              onChange={(e) => setFormData({ ...formData, adjust_amount: e.target.value })}
            />

            <Textinput
              label="Alasan / Keterangan"
              type="text"
              placeholder="Contoh: Menang event lomba kantor"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button text="Batal" className="btn-light" onClick={closeModal} />
              <Button text="Simpan" className="btn-primary" type="submit" />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default LeaderboardAdmin;
