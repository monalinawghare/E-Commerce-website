import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./Checkout.css";
import Swal from "sweetalert2";

function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");
  const user = JSON.parse(localStorage.getItem("user"));

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

  // ---------- CASH ON DELIVERY ----------
  if (paymentMethod === "COD") {
    try {
      for (const item of cartItems) {
        const orderData = {
          customer_name: user.username,
          product: item.product,
          quantity: item.quantity,
          address,
          payment_method: "COD",
        };

        await api.post("createorder/", orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await api.delete("cart/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Order placed successfully!",
        confirmButtonColor: "#8B3A3A",
    });
      navigate("/orders");

    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: "Unable to place order.",
        confirmButtonColor: "#8B3A3A",
    });
    }

    return;
  }

  // ---------- RAZORPAY ----------
  try {

    const razorOrder = await api.post(
      "create-razorpay-order/",
      {
        amount: total,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const options = {

      key: razorOrder.data.key,

      amount: razorOrder.data.amount,

      currency: razorOrder.data.currency,

      order_id: razorOrder.data.order_id,

      name: "GrandMart",

      description: "Product Purchase",

      handler: async function (response) {

        await api.post(
          "verify-payment/",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Create Orders
        for (const item of cartItems) {

          const orderData = {
            customer_name: user.username,
            product: item.product,
            quantity: item.quantity,
            address,
            payment_method: "ONLINE",
          };

          await api.post("createorder/", orderData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        }

        await api.delete("cart/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text: "Your order has been placed successfully.",
          confirmButtonText: "OK",
        });

        navigate("/orders");
      },

      theme: {
        color: "#f37254",
      },

    };

    const razor = new window.Razorpay(options);

    razor.open();

  } catch (err) {

    console.log(err);

    Swal.fire({
      icon: "error",
      title: "Payment Failed",
      text: "Please try again.",
    });

  }
};

  return (
    <>
      <Navbar />

      <div className="checkout-page">
        <div className="checkout-box">

          <span className="checkout-eyebrow">Secure Checkout</span>
          <h2>Checkout</h2>
          <p className="checkout-subtitle">
            Review your order before you pay
          </p>

          {loading ? (
            <div className="checkout-loading">
              <span className="dots">Loading checkout</span>
            </div>
          ) : (
            <>

              <div className="cart-summary">
                <div className="section-step">
                  <span className="step-num">01</span>
                  <h3>Order Summary</h3>
                </div>

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
                      <div key={item.id} className="cart-item">
                        <h4>{item.product_name}</h4>

                        <div className="ledger-line">
                          <span>
                            ₹{price.toFixed(2)} &times; {quantity}
                          </span>
                          <span className="leader"></span>
                          <span className="subtotal">
                            ₹{subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>


              <div className="address-box">
                <div className="section-step">
                  <span className="step-num">02</span>
                  <h3>Delivery Address</h3>
                </div>

                <textarea
                  placeholder="Enter complete delivery address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>


              <div className="payment-box">
                <div className="section-step">
                  <span className="step-num">03</span>
                  <h3>Select Payment Method</h3>
                </div>

                <label>
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on Delivery
                </label>

                <label>
                  <input
                    type="radio"
                    value="Online"
                    checked={paymentMethod === "Online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Online
                </label>
              </div>

              <div className="total-box">
                <h2>Total Amount</h2>

                <h1>
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
      <Footer />
    </>
  
  );
}

export default Checkout;