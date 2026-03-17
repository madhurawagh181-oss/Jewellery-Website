import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';

const Shop = () => {
    // State for filtering and sorting
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceRange, setPriceRange] = useState(100000); // Max price
    const [sortBy, setSortBy] = useState("newest");
    const [wishlist, setWishlist] = useState([]);

    // Format currency to INR layout
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Handle heart click
    const toggleWishlist = (id) => {
        setWishlist(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Fetch products from backend
    useEffect(() => {
        fetch('https://jewellery-website-r6vt.onrender.com/api/products')
            .then(res => res.json())
            .then(data => {
                const mappedData = data.map(item => {
                    let cat = "Other";
                    if (item.details?.Stones === 'Diamonds') cat = 'Diamond';
                    else if (item.details?.Stones === 'Pearls') cat = 'Pearl';
                    else if (item.details?.Material === 'Gold') cat = 'Gold';
                    else if (item.details?.Material === 'Silver') cat = 'Silver';

                    return {
                        ...item,
                        category: cat,
                        isNew: true // Mocking 'new' status since DB lacks it
                    };
                });
                setAllProducts(mappedData);
                setProducts(mappedData);
            })
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    // Filter and Sort logic
    useEffect(() => {
        let result = [...allProducts];

        // Apply Search Filter
        if (searchQuery) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply Category Filter
        if (selectedCategory !== "All") {
            result = result.filter(product => product.category === selectedCategory);
        }

        // Apply Price Filter
        if (priceRange < 100000) {
            result = result.filter(product => product.price <= priceRange);
        }

        // Apply Sort
        if (sortBy === "price-low") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === "newest") {
            // Put 'isNew' items first as a mock "newest" sorting
            result.sort((a, b) => (a.isNew === b.isNew) ? 0 : a.isNew ? -1 : 1);
        }

        setProducts(result);
    }, [searchQuery, selectedCategory, priceRange, sortBy, allProducts]);

    return (
        <div className="shop-container">
            {/* Top Navigation Bar */}
            <nav className="shop-navbar">
                <Link to="/home" className="shop-logo">PearlPetal</Link>
                <div className="shop-nav-links">
                    <Link to="/home">Home</Link>
                    <Link to="/shop" className="active">Shop</Link>
                    <Link to="/cart">Cart</Link>
                    <Link to="/profile">Profile</Link>
                </div>
            </nav>

            {/* Header Banner */}
            <header className="shop-header-banner">
                <h1 className="luxury-text">Our Exquisite Collection</h1>
                <p>Discover timeless elegance and masterful craftsmanship</p>
            </header>

            {/* Main Shop Layout */}
            <main className="shop-main">

                {/* Left Filter Sidebar */}
                <aside className="shop-sidebar">
                    <div className="filter-group">
                        <h3 className="filter-title luxury-text">Categories</h3>
                        <div className="filter-options">
                            {["All", "Gold", "Silver", "Diamond", "Pearl"].map(cat => (
                                <label key={cat} className="filter-label">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === cat}
                                        onChange={() => setSelectedCategory(cat)}
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <h3 className="filter-title luxury-text">Price Range</h3>
                        <div className="price-slider-container">
                            <input
                                type="range"
                                min="5000"
                                max="100000"
                                step="5000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="price-range"
                            />
                            <div className="price-labels">
                                <span>₹5K</span>
                                <span>{priceRange >= 100000 ? '₹100K+' : `₹${priceRange / 1000}K`}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right Content Area */}
                <div className="shop-content">

                    {/* Search and Sort Toolbar */}
                    <div className="shop-toolbar">
                        <div className="search-bar-container">
                            {/* SVG Search Icon */}
                            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search our collection..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="sort-container">
                            <span className="sort-label">Sort by:</span>
                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="shop-product-grid">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product.id} className="shop-product-card">
                                    <div className="product-image-container">
                                        <button
                                            className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                                            onClick={() => toggleWishlist(product.id)}
                                            aria-label="Add to wishlist"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlist.includes(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </button>
                                        <img
                                            src={product.image.startsWith('http') ? product.image : `https://jewellery-website-r6vt.onrender.com${product.image}`}
                                            alt={product.name}
                                            className="shop-product-image"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="shop-product-info">
                                        <span className="shop-product-category">{product.category}</span>
                                        <h3 className="shop-product-name luxury-text">{product.name}</h3>

                                        <div className="shop-product-bottom">
                                            <span className="shop-product-price">{formatPrice(product.price)}</span>
                                            <Link to={`/product-details/${product.id}`}>
                                                <button className="shop-btn-details">View</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-products">
                                <h3>No Masterpieces Found</h3>
                                <p>We couldn't find any jewelry matching your exact refine. Please adjust your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Shop;