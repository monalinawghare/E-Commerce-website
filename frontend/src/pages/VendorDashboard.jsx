import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function VendorDashboard() {
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

    const vendorName = user?.username || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "";

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({
        vendor_name: vendorName,
        category: "",
        product_name: "",
        description: "",
        price: "",
        stock: "",
    });

    useEffect(() => {
        if (!user) {
        navigate("/");
        return;
        }

        const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
            api.get("products/"),
            api.get("categories/"),
            ]);

            const productList = Array.isArray(productsRes.data)
            ? productsRes.data
            : productsRes.data?.results || [];
            const categoryList = Array.isArray(categoriesRes.data)
            ? categoriesRes.data
            : categoriesRes.data?.results || [];

            const vendorProducts = productList.filter(
            (item) => item.vendor_name === (user.username || user.first_name || "")
            );

            setProducts(vendorProducts);
            setCategories(categoryList);
        } catch {
            setError("Unable to load vendor dashboard data.");
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [navigate, user]);

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (error) setError("");
        if (success) setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.product_name || !form.description || !form.category || !form.price || !form.stock) {
        setError("Please fill in all product fields.");
        return;
        }

        try {
        const payload = {
            vendor_name: form.vendor_name || user?.username || "Vendor",
            category: Number(form.category),
            product_name: form.product_name,
            description: form.description,
            price: Number(form.price),
            stock: Number(form.stock),
        };

        const response = await api.post("products/", payload);
        setProducts((prev) => [response.data, ...prev]);
        setSuccess("Product added successfully.");
        setError("");
        setForm({
            vendor_name: form.vendor_name,
            category: "",
            product_name: "",
            description: "",
            price: "",
            stock: "",
        });
        } catch (err) {
        const serverError = err.response?.data;
        if (serverError) {
            const firstMessage = Object.values(serverError)[0];
            setError(Array.isArray(firstMessage) ? firstMessage[0] : "Failed to add product.");
        } else {
            setError("Server error. Please try again.");
        }
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f6f7fb", padding: "32px 20px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
                <h1 style={{ margin: 0, color: "#111827" }}>Vendor Dashboard</h1>
                <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
                Welcome back, {user?.first_name || user?.username || "vendor"}
                </p>
            </div>
            <button
                onClick={handleLogout}
                style={{ padding: "10px 16px", border: "none", borderRadius: "8px", background: "#ed4b0a", color: "white", cursor: "pointer" }}
            >
                Logout
            </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                <p style={{ margin: 0, color: "#6b7280" }}>Products Listed</p>
                <h2 style={{ margin: "8px 0 0", fontSize: "28px" }}>{products.length}</h2>
            </div>
            <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                <p style={{ margin: 0, color: "#6b7280" }}>Available Stock</p>
                <h2 style={{ margin: "8px 0 0", fontSize: "28px" }}>
                {products.reduce((sum, item) => sum + Number(item.stock || 0), 0)}
                </h2>
            </div>
            <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                <p style={{ margin: 0, color: "#6b7280" }}>Categories</p>
                <h2 style={{ margin: "8px 0 0", fontSize: "28px" }}>{categories.length}</h2>
            </div>
            </div>

            <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "1.1fr 0.9fr" }}>
            <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                <h3 style={{ marginTop: 0 }}>Add New Product</h3>
                <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gap: "12px" }}>
                    <input
                    type="text"
                    name="vendor_name"
                    value={form.vendor_name}
                    onChange={handleChange}
                    placeholder="Vendor name"
                    style={inputStyle}
                    />
                    <select name="category" value={form.category} onChange={handleChange} style={inputStyle}>
                    <option value="">Select category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                        {category.name}
                        </option>
                    ))}
                    </select>
                    <input
                    type="text"
                    name="product_name"
                    value={form.product_name}
                    onChange={handleChange}
                    placeholder="Product name"
                    style={inputStyle}
                    />
                    <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Product description"
                    rows="3"
                    style={{ ...inputStyle, resize: "vertical" }}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Price"
                        min="1"
                        step="0.01"
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        placeholder="Stock"
                        min="0"
                        style={inputStyle}
                    />
                    </div>
                </div>

                {error && <p style={{ color: "#ed4b0a", fontSize: "13px", marginTop: "12px" }}>{error}</p>}
                {success && <p style={{ color: "#16a34a", fontSize: "13px", marginTop: "12px" }}>{success}</p>}

                <button type="submit" style={{ marginTop: "16px", padding: "10px 16px", border: "none", borderRadius: "8px", background: "#111827", color: "white", cursor: "pointer" }}>
                    Add Product
                </button>
                </form>
            </div>

            <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0 }}>Your Products</h3>
                {loading && <span style={{ color: "#6b7280" }}>Loading...</span>}
                </div>

                {!loading && products.length === 0 && (
                <p style={{ color: "#6b7280" }}>No products added yet.</p>
                )}

                <div style={{ display: "grid", gap: "12px" }}>
                {products.map((product) => (
                    <div key={product.id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                        <strong>{product.product_name}</strong>
                        <span style={{ color: "#ed4b0a", fontWeight: 600 }}>${Number(product.price).toFixed(2)}</span>
                    </div>
                    <p style={{ margin: "6px 0", color: "#6b7280" }}>{product.description}</p>
                    <small style={{ color: "#111827" }}>Stock: {product.stock}</small>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>
        </div>
    );
    }

    const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    boxSizing: "border-box",
    };

    export default VendorDashboard;
