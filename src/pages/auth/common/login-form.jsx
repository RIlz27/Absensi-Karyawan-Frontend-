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

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
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
    const response = await login(data).unwrap();

    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      dispatch(setUser(response.user));

      toast.success("Login Successful");

      // Langsung tembak ke dashboard tanpa pilih kasih role
      navigate("/dashboard"); 
    }
  } catch (error) {
    const errorMsg = error.data?.message || "Email atau password salah";
    toast.error(errorMsg);
  }
};

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <InputGroup
        name="email"
        type="email"
        label="email"
        placeholder="email"
        prepend="@"
        defaultValue="admin@gmail.com" // Update biar gampang ngetesnya
        register={register}
        error={errors.email}
        merged
        disabled={isLoading}
      />
      <InputGroup
        name="password"
        label="password"
        type="password"
        placeholder="password"
        prepend={<Icon icon="ph:lock-simple" />}
        defaultValue="password" // Update biar gampang ngetesnya
        register={register}
        error={errors.password}
        merged
        disabled={isLoading}
      />

      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Remember me"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-gray-400 dark:text-gray-400 hover:text-indigo-500 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <Button
        type="submit"
        text="Sign in"
        className="btn btn-primary block w-full text-center "
        isLoading={isLoading}
      />
    </form>
  );
};

export default LoginForm;