    import { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";

    function UserDashboard() {
    const navigate = useNavigate();
    const [user] = useState(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
        return null;
        }

        try {
        return JSON.parse(storedUser);
        } catch {
        return null;
        }
    });

    useEffect(() => {
        if (!user) {
        navigate("/");
        }
    }, [navigate, user]);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "40px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", background: "white", padding: "30px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
            <h1 style={{ marginBottom: "10px" }}>Welcome back</h1>
            <p style={{ color: "#666", marginBottom: "20px" }}>You are now logged in.</p>

            {user && (
            <div style={{ marginBottom: "20px" }}>
                <p><strong>Name:</strong> {user.first_name || ""} {user.last_name || ""}</p>
                <p><strong>Username:</strong> {user.username || ""}</p>
                <p><strong>Email:</strong> {user.email || ""}</p>
            </div>
            )}

            <button onClick={handleLogout} style={{ padding: "10px 16px", border: "none", borderRadius: "8px", background: "#ed4b0a", color: "white", cursor: "pointer" }}>
            Logout
            </button>
        </div>
        </div>
    );
    }

    export default UserDashboard;
