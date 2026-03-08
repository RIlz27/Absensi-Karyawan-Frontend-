import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useGetAdminCalendarDataQuery, useAddBypassMutation } from "@/store/api/calendar/calendarApiSlice";
import { useQuery } from "@tanstack/react-query";
import API from "@/store/api/absensiService.js";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { toast } from "react-toastify";

const AdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Format MM and YYYY for API
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();

  const { data: events, isLoading, refetch } = useGetAdminCalendarDataQuery({ month, year });
  const [addBypass, { isLoading: isBypassLoading }] = useAddBypassMutation();

  // Fetch users and shifts for the form
  const { data: usersData } = useQuery({
    queryKey: ["fetch-users"],
    queryFn: async () => {
      const res = await API.getUsers();
      return Array.isArray(res) ? res : res?.data || [];
    },
  });

  const { data: shiftsData } = useQuery({
    queryKey: ["fetch-shifts"],
    queryFn: async () => {
      const { data } = await API.get("/shifts");
      return data || [];
    },
  });

  // Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState("");
  
  const [formData, setFormData] = useState({
    user_id: "",
    shift_id: "",
    status: "Hadir",
    jam_masuk: "",
    jam_pulang: "",
  });

  const handleDatesSet = (dateInfo) => {
    const midDate = new Date((dateInfo.start.getTime() + dateInfo.end.getTime()) / 2);
    if (midDate.getMonth() !== currentDate.getMonth() || midDate.getFullYear() !== currentDate.getFullYear()) {
      setCurrentDate(midDate);
    }
  };

  const handleDateClick = (info) => {
    setSelectedDateStr(info.dateStr); // "YYYY-MM-DD"
    setFormData({
      user_id: "",
      shift_id: "",
      status: "Hadir",
      jam_masuk: "08:00",
      jam_pulang: "17:00",
    });
    setIsPanelOpen(true);
  };

  const handleEventClick = (info) => {
    // Also open panel to show event details, but setting dates
    const dateStr = info.event.startStr.split("T")[0];
    setSelectedDateStr(dateStr);
    setFormData({
      ...formData,
      status: info.event.extendedProps.status,
      // Pre-fill user if we can find it, otherwise rely on the visual event data
    });
    // For now, simply opening the panel is enough as the primary action is injection.
    setIsPanelOpen(true);
  };

  const handleBypassSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user_id || !formData.shift_id || !formData.status) {
      toast.error("User, Shift, dan Status wajib diisi!");
      return;
    }

    try {
      await addBypass({
        ...formData,
        tanggal: selectedDateStr,
      }).unwrap();

      toast.success("Bypass berhasil diinjeksi!");
      setIsPanelOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Gagal melakukan bypass!");
    }
  };

  return (
    <div className="space-y-6 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          Visual Monitoring & Bypass
        </h4>
        {/* Manager Mode Visual Indicator */}
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 shadow-sm">
          <Icon icon="ph:shield-star-bold" className="text-sm" />
          Manager Privilege Active
        </span>
      </div>

      <Card>
        <div className="zera-calendar-wrapper">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 z-10 flex items-center justify-center rounded-md backdrop-blur-sm">
               <span className="text-slate-500 font-semibold flex items-center gap-2">
                 <Icon icon="ph:spinner-gap-bold" className="animate-spin text-xl text-indigo-500" /> 
                 Memuat Data Absensi...
               </span>
            </div>
          )}
          
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "title",
              center: "",
              right: "prev,next today",
            }}
            events={events || []}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            datesSet={handleDatesSet}
            height="auto"
            dayMaxEvents={3}
            eventContent={(arg) => {
              return (
                <div className={`text-[11px] font-medium px-2 py-0.5 flex items-center gap-1.5 rounded border-l-[3px] shadow-sm truncate backdrop-blur-md transition-all ${arg.event.classNames.join(" ")}`} style={{
                  borderLeftColor: 'rgba(255,255,255,0.7)',
                  backgroundColor: arg.event.backgroundColor + 'E6', // 90% opacity
                  color: '#fff',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  borderRight: '1px solid rgba(255,255,255,0.1)',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div className="w-1 h-1 rounded-full bg-white flex-shrink-0 opacity-80"></div>
                  <span className="truncate tracking-wide">{arg.event.title}</span>
                </div>
              );
            }}
          />
        </div>
      </Card>

      {/* Tailwind specific overrides for FullCalendar within dark mode */}
      <style dangerouslySetInnerHTML={{__html: `
        .dark .zera-calendar-wrapper {
          --fc-border-color: #334155; 
          --fc-page-bg-color: #0f172a;
          --fc-neutral-bg-color: #1e293b;
          --fc-neutral-text-color: #cbd5e1;
          --fc-today-bg-color: rgba(99, 102, 241, 0.1); 
        }
        .zera-calendar-wrapper .fc-theme-standard td, 
        .zera-calendar-wrapper .fc-theme-standard th, 
        .zera-calendar-wrapper .fc-theme-standard .fc-scrollgrid {
          border-color: var(--fc-border-color, #e2e8f0);
        }
        .dark .zera-calendar-wrapper .fc-daygrid-day-number {
          color: #f8fafc;
        }
        .dark .zera-calendar-wrapper .fc-col-header-cell-cushion {
          color: #94a3b8;
        }
        .zera-calendar-wrapper .fc-button-primary {
          background-color: #6366f1 !important;
          border-color: #6366f1 !important;
          font-weight: 600;
          text-transform: capitalize;
          border-radius: 8px;
        }
        .zera-calendar-wrapper .fc-button-primary:hover {
          background-color: #4f46e5 !important;
          border-color: #4f46e5 !important;
        }
        .zera-calendar-wrapper .fc-button-primary:not(:disabled):active,
        .zera-calendar-wrapper .fc-button-primary:not(:disabled).fc-button-active {
          background-color: #4338ca !important;
          border-color: #4338ca !important;
        }
        .zera-calendar-wrapper .fc-daygrid-day:hover {
          background-color: rgba(99, 102, 241, 0.05); /* Subtle hover effect on days */
          cursor: pointer;
        }
      `}} />

      {/* Side-Panel (Glassmorphism Slide-over) */}
      <div 
        className={`fixed inset-0 z-[1000] bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isPanelOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsPanelOpen(false)}
      >
        <div 
          className={`absolute inset-y-0 right-0 max-w-md w-full bg-white dark:bg-[#0f172a] shadow-2xl border-l border-slate-200 dark:border-white/10 transform transition-transform duration-300 ease-in-out flex flex-col ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Panel Header */}
          <div className="px-6 py-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-md">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Icon icon="ph:siren-bold" className="text-indigo-600 dark:text-indigo-400" />
                Emergency Bypass
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tanggal: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedDateStr}</span>
              </p>
            </div>
            <button 
              onClick={() => setIsPanelOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 transition-colors"
            >
              <Icon icon="ph:x-bold" />
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 mb-6">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium flex items-start gap-2">
                <Icon icon="ph:warning-circle-bold" className="text-lg shrink-0" />
                <span>
                  Bypass record akan dicatat dengan metode "Bypass (Manual)". Perubahan "Hadir", "Terlambat", dan "Alfa" akan langsung mempengaruhi Point Sistem karyawan.
                </span>
              </p>
            </div>

            <form id="bypassForm" onSubmit={handleBypassSubmit} className="space-y-5">
              
              {/* User Selection */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pilih Karyawan</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.user_id}
                  onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                  required
                >
                  <option value="" disabled>-- Pilih Karyawan --</option>
                  {usersData?.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.nip})</option>
                  ))}
                </select>
              </div>

              {/* Shift Selection */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pilih Shift</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.shift_id}
                  onChange={(e) => setFormData({...formData, shift_id: e.target.value})}
                  required
                >
                  <option value="" disabled>-- Pilih Shift Tujuan --</option>
                  {shiftsData?.map(s => (
                    <option key={s.id} value={s.id}>{s.nama} ({s.jam_masuk?.substring(0,5)} - {s.jam_pulang?.substring(0,5)})</option>
                  ))}
                </select>
              </div>

              {/* Status Selection */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status Absensi</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="Hadir">Hadir (+10 Point)</option>
                  <option value="Terlambat">Terlambat (-5 Point)</option>
                  <option value="Izin">Izin (0 Point)</option>
                  <option value="Sakit">Sakit (0 Point)</option>
                  <option value="Alfa">Alfa (-20 Point)</option>
                </select>
              </div>

              {/* Jam Masuk/Pulang for Hadir/Terlambat */}
              {(formData.status === 'Hadir' || formData.status === 'Terlambat') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Jam Masuk</label>
                    <input 
                      type="time" 
                      className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.jam_masuk}
                      onChange={(e) => setFormData({...formData, jam_masuk: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Jam Pulang</label>
                    <input 
                      type="time" 
                      className="w-full bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.jam_pulang}
                      onChange={(e) => setFormData({...formData, jam_pulang: e.target.value})}
                    />
                  </div>
                </div>
              )}

            </form>
          </div>

          {/* Panel Footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0f172a] flex items-center gap-3">
            <button
              onClick={() => setIsPanelOpen(false)}
              className="flex-1 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
            >
              Batal
            </button>
            <button
              form="bypassForm"
              type="submit"
              disabled={isBypassLoading}
              className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 border border-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
            >
              {isBypassLoading ? (
                <Icon icon="ph:spinner-gap-bold" className="animate-spin text-lg" />
              ) : (
                <>
                  <Icon icon="ph:paper-plane-right-fill" className="text-lg" />
                  Injeksi Data
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminCalendar;
