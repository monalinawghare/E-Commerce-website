import "./Orders.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

    function Orders() {
    // Sample orders data 
    const orders = [
        {
        id: "ORD001",
        date: "2025-12-15",
        status: "Delivered",
        total: 2499,
        items: 3,
        },
        {
        id: "ORD002",
        date: "2025-12-10",
        status: "In Transit",
        total: 1799,
        items: 2,
        },
        {
        id: "ORD003",
        date: "2025-12-05",
        status: "Processing",
        total: 3299,
        items: 5,
        },
    ];

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
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.items}</td>
                    <td>₹{order.total}</td>
                    <td>
                        <span className={`status status-${order.status.toLowerCase().replace(" ", "-")}`}>
                        {order.status}
                        </span>
                    </td>
                    <td>
                        <Link to={`/order-details/${order.id}`} className="view-btn">
                        View Details
                        </Link>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <div className="empty-orders">
                <p>No orders found</p>
                <Link to="/products" className="continue-btn">
                Continue Shopping
                </Link>
            </div>
            )}
        </div>
        </div>
        <Footer />
        </>
    );
    }

export default Orders;
