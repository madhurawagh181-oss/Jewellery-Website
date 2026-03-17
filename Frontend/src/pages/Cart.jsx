import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            fetchCart();
        }
    }, [userId]);

    const fetchCart = async () => {
        try {
            const res = await fetch(`https://jewellery-website-r6vt.onrender.com/api/cart/${userId}`);
            const data = await res.json();
            const mappedItems = data.map(item => ({
                id: item.productId,
                name: item.product.name,
                price: item.product.price,
                image: item.product.image,
                qty: item.quantity
            }));
            setCartItems(mappedItems);
        } catch (err) {
            console.error('Error fetching cart:', err);
        }
    };

    const updateQty = async (productId, delta) => {
        const item = cartItems.find(i => i.id == productId);
        if (!item) return;
        const newQty = item.qty + delta;

        if (newQty <= 0) {
            removeItem(productId);
            return;
        }

        try {
            await fetch('https://jewellery-website-r6vt.onrender.com/api/cart/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId, quantity: newQty })
            });
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const removeItem = async (productId) => {
        // To remove, we can set quantity to 0 via update endpoint based on my implementation
        try {
            await fetch('https://jewellery-website-r6vt.onrender.com/api/cart/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, productId, quantity: 0 })
            });
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = 1800;
    const total = subtotal + tax;

    return (
        <div className="cart-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">PearlPetal</div>
                <div className="nav-links">
                    <Link to="/home">Home</Link>
                    <Link to="/shop">Shop</Link>
                    <Link to="/cart" className="active">Cart</Link>
                    <Link to="/profile">Profile</Link>
                </div>
            </nav>

            <div className="cart-content">
                <div className="cart-items-section">
                    <h2 className="page-title">My Cart</h2>
                    {cartItems.length === 0 ? <p>Your cart is empty.</p> : (
                        <div className="cart-list">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <img
                                        src={`https://jewellery-website-r6vt.onrender.com${item.image}`}
                                        alt={item.name}
                                        className="cart-product-image"
                                    />
                                    <div className="item-details">
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-price">Price : ₹{item.price.toLocaleString()}</p>
                                        <div className="item-actions">
                                            <div className="qty-control">
                                                <button onClick={() => updateQty(item.id, -1)}>-</button>
                                                <span>{item.qty}</span>
                                                <button onClick={() => updateQty(item.id, 1)}>+</button>
                                            </div>
                                            <button className="btn-remove" onClick={() => removeItem(item.id)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="price-details-section">
                    <div className="price-card">
                        <h3 className="price-title">Price Details</h3>
                        <div className="price-row">
                            <span>Subtotal :</span>
                            <span>₹ {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="price-row">
                            <span>Tax :</span>
                            <span>₹ {tax.toLocaleString()}</span>
                        </div>
                        <div className="price-row">
                            <span>Delivery :</span>
                            <span>Free</span>
                        </div>
                        <div className="divider"></div>
                        <div className="price-row total-row">
                            <span>Total Amount :</span>
                            <span>₹ {total.toLocaleString()}</span>
                        </div>
                        <Link to="/payment">
                            <button className="btn-checkout">Proceed to Payment</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
