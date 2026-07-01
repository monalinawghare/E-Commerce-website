import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

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
      const response = await fetch(
        "http://127.0.0.1:8000/accounts/forgot-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            new_password: formData.new_password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError("");
        setFormData({
          email: "",
          new_password: "",
          confirmPassword: "",
        });
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Server error.");
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">TARS MARKET</div>
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

      <footer className="footer">
        © 2026 Tars Market. All rights reserved.
      </footer>
    </>
  );
}

export default ForgotPassword;