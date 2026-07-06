    import { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";
    import "./UserDashboard.css";
    import Footer from "../components/Footer";


    function UserDashboard() {
    const navigate = useNavigate();

    const [user] = useState(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return null;

        try {
        return JSON.parse(storedUser);
        } catch {
        return null;
        }
    });

    useEffect(() => {
        if (!user) {
        navigate("/");
        return;
        }

        if (user.role === "vendor") {
        navigate("/vendor-dashboard");
        }
    }, [navigate, user]);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        navigate("/");
    };

    if (!user) return null;

    return (
        <>
        <div className="dashboard-layout">
            {/* SIDEBAR */}
            <div className="sidebar">
            <button
                className="home-btn"
                onClick={() => navigate("/home")}
            >
                🏠 Home
            </button>

            <div className="profile-mini">
                <img
                src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=9b1648&color=fff`}
                alt="profile"
                />
                <h3>
                {user.first_name} {user.last_name}
                </h3>
                <p>@{user.username}</p>
            </div>

            <div className="menu">
                <div onClick={() => navigate("/orders")}>📦 Orders</div>
                <div onClick={() => navigate("/cart")}>🛒 Cart</div>
            </div>

            <div className="sidebar-stats">
                <h4>Quick Stats</h4>

                <div className="stat-row">
                <span>Total Orders</span>
                <span>12</span>
                </div>

                <div className="stat-row">
                <span>Cart Items</span>
                <span>3</span>
                </div>

                <div className="stat-row">
                <span>Member Since</span>
                <span>2024</span>
                </div>
            </div>

            <div className="sidebar-bottom">
                <button
                className="logout-side"
                onClick={handleLogout}
                >
                🚪 Logout
                </button>
            </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="main">
            <div className="welcome-card">
                <h1>Welcome back 👋</h1>
                <p>{user.first_name}, manage your account here</p>
            </div>

            <div className="info-grid">
                <div className="info-box">
                <h4>Email</h4>
                <p>{user.email}</p>
                </div>

                <div className="info-box">
                <h4>Phone</h4>
                <p>{user.phone || "Not Added"}</p>
                </div>

                <div className="info-box">
                <h4>Username</h4>
                <p>{user.username}</p>
                </div>
            </div>
            </div>
        </div>

        <Footer />

    </>
    );
    }

    export default UserDashboard;