        import { useState } from "react";
        import { useNavigate } from "react-router-dom";
        import "./VendorDashboard.css";

        export default function VendorDashboard() {

        const navigate = useNavigate();
        const [active, setActive] = useState("dashboard");

        const vendor = JSON.parse(localStorage.getItem("user")) || {};

        const vendorName =
        vendor.username ||
        vendor.name ||
        vendor.full_name ||
        "Vendor";

        const vendorEmail =
        vendor.email || "No Email";

        const profileLetter = vendorName.charAt(0).toUpperCase();

        const orders = [
            {
            id: "#101",
            product: "Shirt",
            status: "Delivered",
            amount: 799,
            },
            {
            id: "#102",
            product: "Shoes",
            status: "Pending",
            amount: 1999,
            },
            {
            id: "#103",
            product: "Watch",
            status: "Delivered",
            amount: 2499,
            },
            {
            id: "#104",
            product: "Laptop Bag",
            status: "Delivered",
            amount: 1599,
            },
        ];

        const totalRevenue = orders
            .filter((order) => order.status === "Delivered")
            .reduce((sum, order) => sum + order.amount, 0);

        const deliveredOrders = orders.filter(
            (order) => order.status === "Delivered"
        ).length;

        const pendingOrders = orders.filter(
            (order) => order.status === "Pending"
        ).length;

        const handleNavigation = (menu, path = null) => {
            setActive(menu);

            if (path) {
            navigate(path);
            }
        };
        const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
        };

        return (
            <>
        <div className="dashboard">

        <aside className="sidebar">

            <button
            className="home-btn"
            onClick={() => navigate("/home")}
            >
            🏠 Home
            </button>

            <div className="sidebar-profile-icon">
            {profileLetter}
            </div>

            <div className="vendor-info">
            <p className="name">{vendorName}</p>
            <p className="username">@{vendor.username || "vendor"}</p>
            </div>

                <ul className="menu">
                    <li
                    className={active === "dashboard" ? "active" : ""}
                    onClick={() => handleNavigation("dashboard")}
                    >
                    Dashboard
                    </li>

                    <li
                    className={active === "orders" ? "active" : ""}
                    onClick={() => navigate("/orders")}
                    >
                    Orders
                    </li>

                    <li
                    className={active === "products" ? "active" : ""}
                    onClick={() => navigate("/Products")}
                    >
                    Products
                    </li>

                    <li
                    className={active === "revenue" ? "active" : ""}
                    onClick={() => handleNavigation("revenue")}
                    >
                    Revenue
                    </li>
                    <li onClick={handleLogout}>
        Logout
        </li>
                </ul>

                <div className="vendor-info">
        <p className="name">{vendorName}</p>
        <p className="email">{vendorEmail}</p>
        </div>
                </aside>

                {/* Main */}
                <main className="main">

                {/* DASHBOARD */}
                {active === "dashboard" && (
                    <>
                    <div className="topbar">
                        <h2>Dashboard Overview</h2>
                        
                    </div>

                    <div className="cards">
                        <div className="card">
                        <h3>Orders</h3>
                        <p>{orders.length}</p>
                        </div>

                        <div className="card">
                        <h3>Revenue</h3>
                        <p>₹{totalRevenue}</p>
                        </div>

                        <div className="card">
                        <h3>Products</h3>
                        <p>35</p>
                        </div>
                    </div>

                    <div className="bottom">
                        <div className="box">
                        <h3>Recent Orders</h3>

                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                            </thead>

                            <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.product}</td>

                                <td
                                    className={
                                    order.status === "Delivered"
                                        ? "delivered"
                                        : "pending"
                                    }
                                >
                                    {order.status}
                                </td>

                                <td>₹{order.amount}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>

                        <div className="box">
                        <h3>Quick Actions</h3>

                        <button onClick={() => navigate("/add-product")}>
                            Add Product
                        </button>

                        <button onClick={() => navigate("/orders")}>
                            View Orders
                        </button>

                        <button onClick={() => navigate("/categories")}>
                            Add Category
                        </button>
                        </div>
                    </div>
                    </>
                )}

                {/* REVENUE */}
                {active === "revenue" && (
                    <>
                    <div className="topbar">
                        <h2>Revenue Report</h2>
                        <div className="profile">₹</div>
                    </div>

                    <div className="cards">
                        <div className="card">
                        <h3>Total Revenue</h3>
                        <p>₹{totalRevenue}</p>
                        </div>

                        <div className="card">
                        <h3>Delivered Orders</h3>
                        <p>{deliveredOrders}</p>
                        </div>

                        <div className="card">
                        <h3>Pending Orders</h3>
                        <p>{pendingOrders}</p>
                        </div>
                    </div>

                    <div className="box" style={{ marginTop: "20px" }}>
                        <h3>Revenue Details</h3>

                        <table>
                        <thead>
                            <tr>
                            <th>Order ID</th>
                            <th>Product</th>
                            <th>Status</th>
                            <th>Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.product}</td>

                                <td
                                className={
                                    order.status === "Delivered"
                                    ? "delivered"
                                    : "pending"
                                }
                                >
                                {order.status}
                                </td>

                                <td>₹{order.amount}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </>
                )}

                </main>
            </div>
            </>
        );
        }