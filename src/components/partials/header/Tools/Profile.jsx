import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { Menu } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/store/api/auth/authSlice";
import clsx from "clsx";
import UserAvatar from "@/assets/images/avatar/avatar.jpg";

// Helper to get full avatar URL
const getAvatarUrl = (path) => {
  if (!path) return UserAvatar;
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:8000";
  return `${baseUrl}/storage/${path}`;
};

const ProfileLabel = ({ sticky, user }) => {
  return (
    <div className="flex items-center">
      <div
        className={clsx("rounded-full transition-all duration-300", {
          "h-9 w-9": sticky,
          "lg:h-12 lg:w-12 h-7 w-7": !sticky,
        })}
      >
        <img
          src={getAvatarUrl(user?.avatar)}
          alt="Profile"
          className="block w-full h-full object-cover rounded-full ring-1 ring-indigo-700 ring-offset-4 dark:ring-offset-gray-700"
        />
      </div>
      {/* Opsional: Munculin nama kecil di sebelah avatar kalau gak sticky */}
      {!sticky && (
        <span className="hidden lg:block ltr:ml-3 rtl:mr-3 text-slate-600 dark:text-slate-300 text-sm font-semibold">
          {user?.name?.split(" ")[0]} {/* Ambil nama depan aja */}
        </span>
      )}
    </div>
  );
};

const Profile = ({ sticky }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. AMBIL DATA USER DARI REDUX
  const { user } = useSelector((state) => state.auth);

  const ProfileMenu = [
    {
      label: "Profile",
      icon: "ph:user-circle-light",
      status: "green",
      action: () => navigate("/user/profile"),
    },
    {
      label: "Settings",
      icon: "ph:gear-light",
      status: "yellow",
      action: () => navigate("/settings"),
    },
  ];

  const handleLogout = () => {
    // 1. Bersihkan Storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // 2. Reset Redux State
    dispatch(logOut());

    // 3. Paksa pindah ke login dan refresh state aplikasi
    window.location.href = "/login";
  };

  return (
    <Dropdown
      label={<ProfileLabel sticky={sticky} user={user} />}
      classMenuItems="w-[220px] top-[58px]"
    >
      <div className="flex items-center px-4 py-3 border-b border-gray-10 mb-3">
        <div className="flex-none ltr:mr-[10px] rtl:ml-[10px]">
          <div className="h-[46px] w-[46px] rounded-full">
            <img
              src={getAvatarUrl(user?.avatar)}
              alt="Profile"
              className="block w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <div className="flex-1 text-gray-700 dark:text-white text-sm font-semibold">
          {/* 3. NAMA DINAMIS */}
          <span className="truncate w-full block capitalize">
            {user?.name || "User Name"}
          </span>
          {/* 4. ROLE DINAMIS */}
          <span className="block font-light text-xs capitalize text-slate-400">
            {user?.role || "Role"}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {ProfileMenu.map((item, index) => (
          <Menu.Item key={index}>
            {({ active }) => (
              <div
                onClick={() => item.action()}
                className={`${
                  active
                    ? "text-indigo-500 bg-slate-100 dark:bg-slate-700"
                    : "text-gray-600 dark:text-gray-300"
                } block transition-all duration-150 group cursor-pointer`}
              >
                <div className={`block px-4 py-2`}>
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span
                      className={`flex-none h-8 w-8 inline-flex items-center justify-center group-hover:scale-110 transition-all duration-200 rounded-full text-xl text-white
                       ${item.status === "green" ? "bg-green-500" : ""}
                       ${item.status === "yellow" ? "bg-yellow-500" : ""}
                      `}
                    >
                      <Icon icon={item.icon} />
                    </span>
                    <span className="block text-sm">{item.label}</span>
                  </div>
                </div>
              </div>
            )}
          </Menu.Item>
        ))}
        <Menu.Item onClick={handleLogout}>
          <div className="block cursor-pointer px-4 border-t border-gray-10 py-3 mt-1 text-indigo-500">
            <Button
              icon="ph:arrow-right-light"
              text="Logout"
              className="btn-primary block w-full btn-sm"
            />
          </div>
        </Menu.Item>
      </div>
    </Dropdown>
  );
};

export default Profile;
