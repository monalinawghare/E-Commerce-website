    import "./Orders.css";
    import { Link } from "react-router-dom";
    import { useEffect, useState } from "react";
    import Navbar from "../components/Navbar";
    import Footer from "../components/Footer";
    import api from "../services/api";
    import Swal from "sweetalert2";

    function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState("All");
    const [paymentFilter, setPaymentFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));
    const isVendor = user?.role === "vendor";

    // ===========================
    // Fetch Orders
    // ===========================

    const fetchOrders = async () => {
        try {
        const response = await api.get("createorder/");
        setOrders(response.data);
        } catch (error) {
        console.log(error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ===========================
    // Vendor Status Update
    // ===========================

    const updateStatus = async (id, status) => {
        try {
        await api.put(`updatestatus/${id}/`, {
            status,
        });

        Swal.fire({
            icon: "success",
            title: "Success",
            text: `Order ${status}`,
            timer: 1500,
            showConfirmButton: false,
        });

        fetchOrders();
        } catch (err) {
        console.log(err);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Unable to update order.",
        });
        }
    };

    // ===========================
    // User Cancel Order
    // ===========================

    const cancelOrder = async (id) => {
        const result = await Swal.fire({
        title: "Cancel Order?",
        text: "Are you sure you want to cancel this order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        });

        if (!result.isConfirmed) return;

        try {
        await api.delete(`cancel/${id}/`);

        Swal.fire({
            icon: "success",
            title: "Cancelled",
            text: "Order cancelled successfully.",
            timer: 1500,
            showConfirmButton: false,
        });

        fetchOrders();
        } catch (err) {
        console.log(err);

        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Unable to cancel order.",
        });
        }
    };

    // ===========================
    // Filters
    // ===========================

    const filteredOrders = orders.filter((order) => {
        const search = searchTerm.toLowerCase().trim();

        const buyer =
        (order.user?.username || order.customer_name || "").toLowerCase();

        const product =
        (order.product_name || "").toLowerCase();

        const matchesSearch =
        search === "" ||
        order.id.toString().includes(search) ||
        buyer.includes(search) ||
        product.includes(search);

        const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

        const matchesPayment =
        paymentFilter === "All" ||
        order.payment_method === paymentFilter;

        return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
        );
    });
    const openOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
        };

        const closeModal = () => {
            setShowModal(false);
            setSelectedOrder(null);
        };

    if (loading) {
        return (
        <>
            <Navbar />

            <div className="orders-container">
            <h2>Loading...</h2>
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
            <h1>
                {isVendor
                ? "Customer Orders"
                : "Your Orders"}
            </h1>

            <p>
                {isVendor
                ? "Manage customer orders"
                : "Track and manage all your purchases"}
            </p>
            </div>

            <div className="orders-content">

            <div className="orders-filters">

                <input
                type="text"
                placeholder="🔍 Search Order ID, Buyer, Product..."
                value={searchTerm}
                onChange={(e) =>
                    setSearchTerm(e.target.value)
                }
                className="search-order"
                />

                <div className="filter-group">
                <label>Status</label>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                    setStatusFilter(e.target.value)
                    }
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                </select>
                </div>

                <div className="filter-group">
                <label>Payment</label>

                <select
                    value={paymentFilter}
                    onChange={(e) =>
                    setPaymentFilter(e.target.value)
                    }
                >
                    <option value="All">All</option>
                    <option value="ONLINE">ONLINE</option>
                    <option value="COD">COD</option>
                </select>
                </div>

            </div>
            {filteredOrders.length > 0 ? (
                <table className="orders-table">
                <thead>
                    <tr>
                    <th>Order ID</th>

                    {isVendor && <th>Buyer</th>}

                    <th>Product</th>
                    <th>Date</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredOrders.map((order) => (
                    <tr key={order.id}>
                        <td className="order-id">
                        #{order.id}
                        </td>

                        {isVendor && (
                        <td>
                            {order.user?.username ||
                            order.customer_name}
                        </td>
                        )}

                        <td>{order.product_name}</td>

                        <td>
                        {new Date(
                            order.order_date
                        ).toLocaleDateString()}
                        </td>

                        <td>{order.quantity}</td>

                        <td>
                        ₹{order.total_price}
                        </td>

                        <td>
                        <span
                            className={`payment payment-${order.payment_method.toLowerCase()}`}
                        >
                            {order.payment_method}
                        </span>
                        </td>

                        <td>
                        <span
                            className={`status status-${order.status.toLowerCase()}`}
                        >
                            {order.status}
                        </span>
                        </td>

                        <td>
                            <button
                                className="view-btn"
                                onClick={() => openOrder(order)}
                            >
                                👁 View
                            </button>

                            <br />
                            <br />
                        {isVendor ? (
                            <>
                            {order.status ===
                                "Pending" && (
                                <>
                                <button
                                    className="accept-btn"
                                    onClick={() =>
                                    updateStatus(
                                        order.id,
                                        "Accepted"
                                    )
                                    }
                                >
                                    Accept
                                </button>

                                <button
                                    className="reject-btn"
                                    onClick={() =>
                                    updateStatus(
                                        order.id,
                                        "Rejected"
                                    )
                                    }
                                >
                                    Reject
                                </button>
                                </>
                            )}

                            {order.status ===
                                "Accepted" && (
                                <button
                                className="ship-btn"
                                onClick={() =>
                                    updateStatus(
                                    order.id,
                                    "Shipped"
                                    )
                                }
                                >
                                Ship
                                </button>
                            )}

                            {order.status ===
                                "Shipped" && (
                                <button
                                className="deliver-btn"
                                onClick={() =>
                                    updateStatus(
                                    order.id,
                                    "Delivered"
                                    )
                                }
                                >
                                Deliver
                                </button>
                            )}

                            {(order.status ===
                                "Delivered" ||
                                order.status ===
                                "Rejected" ||
                                order.status ===
                                "Cancelled") && (
                                <span>-</span>
                            )}
                            </>
                        ) : (
                            <>
                            {order.status ===
                            "Pending" ? (
                                <button
                                className="cancel-btn"
                                onClick={() =>
                                    cancelOrder(
                                    order.id
                                    )
                                }
                                >
                                Cancel Order
                                </button>
                            ) : (
                                <span>-</span>
                            )}
                            </>
                        )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                <div className="empty-orders">
                <h3>No Orders Found</h3>

                <p>
                    {isVendor
                    ? "No customer orders available."
                    : "You haven't placed any orders yet."}
                </p>

                {!isVendor && (
                    <Link
                    to="/products"
                    className="continue-btn"
                    >
                    Continue Shopping
                    </Link>
                )}
                </div>
            )}
            </div>
            </div>
            {showModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="order-modal">

                    <h2 className="modal-title">📦 Order Details</h2>

                    <div className="order-content">

                        {/* Left Side - Product Image */}
                        <div className="order-image">
                        {selectedOrder.image && (
                            <img
                            src={selectedOrder.image}
                            alt={selectedOrder.product_name}
                            className="modal-product-image"
                            />
                        )}
                        </div>

                        {/* Right Side - Details */}
                        <div className="order-details">

                        <p>
                            <strong>Order ID :</strong> #{selectedOrder.id}
                        </p>

                        {isVendor && (
                            <p>
                            <strong>Buyer :</strong> {selectedOrder.user?.username}
                            </p>
                        )}

                        <p>
                            <strong>Product :</strong> {selectedOrder.product_name}
                        </p>

                        <p>
                            <strong>Quantity :</strong> {selectedOrder.quantity}
                        </p>

                        <p>
                            <strong>Total :</strong> ₹{selectedOrder.total_price}
                        </p>

                        <p>
                            <strong>Payment :</strong> {selectedOrder.payment_method}
                        </p>

                        <p>
                            <strong>Status :</strong>{" "}
                            <span
                            className={`status status-${selectedOrder.status.toLowerCase()}`}
                            >
                            {selectedOrder.status}
                            </span>
                        </p>

                        <p>
                            <strong>Order Date :</strong>{" "}
                            {new Date(selectedOrder.order_date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                })}
                        </p>

                        {/* Tracking only for User */}
                        {!isVendor && (
                            <>
                            <h3 className="tracking-title">
                                🚚 Order Tracking
                            </h3>

                            <div className="tracking-horizontal">

                                {/* Placed */}
                                <div className={`track-item active`}>
                                <div className="track-circle"></div>
                                <span>Placed</span>
                                </div>

                                <div
                                className={`track-line ${
                                    ["Accepted", "Shipped", "Delivered"].includes(
                                    selectedOrder.status
                                    )
                                    ? "active-line"
                                    : ""
                                }`}
                                ></div>

                                {/* Accepted */}
                                <div
                                className={`track-item ${
                                    ["Accepted", "Shipped", "Delivered"].includes(
                                    selectedOrder.status
                                    )
                                    ? "active"
                                    : ""
                                }`}
                                >
                                <div className="track-circle"></div>
                                <span>Accepted</span>
                                </div>

                                <div
                                className={`track-line ${
                                    ["Shipped", "Delivered"].includes(
                                    selectedOrder.status
                                    )
                                    ? "active-line"
                                    : ""
                                }`}
                                ></div>

                                {/* Shipped */}
                                <div
                                className={`track-item ${
                                    ["Shipped", "Delivered"].includes(
                                    selectedOrder.status
                                    )
                                    ? "active"
                                    : ""
                                }`}
                                >
                                <div className="track-circle"></div>
                                <span>Shipped</span>
                                </div>

                                <div
                                className={`track-line ${
                                    selectedOrder.status === "Delivered"
                                    ? "active-line"
                                    : ""
                                }`}
                                ></div>

                                {/* Delivered */}
                                <div
                                className={`track-item ${
                                    selectedOrder.status === "Delivered"
                                    ? "active"
                                    : ""
                                }`}
                                >
                                <div className="track-circle"></div>
                                <span>Delivered</span>
                                </div>

                            </div>

                            {selectedOrder.status === "Cancelled" && (
                                <p className="cancelled-text">
                                ❌ This order has been cancelled.
                                </p>
                            )}

                            {selectedOrder.status === "Rejected" && (
                                <p className="rejected-text">
                                ❌ This order was rejected by the vendor.
                                </p>
                            )}
                            </>
                        )}

                        </div>
                    </div>

                    <button
                        className="close-btn"
                        onClick={closeModal}
                    >
                        Close
                    </button>

                    </div>
                </div>
                )}
        <Footer />
        </>
    );
}

export default Orders;