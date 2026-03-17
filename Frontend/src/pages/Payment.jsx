import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';

const Payment = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5000/api/cart/${userId}`)
                .then(res => res.json())
                .then(data => {
                    const mappedItems = data.map(item => ({
                        id: item.productId,
                        name: item.product.name,
                        price: item.product.price,
                        qty: item.quantity
                    }));
                    setCartItems(mappedItems);
                })
                .catch(err => console.error(err));
        }
    }, [userId]);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const tax = 1800;
    const total = subtotal + tax;

    const handlePayNow = async () => {
        // Post order to backend
        try {
            const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, items: cartItems, total })
            });
            if (res.ok) {
                navigate('/payment-success');
            } else {
                alert('Payment failed');
            }
        } catch (err) {
            console.error(err);
            alert('Payment error');
        }
    };

    return (
        <div className="payment-container">
            <h1 className="payment-page-title">Payment</h1>

            <div className="payment-card">
                <h2 className="payment-summary-title">Order Summary</h2>

                <div className="summary-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="summary-row">
                            <span>{item.name} x {item.qty}</span>
                            <span>Price : ₹ {(item.price * item.qty).toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                <div className="price-breakdown">
                    <div className="breakdown-row">
                        <span>Subtotal : ₹ {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row">
                        <span>Tax : ₹ {tax.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row">
                        <span>Delivery : Free</span>
                    </div>
                </div>

                <div className="total-payable">
                    <span>Total Payable : ₹ {total.toLocaleString()}</span>
                </div>

                <div className="payment-method-section">
                    <h3>Payment Method</h3>
                    <div className="payment-method-placeholder">
                        Paytm Wallet / UPI / Card
                    </div>
                </div>

                <button className="btn-pay-now" onClick={handlePayNow}>Pay Now</button>
            </div>
        </div>
    );
};

export default Payment;
