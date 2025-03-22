import React, { useState } from 'react';
import './UserPage.css';

const UserPage = () => {
  
  const [billingDetails, setBillingDetails] = useState({
    house_number: 101,
    user_name: 'John Doe',
    bill_month: 'March',
    amount_due: 500,
    bill_no: 'B123',
    payment_status: 'Unpaid'
  });

  const [requestSent, setRequestSent] = useState(false);

  const handleRequestCollection = () => {
    setRequestSent(true);
    alert('Waste collection request sent!');
  };

  return (
    <div className="user-container">
      <h1>🏡 Welcome, {billingDetails.user_name}</h1>

      <div className="billing-card">
        <h2>Billing Details</h2>
        <p><strong>House Number:</strong> {billingDetails.house_number}</p>
        <p><strong>Month:</strong> {billingDetails.bill_month}</p>
        <p><strong>Bill Number:</strong> {billingDetails.bill_no}</p>
        <p><strong>Amount Due:</strong> ₹{billingDetails.amount_due}</p>
        <p><strong>Status:</strong> {billingDetails.payment_status}</p>
      </div>

      <button className="request-btn" onClick={handleRequestCollection} disabled={requestSent}>
        {requestSent ? 'Request Sent ✅' : 'Request Waste Collection'}
      </button>
    </div>
  );
};

export default UserPage;
