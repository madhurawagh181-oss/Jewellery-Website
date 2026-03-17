import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        fetch('https://jewellery-website-r6vt.onrender.com/api/products')
            .then(res => res.json())
            .then(data => setFeaturedProducts(data))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    return (
        <div className="home-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">PearlPetal</div>
                <div className="nav-links">
                    <Link to="/home">Home</Link>
                    <Link to="/shop">Shop</Link>
                    <Link to="/cart">Cart</Link>
                    <Link to="/profile">Profile</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <div className="collection-tag">New Jewellery collection</div>
                    <h1 className="hero-title">Luxury Jewellery <br /> Crafted for Elegance</h1>
                    <p className="hero-subtitle">Discover premium handcrafted jewellery design to make every moment shine.</p>
                    <div className="hero-buttons">
                        <button className="btn-primary">Shop Now</button>
                        <button className="btn-secondary">view Collection</button>
                    </div>
                </div>
            </header>

            {/* Featured Section */}
            <section className="featured-section">
                <h2 className="section-title">Featured Jewellery</h2>
                <div className="product-grid">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <img
                                src={product.image?.startsWith('http') ? product.image : `https://jewellery-website-r6vt.onrender.com${product.image}`}
                                alt={product.name}
                                className="product-image"
                            />
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <div className="product-footer">
                                    <span className="price">Price : {product.priceStr}</span>
                                    <Link to={`/product-details/${product.id}`}>
                                        <button className="btn-details">View Details</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
