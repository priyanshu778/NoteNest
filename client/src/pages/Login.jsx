import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/ContextProvider";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
        if (response.data.success) {
          login(response.data.user);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!");
          navigate("/");
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      } catch (error) {
        toast.error("An error occurred during login.");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-teal-500 to-blue-600 px-6">
      <div className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-8 sm:p-10 shadow-lg border border-white/30">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Log In</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white bg-opacity-80"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white bg-opacity-80"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-md transition duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-teal-400 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
