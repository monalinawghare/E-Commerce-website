import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import "./Category.css";

export default function Category() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [image, setImage] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setMessage("Please enter category name.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("category_name", categoryName);

      if (image) {
        formData.append("image", image);
      }

      await api.post("categories/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Category added successfully!");
      setMessageType("success");

      setCategoryName("");
      setImage(null);

      fetchCategories();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.detail || "Failed to add category."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await api.delete(`categories/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories((prev) =>
        prev.filter((cat) => cat.id !== id)
      );

      setMessage("Category deleted successfully!");
      setMessageType("success");
    } catch (error) {
      console.error(error);

      setMessage("Failed to delete category.");
      setMessageType("error");
    }
  };

  return ( <>
  <Navbar />

  <div className="category-page">
    <div className="category-card">

      <div className="category-header">
        <h2>Manage Categories</h2>

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

      <form
        className="category-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Enter Category Name"
          value={categoryName}
          onChange={(e) =>
            setCategoryName(e.target.value)
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
        />

        {image && (
          <div className="image-preview">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
            />
            <p>{image.name}</p>
          </div>
        )}

        <button
          type="submit"
          className="add-btn"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>

      <div className="category-list">
        <h3>Existing Categories</h3>

        {categories.length === 0 ? (
          <p className="empty-text">
            No categories available.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Category Name</th>
                <th>Created On</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat.id}>
                  <td>{index + 1}</td>

                  <td>
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.category_name}
                        className="category-image"
                    />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>

                  <td>{cat.category_name}</td>

                  <td>
                    {cat.created_at
                      ? new Date(
                          cat.created_at
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(cat.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  </div>
</>
);
}
