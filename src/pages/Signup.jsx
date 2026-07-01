import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSignup = (e) => {
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

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");

    console.log({
      username,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      password,
    });

    alert("Signup Successful!");
  };

  const clearError = () => {
    if (error) setError("");
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">TARS MARKET</div>
      </nav>

      <div className="login-container">
        <div className="login-box">
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
                  onChange={(e) => {
                    setPhone(e.target.value);
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

            {error && (
              <p
                style={{
                  color: "#ed4b0a",
                  fontSize: "13px",
                  marginTop: "15px",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            )}

            <button type="submit">Sign Up</button>

            <p className="signup-text">
              Already have an account?{" "}
              <Link to="/">Login</Link>
            </p>

          </form>

        </div>
      </div>

      <footer className="footer">
        © 2026 TARS MARKET. All rights reserved.
      </footer>
    </>
  );
}

export default Signup;