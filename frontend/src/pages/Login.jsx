import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import api from "../services/api";

// const VENDOR_EMAIL = "vendor@tarsmarket.com";
// const VENDOR_PASSWORD = "vendor123";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    try {
  const response = await api.post("login/", {
    email,
    password,
  });

  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  alert(response.data.message);

  console.log(response.data);

} catch (error) {

  if (error.response) {
    setError("Invalid email or password.");
  } else {
    setError("Server Error");
  }

}
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">TARS MARKET</div>
      </nav>

      <div className="login-container">
        <div className="login-box">

          <h1>Log-in</h1>
          <p>Welcome to Tars Market</p>

          <form onSubmit={handleLogin}>

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
            />

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            {error && (
              <p style={{ color: "#ed4b0a", fontSize: "13px", marginTop: "10px" }}>
                {error}
              </p>
            )}

            <button type="submit">Login</button>

            <p className="signup-text">
              Don't have an account?{" "}
              <Link to="/signup">Sign Up</Link>
            </p>

          </form>

        </div>
      </div>

      <footer className="footer">
        © 2026 Tars Market. All rights reserved.
      </footer>
    </>
  );
}

export default Login;