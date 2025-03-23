import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './UserPage.css';

const UserPage = () => {
  const [userData, setUserData] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [requestSent, setRequestSent] = useState(false);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) {
      console.error("❌ No email found in localStorage!");
      return;
    }

    axios.post("http://localhost:5000/user/details", { email: userEmail })
      .then(response => {
        console.log("✅ User details received:", response.data);
        setUserData(response.data);

        axios.post("http://localhost:5000/user/billing-history", { user_id: response.data.user_id })
          .then(res => {
            console.log("✅ Billing history received:", res.data);
            setBillingHistory(res.data.length === 0 ? [] : res.data);
          })
          .catch(err => console.error("❌ Error fetching billing history:", err));
      })
      .catch(error => console.error("❌ Error fetching user details:", error));
  }, [userEmail]);

  const handleRequestCollection = () => {
    axios.post("http://localhost:5000/user/request-waste", { user_id: userData.user_id })
      .then(response => {
        console.log("✅ Waste collection request sent:", response.data);
        setRequestSent(true);
        alert("Waste collection request submitted!");
      })
      .catch(error => {
        console.error("❌ Error requesting waste collection:", error);
        alert("Failed to request waste collection.");
      });
  };

  const handlePayBill = (billId) => {
    axios.post("http://localhost:5000/user/pay-bill", { bill_id: billId })
      .then(response => {
        console.log("✅ Payment successful:", response.data);
        alert("Payment successful!");
        setBillingHistory(prevHistory =>
          prevHistory.map(bill => bill.bill_id === billId ? { ...bill, payment_status: "Paid" } : bill)
        );
      })
      .catch(error => {
        console.error("❌ Error processing payment:", error);
        alert("Failed to process payment.");
      });
  };

  return (
    <div className="user-container">
      <h1>Welcome, {userData ? userData.full_name : "User"}!</h1>
      <p>Here you can view your billing details, waste recycled, and request waste collection.</p>

      <div className="billing-container">
        {billingHistory.length > 0 ? billingHistory.map((bill, idx) => (
          <div className="billing-card" key={idx}>
            <h2>Billing Details</h2>
            <p><strong>House Number:</strong> {userData.house_number}</p>
            <p><strong>Date:</strong> {bill.bill_date}</p>
            <p><strong>Bill Number:</strong> {bill.bill_no}</p>
            <p><strong>Amount Due:</strong> ₹{bill.amount_due}</p>
            <p><strong>Status:</strong> {bill.payment_status}</p>
            {bill.payment_status === "Unpaid" && (
              <button className="pay-btn" onClick={() => handlePayBill(bill.bill_id)}>Pay Now 💰</button>
            )}
          </div>
        )) : (
          <p style={{ color: 'gray', fontStyle: 'italic' }}>No billing history available.</p>
        )}
      </div>

      <button className="request-btn" onClick={handleRequestCollection} disabled={requestSent || !userData}>
        {requestSent ? "Request Sent ✅" : "Request Waste Collection"}
      </button>
    </div>
  );
};

export default UserPage;
