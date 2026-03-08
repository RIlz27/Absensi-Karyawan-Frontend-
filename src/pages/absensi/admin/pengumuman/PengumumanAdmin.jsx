import React, { useState } from "react";
import { 
  useGetPengumumanAdminQuery, 
  useCreatePengumumanMutation, 
  useUpdatePengumumanMutation, 
  useDeletePengumumanMutation 
} from "@/store/api/pengumuman/pengumumanApiSlice";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const PengumumanAdmin = () => {
  const { data: pengumumans, isLoading, refetch } = useGetPengumumanAdminQuery();
  const [createPengumuman, { isLoading: isCreating }] = useCreatePengumumanMutation();
  const [updatePengumuman, { isLoading: isUpdating }] = useUpdatePengumumanMutation();
  const [deletePengumuman] = useDeletePengumumanMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    content: "",
    category: "Info",
    is_active: true
  });

  const categoryOptions = [
    { value: "Info", label: "Info" },
    { value: "Urgent", label: "Urgent (Push Notif)" },
    { value: "Event", label: "Event" }
  ];

  const handleOpenModal = (pengumuman = null) => {
    if (pengumuman) {
      setEditMode(true);
      setFormData({
        id: pengumuman.id,
        title: pengumuman.title,
        content: pengumuman.content,
        category: pengumuman.category,
        is_active: pengumuman.is_active === 1 || pengumuman.is_active === true
      });
    } else {
      setEditMode(false);
      setFormData({ id: null, title: "", content: "", category: "Info", is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setFormData({ id: null, title: "", content: "", category: "Info", is_active: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Judul dan Konten wajib diisi");
      return;
    }

    try {
      if (editMode) {
        await updatePengumuman(formData).unwrap();
        toast.success("Pengumuman berhasil diupdate");
      } else {
        await createPengumuman(formData).unwrap();
        toast.success("Pengumuman berhasil dibuat");
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus pengumuman ini?")) {
      try {
        await deletePengumuman(id).unwrap();
        toast.success("Pengumuman dihapus");
        refetch();
      } catch (err) {
         toast.error("Gagal menghapus pengumuman");
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-slate-900 dark:text-white text-xl font-bold">Zera Bulletin Board</h4>
        <Button 
          icon="heroicons-outline:plus" 
          text="Buat Pengumuman" 
          className="btn-primary" 
          onClick={() => handleOpenModal()} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-12 text-center py-10 text-slate-500">Memuat data...</div>
        ) : pengumumans?.length > 0 ? (
          pengumumans.map((item) => (
            <Card key={item.id} className="relative overflow-hidden group">
              {/* Category Badge */}
              <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg z-10 
                ${item.category === 'Urgent' ? 'bg-red-500' : item.category === 'Event' ? 'bg-indigo-500' : 'bg-slate-500'}`}
              >
                {item.category}
              </div>

              {/* Status Badge */}
               <div className={`absolute top-0 left-0 w-1 h-full z-10 ${item.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>

              <div className="pt-2">
                <h5 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 pr-16">{item.title}</h5>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">{item.content}</p>
                
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4 mt-auto">
                    <span className="flex items-center gap-1">
                        <Icon icon="heroicons-outline:clock" />
                        {dayjs(item.created_at).format("DD MMM YYYY")}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-500">
                        {item.creator?.name || 'Admin'}
                    </span>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="bg-white text-indigo-600 p-2 border border-white hover:bg-indigo-600 hover:text-white rounded-full shadow-lg transition-colors"
                    >
                      <Icon icon="heroicons-outline:pencil" className="w-5 h-5"/>
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="bg-white text-red-600 p-2 border border-white hover:bg-red-600 hover:text-white rounded-full shadow-lg transition-colors"
                    >
                      <Icon icon="heroicons-outline:trash" className="w-5 h-5"/>
                    </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-12 text-center py-10">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="heroicons-outline:megaphone" className="text-3xl text-slate-400" />
            </div>
            <p className="text-slate-500">Belum ada pengumuman.</p>
          </div>
        )}
      </div>

      <Modal
        title={editMode ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
        labelclassName="btn-outline-dark"
        activeModal={isModalOpen}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textinput
            name="title"
            label="Judul"
            placeholder="Masukkan Judul Pengumuman"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Select
            label="Kategori"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <div className="input-area">
            <label className="form-label">Isi Pengumuman</label>
            <textarea
              className="form-control"
              rows={5}
              placeholder="Tulis pesan lengkap di sini..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            ></textarea>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <input 
              type="checkbox" 
              checked={formData.is_active} 
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              id="isActiveCheck"
              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isActiveCheck" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Pengumuman Aktif
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button text="Batal" className="btn-light" onClick={handleCloseModal} />
            <Button 
                type="submit" 
                text={editMode ? "Update" : "Simpan \& Publish"} 
                className="btn-primary" 
                isLoading={isCreating || isUpdating} 
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PengumumanAdmin;
