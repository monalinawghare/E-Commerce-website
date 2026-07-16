/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Cart.css";

function Cart() {
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

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get("cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cartData = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      setCartItems(cartData);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Unable to load your cart.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, nextQuantity) => {
    if (nextQuantity < 1) {
      removeItem(id);
      return;
    }

    try {
      const token = localStorage.getItem("access");

      await api.patch(
        `cart/${id}/`,
        {
          quantity: nextQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, quantity: nextQuantity }
            : item
        )
      );
    } catch {
      setError("Could not update quantity.");
    }
  };

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("access");

      await api.delete(`cart/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch {
      setError("Could not remove item.");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.price) * Number(item.quantity);
  }, 0);

  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee;

  return (
    <>
      <Navbar />

      <div className="cart-container">
        <div className="cart-page">

          <div className="cart-section">

            <h2>Your Cart</h2>

            {loading && (
              <p className="cart-status">
                Loading your cart...
              </p>
            )}

            {error && (
              <p className="cart-status error">
                {error}
              </p>
            )}

            {!loading && cartItems.length === 0 && (
              <div className="empty-cart">
                <h3>Your Cart is Empty</h3>

                <p>
                  Add products to continue shopping.
                </p>

                <button
                  className="shop-products-btn"
                  onClick={() => navigate("/products")}
                >
                  Browse Products
                </button>
              </div>
            )}

            {!loading &&
              cartItems.map((item) => (
                <div
                  className="cart-item"
                  key={item.id}
                >
                  <img
                    src={item.image || "https://via.placeholder.com/120"}
                    alt={item.product_name}
                  />
                  <div className="item-details">
                    <h3>{item.product_name}</h3>
                    <p className="item-price">
                      ₹{Number(item.price).toLocaleString()}
                    </p>
                  </div>

                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>

          <div className="summary-card">

            <h3>Bill Details</h3>

            <div className="summary-row">
              <span>Item Total</span>

              <span>
                ₹{subtotal.toLocaleString()}
              </span>
            </div>

            <div className="summary-row">
              <span>Delivery Fee</span>

              <span>
                {deliveryFee === 0
                  ? "FREE"
                  : `₹${deliveryFee}`}
              </span>
            </div>

            <div className="summary-row total">
              <span>To Pay</span>

              <span>
                ₹{total.toLocaleString()}
              </span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default Cart;