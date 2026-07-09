import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import Swal from "sweetalert2";

    function UserDashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);

    const [user] = useState(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return null;

        try {
        return JSON.parse(storedUser);
        } catch {
        return null;
        }
    });
        const [editData, setEditData] = useState({
        first_name: "",
        last_name: "",
        phone: "",
    });

    useEffect(() => {
        if (user) {
            setEditData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
        navigate("/");
        return;
        }

        if (user.role === "vendor") {
        navigate("/vendor-dashboard");
        }
    }, [navigate, user]);
    useEffect(() => {

    const fetchDashboardData = async () => {

        try {

            const token = localStorage.getItem("access");

            const ordersRes = await api.get("/createorder/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const cartRes = await api.get("/cart/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOrders(
                Array.isArray(ordersRes.data)
                    ? ordersRes.data
                    : ordersRes.data.results || []
            );

            setCartItems(
                Array.isArray(cartRes.data)
                    ? cartRes.data
                    : cartRes.data.results || []
            );

        } catch (error) {
            console.log(error);
        }

    };

    if (user) {
        fetchDashboardData();
    }

}, [user]);
    const handleUpdateProfile = async () => {
    try {
        const token = localStorage.getItem("access");

        const res = await api.put(
            "/profile/",
            editData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        localStorage.setItem("user", JSON.stringify(res.data));

        Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Profile updated successfully.",
            timer: 1500,
            showConfirmButton: false,
        });

        setShowEditModal(false);

        setTimeout(() => {
            window.location.reload();
        }, 1500);

    } catch (err) {
        console.log(err);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to update profile.",
        });
    }
};
    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        navigate("/");
    };

    if (!user) return null;
    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        order => order.status === "Pending"
    ).length;

    const deliveredOrders = orders.filter(
        order => order.status === "Delivered"
    ).length;

    const cartCount = cartItems.length;


    return (
        <>
        <div className="dashboard-layout">
            {/* SIDEBAR */}
            <div className="sidebar">
            <button
                className="home-btn"
                onClick={() => navigate("/home")}
            >🏠 Home
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
                <hr />

                <div className="profile-details">
                <p><strong>Email</strong></p>
                <span>{user.email}</span>

                <p><strong>Phone</strong></p>
                <span>{user.phone || "Not Added"}</span>

                <p><strong>Member Since</strong></p>
                <span>
                    {user.date_joined
                        ? new Date(user.date_joined).toLocaleDateString()
                        : "N/A"}
                </span>

                <p><strong>Role</strong></p>
                <span>{user.role}</span>
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
            {showEditModal && (
        <div className="modal-overlay">
            <div className="modal">
            <h2>Edit Profile</h2>

            <label>First Name</label>
            <input
                type="text"
                value={editData.first_name}
                onChange={(e) =>
                    setEditData({
                        ...editData,
                        first_name: e.target.value,
                    })
                }
            />

            <input
                type="text"
                value={editData.last_name}
                onChange={(e) =>
                    setEditData({
                        ...editData,
                        last_name: e.target.value,
                    })
                }
            />

            <input
                type="text"
                value={editData.phone}
                onChange={(e) =>
                    setEditData({
                        ...editData,
                        phone: e.target.value,
                    })
                }
            />

            <div className="modal-buttons">
                <button onClick={handleUpdateProfile}>Save</button>

                <button
                onClick={() => setShowEditModal(false)}
                >
                Cancel
                </button>
            </div>
            </div>
        </div>
        )}

            {/* MAIN CONTENT */}
            <div className="main">
                <div className="welcome-card">
                    <h1>Welcome back 👋</h1>
                    <p>{user.first_name}, Manage your orders, cart and profile from one place.</p>
                </div>
                <div className="info-grid">
                    <div className="info-box">
                        <h4>Total Orders</h4>
                        <p>{totalOrders}</p>
                    </div>
                    <div className="info-box">
                        <h4>Pending Orders</h4>
                        <p>{pendingOrders}</p>
                    </div>
                    <div className="info-box">
                        <h4>Delivered Orders</h4>
                        <p>{deliveredOrders}</p>
                    </div>
                    <div className="info-box">
                        <h4>Cart Items</h4>
                        <p>{cartCount}</p>
                    </div>
                </div>
                <div className="recent-orders">
                    <h2>Recent Orders</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.slice(0, 5).map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.product_name}</td>
                                    <td>{order.status}</td>
                                    <td>₹{order.total_price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="quick-actions">
                    <button onClick={() => navigate("/products")}>
                        Continue Shopping
                    </button>

                    <button onClick={() => navigate("/cart")}>
                        View Cart
                    </button>

                    <button onClick={() => navigate("/orders")}>
                        My Orders
                    </button>

                    <button onClick={() => setShowEditModal(true)}>
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
        <Navbar />
        <Footer />

    </>
    );
}

export default UserDashboard;