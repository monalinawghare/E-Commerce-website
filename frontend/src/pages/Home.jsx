import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import "./Home.css";
    function Home() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchFeaturedProducts();
    }, []);
    const fetchCategories = async () => {
        try {
        const response = await api.get("categories/");
        setCategories(response.data);
        } catch (error) {
        console.error("Failed to load categories:", error);
        }
    };
    const fetchFeaturedProducts = async () => {
        try {
        const response = await api.get("products/");
        setFeaturedProducts(response.data);
        } catch (error) {
        console.error("Failed to load products:", error);
        }
    };
    return (
        <>
        <Navbar />
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Welcome to GrandMart</h1>
                    <p>
                        Discover premium products with exciting offers and fast delivery.
                    </p>
                    <div className="hero-buttons">
                    <button
                        className="outline-btn"
                        onClick={() => navigate("/products")}
                    >
                        Explore Products
                    </button>
                </div>
            </div>
            <div className="hero-image">
                    <img
                        src="/images/Hero image.jpg"
                        alt="Shopping illustration"
                        />
            </div>
        </section>
            {/* Categories */}
            <section className="category-section">
            <h2>Browse by Category</h2>
            <div className="category-grid">
                {categories.length > 0 ? (
                categories.map((category) => (
                    <div
                    className="category-card"
                    key={category.id}
                    onClick={() =>
                        navigate(`/products?category=${category.id}`)
                    }
                    >
                    {category.image ? (
                        <img
                        src={category.image}
                        alt={category.category_name}
                        className="category-img"
                        />
                    ) : (
                        <div className="category-placeholder">📂</div>
                    )}
                    <h3>{category.category_name}</h3>
                    </div>
                ))
                ) : (
                <p>No Categories Available</p>
                )}
            </div>
            </section>
            {/* Featured Products */}
            <section className="featured-products">
            <h2>Featured Products</h2>
            <div className="product-grid">
                {featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 4).map((product) => (
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
                        {product.category_name || "Category"}
                    </p>
                    <p className="price">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>
                    <p className={product.stock > 0 ? "stock" : "out-stock"}>
                        {product.stock > 0
                            ? `In Stock (${product.stock})`
                            : "Out of Stock"}
                    </p>

                    <button
                        onClick={() =>
                        navigate(`/product-details/${product.id}`)
                        }
                    >
                        View Details
                    </button>
                    </div>
                ))
                ) : (
                <p>No Products Available</p>
                )}
            </div>
            </section>

            {/* Offer Banner */}

            <section className="offer-banner">
            <h2>🔥 Grand Sale - Up to 70% OFF 🔥</h2>

            <p>Grab today's best deals before they are gone.</p>

            <button onClick={() => navigate("/products")}>
                Shop Deals
            </button>
            </section>

        </div>

        <Footer />
        
        </>
    );
    }

    export default Home;