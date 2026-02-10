import React, { useState } from "react";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLoginMutation } from "@/store/api/auth/authApiSlice";
import { setUser } from "@/store/api/auth/authSlice";

// 1. Update Schema: Email ganti jadi NIP
const schema = yup
  .object({
    nip: yup
      .string()
      .required("NIP wajib diisi")
      .min(5, "NIP minimal 5 karakter"), // Sesuaikan panjang NIP lo
    password: yup.string().required("Password wajib diisi"),
  })
  .required();

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    try {
      // Data yang dikirim sekarang { nip, password }
      const response = await login(data).unwrap();

      // Sesuaikan dengan key yang dikirim Laravel (tadi di controller lo pake 'access_token')
      const token = response.token || response.access_token;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.user));
        dispatch(setUser(response.user));

        toast.success("Login Berhasil");

        // Logic Role: Admin ke dashboard, Karyawan ke scanner (opsional)
        if (response.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/app/home"); // Arahkan karyawan ke tempat scan
        }
      }
    } catch (error) {
      const errorMsg = error.data?.message || "NIP atau password salah";
      toast.error(errorMsg);
    }
  };

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      {/* 2. Update Input: Type text & Name nip */}
      <InputGroup
        name="nip"
        type="text"
        label="NIP"
        placeholder="Masukkan NIP"
        prepend={<Icon icon="ph:user" />} // Ganti icon jadi user
        defaultValue="12345" // Dummy buat ngetes
        register={register}
        error={errors.nip}
        merged
        disabled={isLoading}
      />
      
      <InputGroup
        name="password"
        label="Password"
        type="password"
        placeholder="Password"
        prepend={<Icon icon="ph:lock-simple" />}
        defaultValue="password"
        register={register}
        error={errors.password}
        merged
        disabled={isLoading}
      />

      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Ingat saya"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-gray-400 dark:text-gray-400 hover:text-indigo-500 hover:underline"
        >
          Lupa Password?
        </Link>
      </div>

      <Button
        type="submit"
        text="Masuk"
        className="btn btn-primary block w-full text-center "
        isLoading={isLoading}
      />
    </form>
  );
};

export default LoginForm;