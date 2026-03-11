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
      .min(3, "NIP minimal 5 karakter"), 
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

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
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
        type="password"
        placeholder="Password"
        prepend={<Icon icon="ph:lock-simple" />}
        defaultValue="airil0895"
        register={register}
        error={errors.password}
        merged
        disabled={isLoading}
      />

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
