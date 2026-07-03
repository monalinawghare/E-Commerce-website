import { Link, useNavigate} from "react-router-dom";
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

    // Handle search when Enter is pressed or search button is clicked
    const handleSearch = (e) => {
        if (e.key === "Enter" || e.type === "click") {
            e.preventDefault();
            if (searchQuery.trim()) {
                navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
                setSearchQuery("");
                setIsMenuOpen(false);
            }
        }
    };

    return (
        <nav className="navbar">
        <div className="logo">
            <Link to="/home">
            <img src="/images/logo.png" alt="GrandMart Logo"/>
            <span>GrandMart</span>
            </Link>
        </div>

        <div className="search-bar">
            <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
            />
            <button onClick={handleSearch} className="search-btn">🔍</button>
        </div>

        <button className="hamburger" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/home" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>Cart</Link>
            <Link to="/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Profile</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>

            <button className="logout-btn" onClick={handleLogout}>
            Logout
        </button>
        </div>
        </nav>
    );
    }

export default Navbar;