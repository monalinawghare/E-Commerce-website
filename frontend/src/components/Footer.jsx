    import "./Footer.css";
    import { Link } from "react-router-dom";

    function Footer() {
    const scrollToTop = () => {
        window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
        });
    };

    return (
        <footer className="site-footer">
        <div className="footer-container">
            <div className="footer-section">
            <h2>GrandMart</h2>
            <p>
                Your one-stop destination for quality products at affordable prices.
            </p>
            </div>

            <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
                <li>
                <Link to="/home" onClick={scrollToTop}>
                    Home
                </Link>
                </li>

                <li>
                <Link to="/cart" onClick={scrollToTop}>
                    Cart
                </Link>
                </li>

                <li>
                <Link to="/orders" onClick={scrollToTop}>
                    Orders
                </Link>
                </li>

                <li>
                <Link to="/products" onClick={scrollToTop}>
                    Products
                </Link>
                </li>
            </ul>
            </div>

            <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@grandmart.com</p>
            <p>Phone: +91 8574895898</p>
            <p>Nagpur, Maharashtra</p>
            </div>
        </div>

        <div className="footer-bottom">
            © 2026 GrandMart. All Rights Reserved.
        </div>
        </footer>
    );
    }

    export default Footer;