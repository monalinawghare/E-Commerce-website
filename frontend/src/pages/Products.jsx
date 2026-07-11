        import { useEffect, useState } from "react";
        import Navbar from "../components/Navbar";
        import Footer from "../components/Footer";
        import { useNavigate, useSearchParams } from "react-router-dom";
        import api from "../services/api";
        import "./Products.css";
        import { toast } from "react-toastify";

        function Products() {
        const navigate = useNavigate();

        const [searchParams] = useSearchParams();

        const selectedCategory = searchParams.get("category");
        const searchQuery = searchParams.get("search");

        const [products, setProducts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");

        useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError("");

            try {
                let url = "products/";

                if (selectedCategory) {
                    url += `?category=${selectedCategory}`;
                }

                const response = await api.get(url);

                const productData = Array.isArray(response.data)
                    ? response.data
                    : response.data.results || [];

                setProducts(productData);
            } catch (err) {
                console.error(err);
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        };

    fetchProducts();
}, [selectedCategory]);

        const addToCart = async (product) => {
            if (product.stock <= 0) {
                toast.error("Product is out of stock!");
                return;
            }

            try {
                const token = localStorage.getItem("access");

                if (!token) {
                navigate("/login");
                return;
                }

                await api.post(
                "cart/",
                {
                    product: product.id,
                },
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
                );

                toast.success("Product added to cart successfully!");
            } catch (err) {
                console.error(err);

                if (err.response?.data?.error) {
                toast.error(err.response.data.error);
                } else {
                toast.error("Failed to add product.");
                }
            }
            };

        let filteredProducts = products;

        if (searchQuery) {
            filteredProducts = filteredProducts.filter((product) =>
            product.product_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            );
        }

        let pageTitle = "All Products";

        if (selectedCategory && searchQuery) {
            pageTitle = `Search Results`;
        } else if (selectedCategory) {
            pageTitle = "Category Products";
        } else if (searchQuery) {
            pageTitle = `Search Results for "${searchQuery}"`;
        }
        return (
        <>
        <Navbar />

        <div className="products-container">
            <h1>{pageTitle}</h1>

            {(selectedCategory || searchQuery) && (
            <button
                onClick={() => navigate("/products", {replace : true})}
                style={{
                padding: "10px 20px",
                marginBottom: "20px",
                background: "#9b1648",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "block",
                margin: "0 auto 20px",
                width: "170px",
                }}
            >
                ← Clear Filters
            </button>
            )}

            {loading && (
            <div
                style={{
                textAlign: "center",
                padding: "40px",
                fontSize: "18px",
                }}
            >
                Loading Products...
            </div>
            )}

            {error && (
            <div
                style={{
                textAlign: "center",
                color: "red",
                padding: "20px",
                }}
            >
                {error}
            </div>
            )}

            {!loading && (
            <div className="products-grid">
                {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                    <div className="product-card" key={product.id}>
                    <div className="img-wrap">
                        <img
                        src={
                            product.image
                                ? product.image
                                : "https://via.placeholder.com/250x220?text=No+Image"
                        }
                        alt={product.product_name}
                        />
                    </div>

                    <h3>{product.product_name}</h3>

                    <p className="category">
                        {product.category_name}
                    </p>

                    <p className="price">
                        ₹{parseFloat(product.price).toLocaleString("en-IN")}
                    </p>
                    <p className={product.stock > 0 ? "stock" : "out-stock"}>
                        {product.stock > 0
                            ? `${product.stock} Available`
                            : "Out of Stock"}
                    </p>
                    <div className="product-buttons">
                        <button type="button" onClick={() => navigate(`/product-details/${product.id}`)}>
                            View Details
                        </button>

                        <button
                            className={product.stock > 0 ? "add-cart-btn" : "out-of-stock-btn"}
                            onClick={() => addToCart(product)}
                            disabled={product.stock <= 0}
                        >
                            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                        </button>
                        </div>
                    </div>
                ))
                ) : (
                <div
                    style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#666",
                    }}
                >
                    <h3>No Products Found</h3>

                    <p>
                    {searchQuery
                    ? `No products found for "${searchQuery}".`
                    : "No products available in this category."}
                </p>

                <button
                    onClick={() => navigate("/products",{replace: true})}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        background: "#9b1648",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        width: "180px",
                    }}
                    >
                    View All Products
                    </button>
                </div>
                )}
            </div>
            )}
        </div>

        <Footer />
        </>
    );
    }

export default Products;