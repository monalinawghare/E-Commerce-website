import { useState , useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import "./ProductDetails.css";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    });
}, []);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await api.get(`products/${id}/`);
                setProduct(response.data);
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        const storedUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("access");

        if (!storedUser || !accessToken) {
            navigate("/login");
            return;
        }

        try {
            const user = JSON.parse(storedUser);
            await api.post(
                "cart/",
                {
                    user: Number(user.id),
                    product: Number(product.id),
                    quantity: Number(quantity),
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setMessage("Product added to cart successfully.");
            setError("");
        } catch {
            setError("Could not add item to cart right now.");
            setMessage("");
        }
    };
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="product-details-container">
                    <h2>Loading...</h2>
                </div>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Navbar />
                <div className="product-details-container">
                    <h2>Product not found</h2>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="product-details-container">
                <div className="product-details-card">
                    <div className="product-image">
                        <img
                            src={product.image || "https://via.placeholder.com/360x240"}
                            alt={product.product_name || `Product ${product.id}`}
                        />
                    </div>

                    <div className="product-info">
                        <h1>{product.product_name}</h1>
                        <p className="price">₹{product.price}</p>
                        <p>
                            <strong>Category:</strong> {product.category_name}
                        </p>
                        <p>
                            <strong>Vendor:</strong>{" "}
                            {product.vendor
                                ? `${product.vendor.first_name} ${product.vendor.last_name}`
                                : "N/A"}
                        </p>
                        <p>
                            <strong>Availability:</strong>
                            <span className="stock"> {product.stock}</span>
                        </p>
                        <p className="description">{product.description}</p>

                        <div className="quantity">
                            <label>Quantity:</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>

                        {message && <p style={{ color: "green" }}>{message}</p>}
                        {error && <p style={{ color: "#ed4b0a" }}>{error}</p>}

                        <button onClick={handleAddToCart}>Add to Cart</button>
                    </div>
                </div>
            </div>
        <Footer />
        </>
    );
}

export default ProductDetails;
