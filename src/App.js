import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Investments from "./pages/Investments";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Referrals from "./pages/Referrals";
import Profile from "./pages/Profile";
import MyTickets from "./pages/MyTickets";
import Transactions from "./pages/Transactions";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDeposits from "./pages/admin/AdminDeposits";
import AdminWithdrawals from "./pages/admin/AdminWithdrawals";
import AdminInvestments from "./pages/admin/AdminInvestments";
import AdminAutomation from "./pages/admin/AdminAutomation";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminContent from "./pages/admin/AdminContent";
import Announcements from "./pages/Announcements";
import AboutUs from "./pages/AboutUs";
import Legal from "./pages/Legal";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Auth Context
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
    }
    
    if (adminToken) {
      const adminData = JSON.parse(localStorage.getItem("admin") || "{}");
      setAdmin(adminData);
    }
    
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const adminLogin = (token, adminData) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("admin", JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const adminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setAdmin(null);
  };

  return { user, admin, loading, login, logout, adminLogin, adminLogout };
};

function App() {
  const auth = useAuth();

  if (auth.loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={auth.user ? <Navigate to="/dashboard" /> : <Login onLogin={auth.login} />} />
          <Route path="/register" element={auth.user ? <Navigate to="/dashboard" /> : <Register onLogin={auth.login} />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={auth.user ? <Dashboard onLogout={auth.logout} /> : <Navigate to="/login" />} />
          <Route path="/investments" element={auth.user ? <Investments onLogout={auth.logout} /> : <Navigate to="/login" />} />
          <Route path="/deposit" element={auth.user ? <Deposit onLogout={auth.logout} /> : <Navigate to="/login" />} />
          <Route path="/withdraw" element={auth.user ? <Withdraw onLogout={auth.logout} /> : <Navigate to="/login" />} />
          <Route path="/referrals" element={auth.user ? <Referrals onLogout={auth.logout} /> : <Navigate to="/login" />} />
          <Route path="/my-tickets" element={auth.user ? <MyTickets onLogout={auth.logout} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={auth.user ? <Profile onLogout={auth.logout} /> : <Navigate to="/login" />} />
          <Route path="/transactions" element={auth.user ? <Transactions onLogout={auth.logout} /> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={auth.admin ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={auth.adminLogin} />} />
          <Route path="/admin/dashboard" element={auth.admin ? <AdminDashboard onLogout={auth.adminLogout} /> : <Navigate to="/admin" />} />
          <Route path="/admin/users" element={auth.admin ? <AdminUsers onLogout={auth.adminLogout} /> : <Navigate to="/admin" />} />
          <Route path="/admin/deposits" element={auth.admin ? <AdminDeposits onLogout={auth.adminLogout} /> : <Navigate to="/admin" />} />
          <Route path="/admin/withdrawals" element={auth.admin ? <AdminWithdrawals onLogout={auth.adminLogout} /> : <Navigate to="/admin" />} />
          <Route path="/admin/investments" element={auth.admin ? <AdminInvestments onLogout={auth.adminLogout} /> : <Navigate to="/admin" />} />
          <Route path="/admin/automation" element={auth.admin ? <AdminAutomation onLogout={auth.adminLogout} /> : <Navigate to="/admin" />} />
          <Route path="/admin/notices" element={auth.admin ? <AdminNotices onLogout={auth.adminLogout} /> : <Navigate to="/admin" />} />
          <Route path="/admin/support" element={auth.admin ? <AdminSupport onLogout={auth.adminLogout} /> : <Navigate to="/admin" />} />
          <Route path="/admin/content" element={auth.admin ? <AdminContent onLogout={auth.adminLogout} /> : <Navigate to="/admin" />} />
          <Route path="/admin/settings" element={auth.admin ? <AdminSettings onLogout={auth.adminLogout} /> : <Navigate to="/admin" />} />
          
          {/* Public Pages */}
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
