import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import Navbar from "../components/Navbar";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("cart/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Cart Data:", response.data);

        setCartItems(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate, token]);

  
  const total = cartItems.reduce((sum, item) => {
    const price = Number(item.price ?? item.product_price ?? 0);
    const quantity = Number(item.quantity ?? 1);

    return sum + price * quantity;
  }, 0);

  const placeOrder = async () => {
    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        total_price: total,
        address,
        payment_method: paymentMethod,
      };

      await api.post("orders/", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await api.delete("cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Order placed successfully!");

      navigate("/orders");
    } catch (error) {
      console.error("Order Error:", error);
      alert("Unable to place order.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="checkout-container">
        <div className="checkout-box">

          <h2>Checkout</h2>

          {loading ? (
            <h3 style={{ textAlign: "center", marginTop: "30px" }}>
              Loading checkout...
            </h3>
          ) : (
            <>
              
              <div className="cart-summary">
                <h3>Order Summary</h3>

                {cartItems.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  cartItems.map((item) => {
                    const price = Number(
                      item.price ?? item.product_price ?? 0
                    );
                    const quantity = Number(item.quantity ?? 1);
                    const subtotal = price * quantity;

                    return (
                      <div
                        key={item.id}
                        className="cart-item"
                        style={{
                          borderBottom: "1px solid #ddd",
                          marginBottom: "15px",
                          paddingBottom: "15px",
                        }}
                      >
                        <h4>{item.product_name}</h4>

                        <p>
                          <strong>Price:</strong> ₹{price.toFixed(2)}
                        </p>

                        <p>
                          <strong>Quantity:</strong> {quantity}
                        </p>

                        <p>
                          <strong>Subtotal:</strong> ₹
                          {subtotal.toFixed(2)}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              
              <div className="address-box">
                <h3>Delivery Address</h3>

                <textarea
                  placeholder="Enter complete delivery address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

            
              <div className="payment-box">
                <h3>Select Payment Method</h3>

                <label>
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on Delivery
                </label>

                <br />
                <br />

                <label>
                  <input
                    type="radio"
                    value="UPI"
                    checked={paymentMethod === "UPI"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  UPI
                </label>

                <br />
                <br />

              </div>

              
              <div
                className="total-box"
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  background: "#f8f9fa",
                  textAlign: "center",
                }}
              >
                <h2>Total Amount</h2>

                <h1 style={{ color: "green" }}>
                  ₹
                  {total.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
              </div>

              <button
                className="place-order-btn"
                onClick={placeOrder}
                style={{ marginTop: "20px" }}
              >
                Place Order (
                ₹
                {total.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                )
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Checkout;