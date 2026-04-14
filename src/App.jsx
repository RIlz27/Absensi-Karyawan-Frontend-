import React, { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

// home pages  & dashboard
const Dashboard = lazy(() => import("./pages/dashboard"));

const Login = lazy(() => import("./pages/auth/login"));
const Login2 = lazy(() => import("./pages/auth/login2"));
const Register = lazy(() => import("./pages/auth/register"));
const Register2 = lazy(() => import("./pages/auth/register2"));
const ForgotPass = lazy(() => import("./pages/auth/forgot-password"));
const ForgotPass2 = lazy(() => import("./pages/auth/forgot-password2"));
const Error = lazy(() => import("./pages/404"));
const SetupWizard = lazy(() => import("./pages/absensi/SetupWizard.jsx"));

const Profile = lazy(() => import("./pages/absensi/user/Profile.jsx"));
const NotificationPage = lazy(() => import("./pages/utility/notifications"));

const GenerateQR = lazy(() => import("./pages/absensi/admin/GenerateQR.jsx"));
const Scanner = lazy(() => import("./pages/absensi/user/Scanner.jsx"));
const Kantor = lazy(() => import("./pages/absensi/admin/Kantor.jsx"));
const UserList = lazy(() => import("./pages/absensi/UserList.jsx"));
const ManageShift = lazy(() => import("./pages/absensi/admin/ManageShift.jsx"));
const PengumumanAdmin = lazy(
  () => import("./pages/absensi/admin/pengumuman/PengumumanAdmin.jsx"),
);
const LeaderboardAdmin = lazy(
  () => import("./pages/absensi/admin/Leaderboard.jsx"),
);
const AdminCalendar = lazy(
  () => import("./pages/absensi/admin/calendar/AdminCalendar.jsx"),
);
const AddUser = lazy(() => import("./pages/absensi/admin/AddUser.jsx"));
const Laporan = lazy(() => import("./pages/absensi/admin/Laporan.jsx"));
const UserDashboard = lazy(() => import("./pages/absensi/user/Dashboard.jsx"));
const Pengajuan = lazy(() => import("./pages/absensi/user/Pengajuan.jsx"));
const Point = lazy(() => import("./pages/absensi/user/Point.jsx"));
const Approval = lazy(() => import("./pages/absensi/admin/Approval.jsx"));
const AssessmentForm = lazy(
  () => import("./pages/absensi/admin/AssessmentForm.jsx"),
);

const RiwayatAbsen = lazy(() => import("./pages/absensi/user/RiwayatAbsen.jsx"));

const ManagerAssessmentDashboard = lazy(
  () => import("./pages/absensi/admin/ManagerAssessmentDashboard.jsx"),
);
const AssessmentCategoryAdmin = lazy(
  () => import("./pages/absensi/admin/AssessmentCategoryAdmin.jsx"),
);

const AssessmentDetail = lazy(
  () => import("./pages/absensi/admin/AssessmentDetail.jsx"),
);

const MyAssessment = lazy(
  () => import("./pages/absensi/user/Myassessment.jsx"),
);

import Layout from "./layout/Layout";
import Loading from "@/components/Loading";
import GlobalLoader from "@/components/GlobalLoader";
import AuthLayout from "./layout/AuthLayout";

function App() {
  const navigate = useNavigate();
  const [isConfigured, setIsConfigured] = useState(null);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const API_BASE =
          import.meta.env.VITE_API_URL ||
          import.meta.env.VITE_API_BASE_URL ||
          "http://127.0.0.1:8000/api";
        const response = await axios.get(`${API_BASE}/initial-setup/check`, {
          headers: { "ngrok-skip-browser-warning": "69420" },
        });

        if (response.data.setup_done === false) {
          setIsConfigured(false);
          navigate("/setup", { replace: true });
        } else {
          setIsConfigured(true);
        }
      } catch (error) {
        console.error("Koneksi Error:", error);
        setIsConfigured(true);
      }
    };

    checkSetup();
  }, [navigate]);

  if (isConfigured === null) return <Loading />;

  return (
    <main className="App  relative">
      <GlobalLoader />
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login2" element={<Login2 />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register2" element={<Register2 />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/forgot-password2" element={<ForgotPass2 />} />
        </Route>

        <Route
          path="/setup"
          element={
            <Suspense fallback={<Loading />}>
              <SetupWizard />
            </Suspense>
          }
        />

        <Route path="/*" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="profile" element={<Profile />} />

          {/* Absensi routes */}
          <Route path="admin/kantor" element={<Kantor />} />
          <Route path="admin/generate-qr" element={<GenerateQR />} />
          <Route path="admin/pengumuman" element={<PengumumanAdmin />} />
          <Route path="admin/leaderboard" element={<LeaderboardAdmin />} />
          <Route path="admin/calendar" element={<AdminCalendar />} />
          <Route path="user/scanner" element={<Scanner />} />
          <Route path="user/list" element={<UserList />} />
          <Route path="admin/manage-shift" element={<ManageShift />} />
          <Route path="admin/AddUser" element={<AddUser />} />
          <Route path="users" element={<UserList />} />
          <Route path="admin/laporan" element={<Laporan />} />
          <Route path="admin/approval" element={<Approval />} />
          <Route path="user/dashboard" element={<UserDashboard />} />
          <Route path="user/pengajuan" element={<Pengajuan />} />
          <Route path="user/point" element={<Point />} />
          <Route path="user/profile" element={<Profile />} />
          <Route path="user/riwayat" element={<RiwayatAbsen />} />
          <Route
            path="admin/assessments"
            element={<ManagerAssessmentDashboard />}
          />
          <Route
            path="admin/assessment-categories"
            element={<AssessmentCategoryAdmin />}
          />

          {/* Rute buat Form Penilaian */}
          <Route
            path="admin/assessments/form/:id"
            element={
              <Suspense fallback={<Loading />}>
                <AssessmentForm />
              </Suspense>
            }
          />

          <Route
            path="admin/assessments/detail/:id"
            element={
              <Suspense fallback={<Loading />}>
                <AssessmentDetail />
              </Suspense>
            }
          />

          <Route
            path="user/my-assessment"
            element={
              <Suspense fallback={<Loading />}>
                <MyAssessment />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/404" />} />
        <Route
          path="/404"
          element={
            <Suspense fallback={<Loading />}>
              <Error />
            </Suspense>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
