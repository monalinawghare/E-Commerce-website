import { useState, useEffect,} from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Category.css";

export default function Category() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access");
  console.log("Access Token:", token);
  console.log("Category:", categoryName);
  console.log("Token being sent:", token);

  const fetchCategories = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/category_list/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("GET Status:", response.status);

    const data = await response.json();
    console.log("GET Response:", data);

    if (response.ok) {
      setCategories(data);
    }
  } catch (error) {
    console.error("Failed to load categories:", error);
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!categoryName.trim()) {
    setMessage("Please enter a category name.");
    setMessageType("error");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://127.0.0.1:8000/addcategory/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category_name: categoryName.trim(),
      }),
    });

    console.log("Status:", response.status);

    const data = await response.json().catch(() => ({}));
    console.log("Response:", data);

    if (response.ok) {
      setMessage("Category added successfully!");
      setMessageType("success");
      setCategoryName("");
      fetchCategories();
    } else {
      if (response.status === 401) {
        setMessage("Unauthorized. Please login again.");
      } else if (response.status === 403) {
        setMessage("You don't have permission to add categories.");
      } else {
        setMessage(data.detail || JSON.stringify(data));
      }

      setMessageType("error");
    }
  } catch (error) {
    console.error("Request Error:", error);
    setMessage("Unable to connect to the server.");
    setMessageType("error");
  } finally {
    setLoading(false);
  }
};
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/categories/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } else {
        setMessage("Failed to delete category.");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while deleting.");
      setMessageType("error");
    }
  };

  return (
    <>
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
            <div className={`form-message ${messageType}`}>{message}</div>
          )}

          <form className="category-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              maxLength={100}
            />
            <button type="submit" className="add-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Category"}
            </button>
          </form>

          <div className="category-list">
            <h3>Existing Categories</h3>
            {categories.length === 0 ? (
              <p className="empty-text">No categories added yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category Name</th>
                    <th>Created On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, index) => (
                    <tr key={cat.id}>
                      <td>{index + 1}</td>
                      <td>{cat.category_name}</td>
                      <td>
                        {cat.created_at
                          ? new Date(cat.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(cat.id)}
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