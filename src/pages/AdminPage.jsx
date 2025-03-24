import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './AdminPage.css';

const AdminPage = () => {
  const [requests, setRequests] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [totalWaste, setTotalWaste] = useState(0);
  const [recyclableWaste, setRecyclableWaste] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchWasteData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/waste-data");
        console.log("✅ Waste data received:", response.data);

        let wasteData = response.data;
        let total = wasteData.reduce((sum, item) => sum + item.plastic_kg + item.electronic_kg + item.bio_kg, 0);
        let recyclable = wasteData.reduce((sum, item) => sum + (item.recycle_percentage / 100) * total, 0);
        let totalRs = wasteData.reduce((sum, item) => sum + item.amount, 0);

        setTotalWaste(total);
        setRecyclableWaste(recyclable);
        setTotalAmount(totalRs);
      } catch (error) {
        console.error("❌ Error fetching waste data:", error);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/waste-requests");
        setRequests(response.data);
      } catch (error) {
        console.error("❌ Error fetching requests:", error);
      }
    };

    const fetchBillingHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/billing-history");
        setBillingHistory(response.data);
      } catch (error) {
        console.error("❌ Error fetching billing history:", error);
      }
    };

    fetchWasteData();
    fetchRequests();
    fetchBillingHistory();
  }, []);

  const handleApproveRequest = async (requestId, userId) => {
    try {
      await axios.post("http://localhost:5000/admin/approve-request", { request_id: requestId, user_id: userId });
      alert("✅ Waste collection approved and bill sent!");
      setRequests(prev => prev.filter(req => req.request_id !== requestId));
    } catch (error) {
      alert("❌ Failed to approve request.");
    }
  };

  return (
    <div className="admin-container">
      <h1>🏡 Admin Dashboard</h1>

      {/* Waste Collection Overview */}
      <div className="progress-container">
        <div className="progress-item">
          <h3>Total Waste Collected (kg)</h3>
          <CircularProgressbar 
            value={totalWaste} 
            maxValue={Math.max(totalWaste, 1000)} 
            text={`${totalWaste} kg`} 
            styles={buildStyles({ textSize: '14px', pathColor: 'green', textColor: 'black' })} 
          />
        </div>
        <div className="progress-item">
          <h3>Recyclable Waste (kg)</h3>
          <CircularProgressbar 
            value={recyclableWaste} 
            maxValue={Math.max(totalWaste, 1)} 
            text={`${recyclableWaste.toFixed(2)} kg`} 
            styles={buildStyles({ textSize: '14px', pathColor: 'orange', textColor: 'black' })} 
          />
        </div>
        <div className="progress-item">
          <h3>Amount Generated (₹)</h3>
          <CircularProgressbar 
            value={totalAmount} 
            maxValue={Math.max(totalAmount, 50000)} 
            text={`₹${totalAmount}`} 
            styles={buildStyles({ textSize: '14px', pathColor: 'blue', textColor: 'black' })} 
          />
        </div>
      </div>

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
