    import "./Orders.css";
    import { Link } from "react-router-dom";
    import { useEffect, useState } from "react";
    import Navbar from "../components/Navbar";
    import Footer from "../components/Footer";
    import api from "../services/api";

    function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const isVendor = user?.role === "vendor";

    const fetchOrders = async () => {
        try {
            const response = await api.get("/createorder/");
            console.log("Orders API Response:", response.data);
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
        <>
            <Navbar />
            <div className="orders-container">
            <div className="orders-header">
                <h1>{isVendor ? "Customer Orders" : "Your Orders"}</h1>
                <p>
                {isVendor
                    ? "Manage customer orders"
                    : "Track and manage all your purchases"}
                </p>
            </div>
            </div>
            <Footer />
        </>
        );
    }
    return (
        <>
        <Navbar />

        <div className="orders-container">
            <div className="orders-header">
            <h1>Your Orders</h1>
            <p>Track and manage all your purchases</p>
            </div>

            <div className="orders-content">
            {orders.length > 0 ? (
                <table className="orders-table">
                <thead>
                    <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => (
                    <tr key={order.id}>
                        <td className="order-id">#{order.id}</td>

                        <td>
                        {new Date(order.order_date).toLocaleDateString()}
                        </td>

                        <td>{order.quantity}</td>

                        <td>₹{order.total_price}</td>

                        <td>
                        <span
                            className={`status status-${order.status.toLowerCase()}`}
                        >
                            {order.status}
                        </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <div className="empty-orders">
                    <p>
                        {isVendor
                            ? "No customer orders found."
                            : "No orders found."}
                    </p>

                    {!isVendor && (
                        <Link to="/products" className="continue-btn">
                            Continue Shopping
                        </Link>
                    )}
                </div>
            )}
            </div>
        </div>

        <Footer />
        </>
    );
    }

    export default Orders;