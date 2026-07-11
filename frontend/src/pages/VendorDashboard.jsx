import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./VendorDashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Swal from "sweetalert2";


export default function VendorDashboard() {

    const navigate = useNavigate();

    const [active, setActive] = useState("dashboard");
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    const vendor = JSON.parse(localStorage.getItem("user")) || {};

    const vendorName =
        vendor.username ||
        vendor.name ||
        vendor.full_name ||
        "Vendor";

    const vendorEmail =
        vendor.email || "No Email";

    const profileLetter = vendorName.charAt(0).toUpperCase();

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("access");
            const response = await api.get("/createorder/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOrders(response.data);

        } catch (error) {
            console.log(error);
        }
    };
    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("access");

            const response = await api.get("/products/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

        const user = JSON.parse(localStorage.getItem("user"));

        console.log("Logged in user:", user);
        console.log("Products:", response.data);

        const myProducts = response.data.filter(
            (product) => product.vendor?.id === user.id
        );

        console.log("My Products:", myProducts);

        setProducts(myProducts);

        } catch (error) {
            console.log(error);
        }
    };
    const updateStatus = async (id, status) => {

        try {

            const token = localStorage.getItem("access");

            await api.put(
                `/updatestatus/${id}/`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchOrders();

        } catch (error) {
            console.log(error);
        }
    };
    const deleteProduct = async (id) => {
    const result = await Swal.fire({
        title: "Delete Product?",
        text: "Are you sure you want to delete this product?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
        const token = localStorage.getItem("access");

        await api.delete(`/products/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setProducts((prev) =>
            prev.filter((product) => product.id !== id)
        );

        Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Product deleted successfully.",
            timer: 1500,
            showConfirmButton: false,
        });

    } catch (error) {
        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to delete product.",
        });
    }
};
    const totalRevenue = orders
        .filter(order => order.status === "Delivered")
        .reduce(
            (sum, order) => sum + Number(order.total_price),
            0
        );

    const deliveredOrders = orders.filter(
        order => order.status === "Delivered"
    ).length;

    const pendingOrders = orders.filter(
        order => order.status === "Pending"
    ).length;

    const handleNavigation = (menu, path = null) => {

        setActive(menu);

        if (path) {
            navigate(path);
        }
    };

    const handleLogout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

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
                        className={active==="orders" ? "active":""}
                        onClick={()=>navigate("/orders")}
                        >
                        Orders
                        </li>

                        <li
                            className={active === "products" ? "active" : ""}
                            onClick={() => navigate("/products")}
                        >
                            Products
                        </li>

                        <li
                            className={active === "revenue" ? "active" : ""}
                            onClick={() => handleNavigation("revenue")}
                        >
                            Revenue
                        </li>
                        <li
                            className={active === "myproducts" ? "active" : ""}
                            onClick={() => setActive("myproducts")}
                        >
                            My Products
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
                            <p>{products.length}</p>
                        </div>
                        </div>

                        <div className="bottom">

                        <div className="box">

                            <h3>Recent Orders</h3>

                            {/* ✅ Table wrapped in orders-scroll — this is the ONLY scroll area */}
                            <div className="orders-scroll">
                            <table>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                {orders.length > 0 ? (
                orders.map((order) => (
                    <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.product_name}</td>
                    <td>{order.quantity}</td>

                    <td
                        className={
                        order.status === "Delivered"
                            ? "delivered"
                            : order.status === "Accepted"
                            ? "accepted"
                            : order.status === "Shipped"
                            ? "shipped"
                            : "pending"
                        }
                    >
                        {order.status}
                    </td>

                    <td>₹{order.total_price}</td>

                    <td>

                        <button
                            className="action-btn accept-btn"
                            onClick={() => updateStatus(order.id,"Accepted")}
                        >
                            Accept
                        </button>

                        <button
                            className="action-btn ship-btn"
                            onClick={() => updateStatus(order.id,"Shipped")}
                        >
                            Ship
                        </button>
                        <button
                            className="action-btn deliver-btn"
                            onClick={() => updateStatus(order.id,"Delivered")}
                        >
                            Deliver
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="7">
                    No Orders Found
                    </td>
                </tr>
                )}
            </tbody>
            </table>
            </div>
        </div>

        <div className="box">
            <h3>Quick Actions</h3>
            <button onClick={() => navigate("/add-product")}>
            Add Product
            </button>
            <button onClick={()=>navigate("/orders")}>
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

        <div className="orders-scroll">
        <table>

            <thead>
            <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Status</th>
                <th>Amount</th>
            </tr>
            </thead>

            <tbody>
            {orders.length > 0 ? (
                orders.map((order) => (
                <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.product_name}</td>
                    <td
                    className={
                        order.status === "Delivered"
                        ? "delivered"
                        : order.status === "Accepted"
                        ? "accepted"
                        : order.status === "Shipped"
                        ? "shipped"
                        : "pending"
                    }
                    >
                    {order.status}
                    </td>
                    <td>₹{order.total_price}</td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="5">
                    No Revenue Data
                </td>
                </tr>

            )}
            </tbody>
                    </table>
                    </div>
                    </div>
                    
                    </>
                    )}
                
                { /* my products*/}
                {active === "myproducts" && (
        <>
            <div className="topbar">
                <h2>My Products</h2>
            </div>

            <div className="box">
                <button
                    onClick={() => navigate("/add-product")}
                    style={{ marginBottom: "20px" }}
                >
                    + Add Product
                </button>

                <div className="orders-scroll">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.product_name}
                                            width="60"
                                            height="60"
                                        />
                                    </td>

                                    <td>{product.product_name}</td>
                                    <td>{product.category_name}</td>
                                    <td>₹{product.price}</td>
                                    <td>{product.stock}</td>

                                    <td>
                                        <button onClick={() => navigate(`/edit-product/${product.id}`)}>
                                            Edit
                                        </button>

                                        <button onClick={() => deleteProduct(product.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">
                                    No Products Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        </>
    )}
            </main>
            </div>
            <Navbar/>
            <Footer/>
            </>
        );
    }