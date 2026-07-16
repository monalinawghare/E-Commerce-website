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
        <div className="login-box split-layout">
          {/* ---- Brand Side ---- */}
          <div className="login-brand">
            <img
              src="images/forgotpassword.jpg"
              alt="Reset Password"
              className="brand-image"
            />
            <div className="brand-text">
              <h2>Reset Your Password</h2>
              <p>Enter your email and create a new secure password.</p>
            </div>
          </div>

          {/* ---- Form Side ---- */}
          <div className="login-form">
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

              {error && <p className="error-message">{error}</p>}
              {message && <p className="success-message">{message}</p>}

              <button type="submit">Reset Password</button>

              <p className="signup-text">
                Remembered your password? <Link to="/">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;