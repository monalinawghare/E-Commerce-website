    import { useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import "./VendorSignup.css";  
    import api from "../services/api";

    function VendorSignup() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [shopName, setShopName] = useState("");
    const [shopAddress, setShopAddress] = useState("");
    const [gstNumber, setGstNumber] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (
        !username.trim() ||
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !phone.trim() ||
        !shopName.trim() ||
        !shopAddress.trim() ||
        !password.trim()
        ) {
        setError("Please fill in all required fields.");
        return;
        }

        if (!isValidEmail(email)) {
        setError("Please enter a valid email address.");
        return;
        }

        if (password.length < 2) {
        setError("Password must be at least 2 characters.");
        return;
        }

        setError("");
        setSuccessMessage("");

        try {
        await api.post("vendor-register/", {
            username,
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            shop_name: shopName,
            shop_address: shopAddress,
            gst_number: gstNumber,
            password,
        });

        setSuccessMessage("Vendor registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
        if (err.response?.data) {
            const serverErrors = err.response.data;
            const firstError = Object.values(serverErrors)[0];
            setError(Array.isArray(firstError) ? firstError[0] : "Vendor signup failed.");
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
                src="public/images/vendor_signup.jpg"
                alt="Vendor registration"
                className="brand-image"
                />
                <div className="brand-text">
                <h2>Become a Vendor</h2>
                <p>Reach thousands of customers – list your products with us today!</p>
                </div>
            </div>

            {/* ---- Form Side ---- */}
            <div className="login-form">
                <h1>Vendor Sign Up</h1>

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
                    <label>Shop Name</label>
                    <input
                        type="text"
                        placeholder="Enter shop name"
                        value={shopName}
                        onChange={(e) => {
                        setShopName(e.target.value);
                        clearError();
                        }}
                    />
                    </div>

                    <div className="form-group">
                    <label>Shop Address</label>
                    <input
                        type="text"
                        placeholder="Enter shop address"
                        value={shopAddress}
                        onChange={(e) => {
                        setShopAddress(e.target.value);
                        clearError();
                        }}
                    />
                    </div>

                    <div className="form-group">
                    <label>GST Number</label>
                    <input
                        type="text"
                        placeholder="Enter GST number (optional)"
                        value={gstNumber}
                        onChange={(e) => {
                        setGstNumber(e.target.value);
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

                <button type="submit">Register as Vendor</button>

                <p className="signup-text">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
                </form>
            </div>
            </div>
        </div>
        </>
    );
    }

    export default VendorSignup;