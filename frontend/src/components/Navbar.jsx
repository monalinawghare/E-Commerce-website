        import { Link, useNavigate } from "react-router-dom";
        import { useState } from "react";
        import "./Navbar.css";

        function Navbar() {
        const navigate = useNavigate();

        const [isMenuOpen, setIsMenuOpen] = useState(false);
        const [searchQuery, setSearchQuery] = useState("");

        const handleLogout = () => {
            navigate("/login");
            setIsMenuOpen(false);
        };

        const toggleMenu = () => {
            setIsMenuOpen(!isMenuOpen);
        };

        const handleSearch = (e) => {
            if (e.key === "Enter" || e.type === "click") {
            e.preventDefault();

            if (searchQuery.trim()) {
                navigate(
                `/products?search=${encodeURIComponent(searchQuery)}`
                );

                setSearchQuery("");
                setIsMenuOpen(false);
            }
            }
        };

    return (
    <nav className="navbar">

        {/* Logo */}
        <div className="logo">
        <Link to="/home">
            <img src="/images/logo.png" alt="GrandMart Logo" />
            <span>GrandMart</span>
        </Link>
        </div>

        {/* Search */}
        <div className="search-bar">
        <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
        />

        <button
            type="button"
            className="search-btn"
            onClick={handleSearch}
        >
            🔍
        </button>
        </div>

        {/* Hamburger */}
        <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Menu"
        >
        <span></span>
        <span></span>
        <span></span>
        </button>

        {/* Navigation */}
        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>

        <Link
            to="/home"
            onClick={() => setIsMenuOpen(false)}
        >
            Home
        </Link>

        <Link
            to="/products"
            onClick={() => setIsMenuOpen(false)}
        >
            Products
        </Link>

        <Link
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
        >
            Cart
        </Link>

        <Link
            to="/orders"
            onClick={() => setIsMenuOpen(false)}
        >
            Orders
        </Link>

        <Link
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
        >
            Profile
        </Link>

        <button
            className="logout-btn"
            onClick={handleLogout}
        >
            Logout
        </button>

        </div>

    </nav>
    );

    }

    export default Navbar;