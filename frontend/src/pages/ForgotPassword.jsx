import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import api from "../services/api";

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
    new_password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post("forgot-password/", {
        email: formData.email,
        new_password: formData.new_password,
      });

      setMessage(response.data.message);
      setError("");
      setFormData({
        email: "",
        new_password: "",
        confirmPassword: "",
      });
    } catch (err) {
      if (err.response?.data) {
        const serverErrors = err.response.data;
        const firstError = Object.values(serverErrors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : "Something went wrong.");
      } else {
        setError("Server error.");
      }
    }
  };
  return (
    <>
      <nav className="navbar">
        <div className="logo">GrandMart</div>
      </nav>

      <div className="login-container">
        <div className="login-box">
          <h1>Forgot Password</h1>

          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>New Password</label>
            <input
              type="password"
              name="new_password"
              placeholder="Enter new password"
              value={formData.new_password}
              onChange={handleChange}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            {error && (
              <p style={{ color: "#ed4b0a", fontSize: "13px" }}>{error}</p>
            )}

            {message && (
              <p style={{ color: "green", fontSize: "13px" }}>{message}</p>
            )}

            <button type="submit">Reset Password</button>
          </form>

          <p className="signup-text">
            Remembered your password? <Link to="/">Login</Link>
          </p>
        </div>
      </div>

    </>
  );
}

export default ForgotPassword;