import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="success-container">
            <div className="success-card">
                <div className="success-icon-wrapper">
                    <div className="success-icon">✓</div>
                </div>

                <h2 className="success-title">Payment Successful !</h2>

                <p className="success-message">
                    Thank you for shopping with us. <br />
                    Your jewellery order has been placed.
                </p>

                <p className="order-id">Order ID : #Pearl123456</p>

                <button className="btn-go-home" onClick={() => navigate('/home')}>Go to Home</button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
