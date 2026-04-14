import React, { useState } from "react";
import InputGroup from "@/components/ui/InputGroup";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
// import Checkbox from "@/components/ui/Checkbox"; // Kalo ga dipake, mending dicomment aja
// import { Link } from "react-router-dom"; // Kalo ga dipake, mending dicomment aja
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
      .min(3, "NIP minimal 5 karakter"), 
    password: yup.string().required("Password wajib diisi"),
  })
  .required();

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // STATE BARU BUAT SHOW/HIDE PASSWORD
  const [showPassword, setShowPassword] = useState(false);

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
      const payload = {
        ...data,
        nip: data.nip.trim()
      };
      const response = await login(payload).unwrap();
      const token = response.token || response.access_token;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.user));
        dispatch(setUser(response.user));

        toast.success("Login Berhasil");

        if (response.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      const errorMsg = error.data?.message || "NIP atau password salah";
      toast.error(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputGroup
        name="nip"
        type="text"
        label="NIP"
        placeholder="Masukkan NIP"
        prepend={<Icon icon="ph:user" />} 
        defaultValue="0085689927" 
        register={register}
        error={errors.nip}
        merged
        disabled={isLoading}
      />

      <InputGroup
        name="password"
        label="Password"
        // LOGIC TIPE INPUT: Kalo showPassword true, jadi 'text', kalo false jadi 'password'
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        prepend={<Icon icon="ph:lock-simple" />}
        // TAMBAHIN TOMBOL MATA DI KANAN
        append={
          <button
            type="button" // Wajib type="button" biar ga ga sengaja ke-submit formnya
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-primary transition-colors flex items-center justify-center p-1"
          >
            <Icon 
              icon={showPassword ? "ph:eye-slash-duotone" : "ph:eye-duotone"} 
              className="text-xl" 
            />
          </button>
        }
        defaultValue="airil0895"
        register={register}
        error={errors.password}
        merged
        disabled={isLoading}
      />

      <Button
        type="submit"
        text="Masuk"
        className="btn btn-primary block w-full text-center"
        isLoading={isLoading}
      />
    </form>
  );
};

export default LoginForm;