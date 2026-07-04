import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VendorSignup from "./pages/VendorSignup";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import UserDashboard from "./pages/UserDashboard";
import VendorDashboard from "./pages/VendorDashboard";
<<<<<<< HEAD
// import Footer from "./components/Footer";
=======
import Checkout from "./pages/Checkout";

import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
>>>>>>> 72ac5b5b466d492260a1956419dbfdb57cd8df71

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/vendor-signup" element={<VendorSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard />} />
      </Routes>
<<<<<<< HEAD
      {/* <Footer /> */}
=======

      <Footer />
>>>>>>> 72ac5b5b466d492260a1956419dbfdb57cd8df71
    </BrowserRouter>
  );
}

export default App;