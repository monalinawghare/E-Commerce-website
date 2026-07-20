import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import api from "../services/api";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !username.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (phone.trim().length !== 10 || !/^\d+$/.test(phone.trim())) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await api.post("register/", {
        username,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
      });

      setSuccessMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      if (err.response?.data) {
        const serverErrors = err.response.data;
        const firstError = Object.values(serverErrors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : "Signup failed.");
      } else {
        setError("Server Error");
      }
    }
  };

  const clearError = () => {
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
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
              src="/images/signup.jpg"
              alt="Join GrandMart"
              className="brand-image"
            />
            <div className="brand-text">
              <h2>Join the GrandMart!</h2>
              <p>Create your account and unlock exclusive deals & offers.</p>
            </div>
          </div>

          {/* ---- Form Side ---- */}
          <div className="login-form">
            <h1>Create Account</h1>

            <form onSubmit={handleSignup}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      clearError();
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      clearError();
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      clearError();
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError();
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={phone}
                    maxLength={10}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, "");
                      setPhone(digitsOnly);
                      clearError();
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError();
                    }}
                  />
                </div>
              </div>

              {error && <p className="error-message">{error}</p>}
              {successMessage && <p className="success-message">{successMessage}</p>}

              <button type="submit">Sign Up</button>

              <p className="signup-text">
                Already have an account? <Link to="/">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;