import Navbar from "../components/Navbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { featuredProducts } from "../data/products";
import "./Products.css";

function Products() {
    const navigate = useNavigate();
    
    // Step 1: Read search parameters from URL
    const [searchParams] = useSearchParams();
    
    // Step 2: Extract the selected category and search query from URL
    // Example: /products?category=Electronics or /products?search=headphones
    const selectedCategory = searchParams.get("category");
    const searchQuery = searchParams.get("search");
    
    // Step 3: Filter products based on category and/or search query
    let filteredProducts = featuredProducts;
    
    // Filter by category if selected
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(
            product => product.category === selectedCategory
        );
    }
    
    // Filter by search query if provided
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    // Step 4: Determine the page heading dynamically
    // Show filtered title based on both category and search
    let pageTitle = "All Products";
    if (selectedCategory && searchQuery) {
        pageTitle = `${selectedCategory} - "${searchQuery}"`;
    } else if (selectedCategory) {
        pageTitle = `${selectedCategory} Products`;
    } else if (searchQuery) {
        pageTitle = `Search Results for "${searchQuery}"`;
    }

    return (
        <>
        <Navbar />

        <div className="products-container">
            {/* Dynamic heading based on selected category or search */}
            <h1>{pageTitle}</h1>

            {/* Show clear filters button if filters are active */}
            {(selectedCategory || searchQuery) && (
                <button 
                    onClick={() => navigate("/products")}
                    style={{
                        padding: "10px 20px",
                        marginBottom: "20px",
                        background: "#9b1648",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "block",
                        margin: "0 auto 20px"
                    }}
                >
                    ← Clear Filters
                </button>
            )}

            {/* Show product grid if products exist in selected category */}
            <div className="products-grid">
                {filteredProducts.length > 0 ? (
                    // Step 5: Render filtered products with preserved UI
                    // Each product maintains its image, name, price, and View Details button
                    filteredProducts.map((product) => (
                        <div className="product-card" key={product.id}>
                            <div className="img-wrap">
                                <img src={product.image} alt={product.name} />
                            </div>
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>
                            {/* Preserve navigation to Product Details page */}
                            <button onClick={() => navigate(`/product-details/${product.id}`)}>
                                View Details
                            </button>
                        </div>
                    ))
                ) : (
                    // Step 6: Show message when no products found
                    <div style={{
                        gridColumn: "1 / -1",
                        textAlign: "center",
                        padding: "40px 20px",
                        fontSize: "18px",
                        color: "#666"
                    }}>
                        <p>
                            {searchQuery 
                                ? `No products found for "${searchQuery}".`
                                : "No products available in this category."
                            }
                        </p>
                        <button 
                            onClick={() => navigate("/products")}
                            style={{
                                marginTop: "20px",
                                padding: "10px 20px",
                                background: "#9b1648",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            View All Products
                        </button>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}

export default Products;