import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const addToCart = () => {
        // Simple alert for now, or assume guest user
        const userId = localStorage.getItem('userId') || 'guest';
        fetch('http://localhost:5000/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, productId: id, quantity })
        })
            .then(res => res.json())
            .then(data => alert(data.message))
            .catch(err => console.error(err));
    };

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="product-details-container">
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

            <div className="product-content">
                {/* Left Column: Image Gallery */}
                <div className="product-gallery">
                    <img
                        src={product.image?.startsWith('http') ? product.image : `http://localhost:5000${product.image}`}
                        alt={product.name}
                        className="main-product-image"
                    />

                    <div className="thumbnail-list">
                        <img src={product.image?.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} alt="thumb" className="thumbnail" />
                    </div>
                </div>


                {/* Right Column: Product Info */}
                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-price">Price : {product.priceStr}</p>

                    <p className="product-description">
                        {product.description}
                    </p>

                    <ul className="product-specs">
                        {product.details && Object.entries(product.details).map(([key, value]) => (
                            <li key={key}><strong>{key}:</strong> {value}</li>
                        ))}
                    </ul>

                    <div className="quantity-selector">
                        <button onClick={handleDecrement}>-</button>
                        <span>{quantity}</span>
                        <button onClick={handleIncrement}>+</button>
                    </div>

                    <div className="product-actions">
                        <button className="btn-add-cart" style={{ flexGrow: 1 }} onClick={addToCart}>Add to Cart</button>
                        <button className="btn-wishlist"></button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ProductDetails;
