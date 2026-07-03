import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import api from "../services/api";

// const VENDOR_EMAIL = "vendor@grandmart.com";
// const VENDOR_PASSWORD = "vendor123";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidLoginInput = (value) => value.trim().length >= 2;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please fill in both login and password.");
      return;
    }

    if (!isValidLoginInput(email)) {
      setError("Please enter a valid email or username.");
      return;
    }

    if (password.length < 2) {
      setError("Password must be at least 2 characters.");
      return;
    }

    setError("");
    try {
      const payload = { password };
      if (email.includes("@")) {
        payload.email = email;
      } else {
        payload.username = email;
      }

      const response = await api.post("login/", payload);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/home");
    } catch (err) {
      if (err.response) {
        setError("Invalid email or password.");
      } else {
        setError("Server Error");
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

          <h1>Log-in</h1>
          <p>Welcome to GrandMart</p>

          <form onSubmit={handleLogin}>

            <label>Email or Username</label>
            <input
              type="text"
              placeholder="Enter your email or username"
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

    </>
  );
}

export default Login;