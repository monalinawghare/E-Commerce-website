import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";
import Headphones from "../assets/products/Headphones.jpg";
import Dress from "../assets/products/dress.jpg";
import Speaker from "../assets/products/Speaker.jpg";
import Mouse from "../assets/products/Mouse.jpg";
function Home() {
    const navigate = useNavigate();

    const categories = [
        { name: "Electronics", icon: "📱" },
        { name: "Fashion", icon: "👕" },
        { name: "Beauty", icon: "💄" },
        { name: "Furniture", icon: "🛋️" },
        { name: "Books", icon: "📚" },
        { name: "Sports", icon: "🏀" },
    ];

    const featuredProducts = [
        {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        rating: "⭐⭐⭐⭐☆",
        price: 1999,
        image: Headphones,
        },
        {
        id: 2,
        name: "Summer Dress",
        category: "Fashion",
        rating: "⭐⭐⭐⭐⭐",
        price: 3799,
        image: Dress,
        },
        {
        id: 3,
        name: "Bluetooth Speaker",
        category: "Electronics",
        rating: "⭐⭐⭐⭐☆",
        price: 1499,
        image: Speaker,
        },
        {
        id: 4,
        name: "Gaming Mouse",
        category: "Electronics",
        rating: "⭐⭐⭐⭐☆",
        price: 999,
        image: Mouse,
        },
        
    ];

    return (
        <>
        <Navbar />

        <div className="home-container">

            {/* Hero */}

            <section className="hero-section">

            <div className="hero-content">

                <h1>Welcome to GrandMart</h1>

                <p>
                Discover premium products with exciting offers and fast delivery.
                </p>

                <div className="hero-buttons">

                {/* <button onClick={() => navigate("/products")}>
                    Shop Now
                </button> */}

                <button
                    className="outline-btn"
                    onClick={() => navigate("/products")}
                >
                    Explore Products
                </button>

                </div>

            </div>

            </section>

            {/* Categories */}

            <section className="category-section">

            <h2>Browse by Category</h2>

            <div className="category-grid">

                {categories.map((category) => (
                <div
                    className="category-card"
                    key={category.name}
                    onClick={() =>
                    navigate(`/products?category=${category.name}`)
                    }
                >
                    <span>{category.icon}</span>

                    <h3>{category.name}</h3>
                </div>
                ))}

            </div>

            </section>

            {/* Featured */}

            <section className="featured-products">

            <h2>Featured Products</h2>

            <div className="product-grid">

                {featuredProducts.map((product) => (

                <div className="product-card" key={product.id}>
                    <div className="img-wrap">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <h3>{product.name}</h3>
                    <p className="rating">{product.rating}</p>
                    <p className="category">{product.category}</p>
                    <p className="price">₹{product.price}</p>
                    <button
                    onClick={() => navigate(`/product-details/${product.id}`)}>
View Details
</button>
                </div>

                ))}

            </div>

            </section>

            {/* Offer */}

            <section className="offer-banner">

            <h2>🔥 Grand Sale - Up to 70% OFF 🔥</h2>

            <p>
                Grab today's best deals before they are gone.
            </p>

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