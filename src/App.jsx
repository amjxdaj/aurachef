import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import AddRecipe from "./pages/AddRecipe";
import CalorieTracking from "./pages/CalorieTracking";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AuthProvider, { useAuth } from "./context/AuthProvider"; // ✅ Correct import
import ResetPassword from './pages/ResetPassword';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="container mx-auto px-4 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/add-recipe" element={<AddRecipe />} />
            <Route path="/calorie-tracking" element={<CalorieTracking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* ✅ Protect Admin Dashboard Route */}
            <Route path="/admin-dashboard" element={<ProtectedAdminRoute />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

// ✅ Protected Route Component
const ProtectedAdminRoute = () => {
  const { user } = useAuth(); // ✅ Access user from AuthContext
  return user?.isAdmin ? (
    <AdminDashboard />
  ) : (
    <Navigate to="/profile" replace />
  );
};

export default App;
