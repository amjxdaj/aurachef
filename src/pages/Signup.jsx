import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthProvider"; 

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
  
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    if (!agreeTerms) {
      setError("You must agree to the Terms and Conditions");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }
  
      console.log("Signup successful:", data);
      localStorage.setItem("token", data.token);
      
            // Decode user details from the token
            const decodedUser = jwtDecode(data.token);
            console.log("Decoded User:", decodedUser);
      
            // ✅ Update Auth Context so other pages recognize login
            login(data.token);
      
            // ✅ Redirect based on role (with error handling)
            if (decodedUser.isAdmin) {
              navigate("/admin-dashboard");
            } else {
              navigate("/profile");
            }
  
    } catch (error) {
      setError(error.message); // Display the error message from the server
    }
  
    setIsLoading(false);
  };
  
  
  
  

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="glass p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-white/70 mt-2">
              Join AuraChef to discover healthy recipes
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-white font-medium mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full glass py-3 px-4 text-white placeholder-white/50 rounded-lg outline-none focus:ring-2 focus:ring-white/30 transition-all"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
            <label
                htmlFor="username"
                className="block text-white font-medium mb-2"
              >
                Username
              </label>
              <input
                type="text"
                placeholder="johndoe123"
                className="w-full glass py-3 px-4 text-white placeholder-white/50 rounded-lg outline-none focus:ring-2 focus:ring-white/30 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-white font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full glass py-3 px-4 text-white placeholder-white/50 rounded-lg outline-none focus:ring-2 focus:ring-white/30 transition-all"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-white font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full glass py-3 px-4 text-white placeholder-white/50 rounded-lg outline-none focus:ring-2 focus:ring-white/30 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-white font-medium mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full glass py-3 px-4 text-white placeholder-white/50 rounded-lg outline-none focus:ring-2 focus:ring-white/30 transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="terms"
                className="mr-2 h-4 w-4"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms" className="text-white">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-secondary-light hover:text-white transition-colors"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary btn-3d flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
            <br/>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-secondary-light hover:text-white transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
