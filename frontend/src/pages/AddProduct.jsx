import { useState, useEffect } from "react";
import { useNavigate ,useParams} from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./AddProduct.css";

export default function AddProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id; 

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  const [productImage, setProductImage] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await api.get("categories/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
  if (!isEdit) return;

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await api.get(`products/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      setFormData({
        product_name: data.product_name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        description: data.description,
      });
    } catch (error) {
      console.error(error);
    }
  };

  fetchProduct();
}, [id, isEdit]);

  // handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setProductImage(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.product_name ||
      !formData.price ||
      !formData.category ||
      !formData.stock
    ) {
      setMessage("Please fill all required fields.");
      setMessageType("error");
      return;
    }

    try {
      const token = localStorage.getItem("access");

      const data = new FormData();

      data.append("product_name", formData.product_name);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("description", formData.description);

      if (productImage) {
        data.append("image", productImage);
      }

        const url = isEdit
      ? `products/${id}/`
      : "addproducts/";

    const method = isEdit ? "PUT" : "POST";

    const response = await api({
      url,
      method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data,
      });

      if (response.status >= 200 && response.status < 300) {
      setMessage(
        isEdit
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
        setMessageType("success");

        setFormData({
          product_name: "",
          category: "",
          price: "",
          stock: "",
          description: "",
        });

        setProductImage(null);

        setTimeout(() => navigate("/vendor-dashboard"), 1200);
      } else {
        const errorData = response.data || {};
        console.error(errorData);

        setMessage("Failed to add product. Please check details.");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Check connection.");
      setMessageType("error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="add-product-page">
        <div className="add-product-card">
          <div className="add-product-header">
            <h2>{isEdit ? "Edit Product" : "Add New Product"}</h2>

            <button
              className="back-btn"
              onClick={() => navigate("/vendor-dashboard")}
            >
              ← Back to Dashboard
            </button>
          </div>

          {message && (
            <div className={`form-message ${messageType}`}>
              {message}
            </div>
          )}

          <form className="add-product-form" onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name || cat.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div className="form-group full-width">
                <label>Product Image</label>

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />

                {productImage && (
                  <p className="selected-file">
                    Selected: <b>{productImage.name}</b>
                  </p>
                )}
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                  {isEdit ? "Update Product" : "Add Product"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/vendor-dashboard")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}