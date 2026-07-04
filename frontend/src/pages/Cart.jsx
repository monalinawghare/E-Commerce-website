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

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("access");
        const [cartRes, productsRes] = await Promise.all([
          api.get("cart/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("products/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const cartData = Array.isArray(cartRes.data)
          ? cartRes.data
          : cartRes.data?.results || [];
        const productData = Array.isArray(productsRes.data)
          ? productsRes.data
          : productsRes.data?.results || [];

        const userCartItems = cartData.filter(
          (item) => Number(item.user) === Number(user.id)
        );

        const enrichedItems = userCartItems.map((item) => {
          const product = productData.find(
            (p) => Number(p.id) === Number(item.product)
          );

          return {
            ...item,
            productDetails: product || null,
          };
        });

        setCartItems(enrichedItems);
      } catch {
        setError("Unable to load your cart right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate, user]);

  const updateQuantity = async (id, nextQuantity) => {
    if (nextQuantity < 1) {
      await removeItem(id);
      return;
    }

    try {
      const token = localStorage.getItem("access");
      await api.patch(
        `cart/${id}/`,
        { quantity: nextQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: nextQuantity } : item))
      );
    } catch {
      setError("Could not update quantity.");
    }
  };

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("access");
      await api.delete(`cart/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Could not remove item from cart.");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.productDetails?.price || 0);
    return sum + price * Number(item.quantity || 1);
  }, 0);

  const deliveryFee = subtotal > 0 ? 0 : 0;
  const total = subtotal + deliveryFee;

  return (
    <>
      <Navbar />

      <div className="cart-container">
        <div className="cart-page">
          <div className="cart-section">
            <h2>Your Cart</h2>

            {loading && <p className="cart-status">Loading your cart...</p>}
            {error && <p className="cart-status error">{error}</p>}

            {!loading && cartItems.length === 0 && (
              <div className="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Add products from the home page to see them here.</p>
                <button className="shop-products-btn" onClick={() => navigate("/products")}>
                  Browse Products
                </button>
              </div>
            )}

            {!loading &&
              cartItems.map((item) => {
                const product = item.productDetails;
                const productName = product?.product_name || "Product";
                const price = Number(product?.price || 0);

                return (
                  <div className="cart-item" key={item.id}>
                    <img
                      src="https://via.placeholder.com/120"
                      alt={productName}
                    />

                    <div className="item-details">
                      <h3>{productName}</h3>
                      <p>Qty: {item.quantity}</p>
                      <p className="item-price">₹{price.toLocaleString()}</p>
                    </div>

                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}>
                        +
                      </button>
                    </div>

                    <button className="remove-btn" onClick={() => removeItem(item.id)}>
                      Remove
                    </button>
                  </div>
                );
              })}
          </div>

          <div className="summary-card">
            <h3>Bill Details</h3>
            <div className="summary-row">
              <span>Item Total</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
            </div>
            <div className="summary-row total">
              <span>To Pay</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Cart;