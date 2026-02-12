
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
// import Landing from "./pages/Landing";
import LoginPage from "./pages/Auth/Login";
import UserProfilePage from "./pages/UserProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/auth/useAuth";
// import DateRangePicker from "./components/attendance/DateRangePicker";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ConfirmEmail from "./pages/Auth/ConfirmEmail";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import Landing from "./pages/Landing";
import PagesLayout from "./layouts/PagesLayout";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Projects from "./pages/Projects";
import DetailsPage from "./pages/DetailsPage";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import QRCodeGeneratorScanner from "./pages/QRCodeGeneratorScanner";
import Properties from "./pages/Properties";
import Applications from "./pages/Applications";
import VerifySales from "./pages/VerifySales";
import Payments from "./pages/Payments";
import { useEffect } from "react";
import VerifyPayment from "./pages/VerifyPayment";
// import CleanTrackingParams from "./context/CleanTrackingParams";
// import ReactGA from "react-ga4";

// ReactGA.initialize("G-XXXXXXXXXX");
const chatId = import.meta.env.VITE_CHAT_ID

function App() {
  const { user } = useAuth();

  useEffect(() => {
    const configScript = document.createElement("script");
    configScript.innerHTML = `
            window.chatbaseConfig = {
                chatbotId: '${chatId}'
            };
        `;
    document.body.appendChild(configScript);

    const chatbaseScript = document.createElement("script");
    chatbaseScript.src = "https://www.chatbase.co/embed.min.js";
    chatbaseScript.defer = true;
    chatbaseScript.setAttribute("chatbotId", `${chatId}`);
    document.body.appendChild(chatbaseScript);
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('seman_token');
    return token ? children : <Navigate to="/login" />;
  };

  const ProtectedSuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('seman_token');
    const role = localStorage.getItem('fasma_role');
    return token && role === 'superAdmin' ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      {/* <CleanTrackingParams /> */}
      <Routes>
        {/* <Route path="/" element={<ProtectedRoute><Navigate to={`/${user?.role}/dashboard`} /></ProtectedRoute>} /> */}
        {/* <Route path="/" element={<Navigate to={`/central/dashboard`} />} /> */}

        < Route path="/admin" element={
          <ProtectedRoute>
            <SuperAdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="applications" element={<Applications />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<UserProfilePage />} />
        </ Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/confirm-email" element={<ConfirmEmail />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
              <div className="text-center px-6">
                <h1 className="text-7xl font-extrabold text-gray-800">404</h1>
                <p className="mt-4 text-lg text-gray-600">
                  Oops! The page you’re looking for doesn’t exist.
                </p>

                <Link
                  to="/"
                  className="mt-6 inline-block px-6 py-3 text-blue-600 bg-white border border-blue-600 rounded-2xl shadow-md transition"
                  onClick={() => { sessionStorage.removeItem('activeNavItem'); }}
                >
                  Go Home
                </Link>
              </div>
            </div>
          }
        />
        <Route path="/verify" element={<VerifySales />} />
        <Route path="/payments/verify" element={<VerifyPayment />} />

        < Route element={<PagesLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contacts" element={<ContactUs />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:slug" element={<DetailsPage />} />
          {/* <Route path="/qr" element={<QRCodeGenerator />} />
          <Route path="/qr2" element={<QRCodeGeneratorScanner />} /> */}
        </ Route>
      </Routes >
    </BrowserRouter >
  );
}

export default App
