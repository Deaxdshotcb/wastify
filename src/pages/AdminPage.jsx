import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);

  useEffect(() => {
    // Fetch pending waste collection requests
    axios.get("http://localhost:5000/admin/waste-requests")
      .then(response => {
        console.log("✅ Waste requests received:", response.data);
        setRequests(response.data);
      })
      .catch(error => {
        console.error("❌ Error fetching waste requests:", error.response ? error.response.data : error);
      });

    // Fetch billing history
    axios.get("http://localhost:5000/admin/billing-history")
      .then(response => {
        console.log("✅ Billing history received:", response.data);
        setBillingHistory(response.data);
      })
      .catch(error => {
        console.error("❌ Error fetching billing history:", error);
      });
  }, []);

  const handleApproveRequest = (requestId, userId) => {
    axios.post("http://localhost:5000/admin/approve-request", { request_id: requestId, user_id: userId })
      .then(response => {
        console.log("✅ Request approved:", response.data);
        alert("Waste collection approved and bill sent to the user!");
        setRequests(prevRequests => prevRequests.filter(req => req.request_id !== requestId)); // Remove approved request
      })
      .catch(error => {
        console.error("❌ Error approving request:", error);
        alert("Failed to approve request.");
      });
  };

  return (
    <div className="admin-container">
      <h1>🏡 Admin Dashboard</h1>

      {/* Pending Waste Collection Requests */}
      <h2>Pending Waste Collection Requests</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>House #</th>
            <th>User Name</th>
            <th>Request Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? requests.map((request, idx) => (
            <tr key={idx}>
              <td>{request.house_number}</td>
              <td>{request.user_name}</td>
              <td>{request.status}</td>
              <td>
                <button onClick={() => handleApproveRequest(request.request_id, request.user_id)}>
                  Approve ✅
                </button>
              </td>
            </tr>
          )) : <tr><td colSpan="4">No pending requests found.</td></tr>}
        </tbody>
      </table>

      {/* Billing History Section */}
      <h2>Billing History</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>House #</th>
            <th>User Name</th>
            <th>Bill Date</th>
            <th>Bill Number</th>
            <th>Amount Due</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {billingHistory.length > 0 ? billingHistory.map((bill, idx) => (
            <tr key={idx}>
              <td>{bill.house_number}</td>
              <td>{bill.user_name}</td>
              <td>{bill.bill_date}</td>
              <td>{bill.bill_no}</td>
              <td>₹{bill.amount_due}</td>
              <td>{bill.payment_status}</td>
            </tr>
          )) : <tr><td colSpan="6">No billing history available.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
