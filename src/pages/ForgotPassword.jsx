import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email before submitting.");
      return;
    }

    setError("");
    console.log(email);
    setSent(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">TARS MARKET</div>
      </nav>

      <div className="login-container">
        <div className="login-box">
          <h1>Reset Password</h1>
          <p>Enter your email and we'll send you a reset link</p>

          {sent ? (
            <p className="signup-text">
              Reset link sent! Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleReset}>
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

              {error && (
                <p style={{ color: "#ed4b0a", fontSize: "13px", marginTop: "6px" }}>
                  {error}
                </p>
              )}

              <button type="submit">Submit</button>
            </form>
          )}

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