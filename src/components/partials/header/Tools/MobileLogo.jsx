import React from "react";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import { useSelector } from "react-redux";

import MainLogo from "@/assets/images/logo/logo.svg";
import LogoWhite from "@/assets/images/logo/logo-white.svg";
const MobileLogo = () => {
  const [isDark] = useDarkMode();
  const auth = useSelector((state) => state.auth);
  const dashboardLink = auth?.user?.role === "admin" ? "/dashboard" : "/user/dashboard";

  return (
    <Link to={dashboardLink}>
      <img src={isDark ? LogoWhite : MainLogo} alt="" />
    </Link>
  );
};

export default MobileLogo;
