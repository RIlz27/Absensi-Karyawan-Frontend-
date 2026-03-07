import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";
import axios from "axios";
import { toast } from "react-toastify";

// image import
import Logo from "@/assets/images/logo/logo-c.svg";

const login = () => {
  const [isDark] = useDarkMode();
  const [isResetting, setIsResetting] = useState(false);

  const handleResetData = async () => {
    if (window.confirm("Apakah kamu yakin ingin menghapus SEMUA data (Karyawan, Kantor, Shift) untuk mengulang Setup awal? Aksi ini tidak dapat dibatalkan!")) {
      setIsResetting(true);
      try {
        const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
        await axios.post(`${API_BASE}/initial-setup/reset`, {}, {
          headers: { "ngrok-skip-browser-warning": "69420" }
        });
        toast.success("Semua data berhasil direset!");
        window.location.reload(); // Reload supaya sistem kembali menampilkan halaman /setup
      } catch (error) {
        toast.error(error.response?.data?.message || "Gagal mereset data");
        setIsResetting(false);
      }
    }
  };

  return (
    <>
      <div className="h-full grid w-full grow grid-cols-1 place-items-center pt-10 2xl:pt-0 ">
        <div className=" max-w-[416px] mx-auto w-full  space-y-6">
          <div className="text-center">
            <div className="h-[72px] w-[72px] mx-auto">
              <Link to="/">
                <img
                  src={Logo}
                  alt=""
                  className=" object-contain object-center h-full"
                />
              </Link>
            </div>
            <div className=" text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-1 mt-5">
              Welcome Back
            </div>
            <div className=" text-gray-500 dark:text-gray-400 text-sm">
              Please sign in to continue
            </div>
          </div>
          <div className="p-6 auth-box">
            {/* Logic utama ada di dalam sini bro */}
            <LoginForm />
            
            <div className=" text-center text-sm mt-5 space-x-1 rtl:space-x-reverse mb-1   ">
              <span> Don't have Account?</span>
              <span>
                <Link to="/register" className=" text-indigo-500">
                  Create account
                </Link>
              </span>
            </div>
            <div className="relative border-b-gray-10 dark:border-gray-700  border-b pt-6">
              <div className="absolute inline-block bg-white dark:bg-gray-800 text-gray-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm  font-normal">
                OR
              </div>
            </div>
            <div className="mt-6">
              <Social />
            </div>

            {/* Tombol Restart Data / Hapus */}
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                type="button"
                onClick={handleResetData}
                disabled={isResetting}
                className="btn btn-danger block w-full text-center"
              >
                {isResetting ? "Mereset Data..." : "Restart Data (Hapus Semua)"}
              </button>
            </div>
          </div>
          <div className="mt-8 flex justify-center text-xs text-gray-400  pb-10 2xl:pb-0">
            <a href="#">Privacy Notice</a>
            <div className="mx-3 my-1 w-px bg-gray-200 "></div>
            <a href="#">Term of service</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;