import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const baseURL = process.env.REACT_APP_BASE_URL
import axios from "../../utils/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/api/auth/login`,
        { email, password }
      );
      // Assuming the response contains a token or user info
      const { token, data } = response.data;

      // Store token and user info in local storage
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(data));

      // Navigate to the desired page after login
      navigate("/"); // Adjust the path as needed
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-200 p-6">
      <section className="bg-orange-300 shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Sign In to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-white"
            >
              Email:
            </label>
            <input
              id="email"
              name="email"
              placeholder="Enter your email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-white"
            >
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-400"
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm font-semibold">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded-full shadow-lg my-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
      </section>
    </div>
  );
}
