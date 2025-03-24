import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './WorkerPage.css';

const WorkerPage = () => {
  const workerName = localStorage.getItem('workerName') || 'Worker';
  const [wasteData, setWasteData] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [newWaste, setNewWaste] = useState({ day: '', month: '', year: '', plastic_kg: '', electronic_kg: '', bio_kg: '', amount: '' });
  const [newBill, setNewBill] = useState({ full_name: '', house_no: '', bill_no: '', bill_date: '', amount_due: '' });

  // Fetch waste and billing data
  useEffect(() => {
    axios.get('http://localhost:5000/api/waste')
      .then(res => setWasteData(res.data))
      .catch(() => alert('Waste data fetch failed'));

    axios.get('http://localhost:5000/api/billing')
      .then(res => setBillingData(res.data))
      .catch(() => alert('Billing data fetch failed'));
  }, []);

  // Waste Handlers
  const handleWasteChange = (e) => setNewWaste({ ...newWaste, [e.target.name]: e.target.value });

  const handleAddWaste = () => {
    const { plastic_kg, electronic_kg, bio_kg, amount } = newWaste;
    const total = parseFloat(plastic_kg) + parseFloat(electronic_kg) + parseFloat(bio_kg);
    const recycle_percentage = total > 0 ? ((parseFloat(plastic_kg) + parseFloat(electronic_kg)) / total) * 100 : 0;

    const waste = { ...newWaste, recycle_percentage, plastic_kg: parseFloat(plastic_kg), electronic_kg: parseFloat(electronic_kg), bio_kg: parseFloat(bio_kg), amount: parseFloat(amount) };

    axios.post('http://localhost:5000/api/waste', waste)
      .then(() => {
        alert('Waste added successfully!');
        setWasteData([...wasteData, waste]);
        setNewWaste({ day: '', month: '', year: '', plastic_kg: '', electronic_kg: '', bio_kg: '', amount: '' });
      })
      .catch(() => alert('Failed to add waste'));
  };

  // Billing Handlers
  const handleBillChange = (e) => setNewBill({ ...newBill, [e.target.name]: e.target.value });

  const handleAddBill = () => {
    const bill = {
      ...newBill,
      house_no: parseInt(newBill.house_no),
      amount_due: parseFloat(newBill.amount_due)
    };

    axios.post('http://localhost:5000/api/billing', bill)
      .then(() => {
        alert('Bill added successfully!');
        setBillingData([...billingData, bill]);
        setNewBill({ full_name: '', house_no: '', bill_no: '', bill_date: '', amount_due: '' });
      })
      .catch(() => alert('Failed to add bill'));
  };

  return (
    <div className="worker-container">
      <h1>👷 {workerName}'s Dashboard</h1>

      {/* Waste Table */}
      <h2>♻️ Waste Tracking</h2>
      <table className="worker-table">
        <thead>
          <tr><th>Day</th><th>Month</th><th>Year</th><th>Plastic (kg)</th><th>Electronic (kg)</th><th>Bio (kg)</th><th>Recycle %</th><th>Amount</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {wasteData.map((w, idx) => (
            <tr key={idx}>
              <td>{w.day}</td>
              <td>{w.month}</td>
              <td>{w.year}</td>
              <td>{w.plastic_kg}</td>
              <td>{w.electronic_kg}</td>
              <td>{w.bio_kg}</td>
              <td>{w.recycle_percentage}%</td>
              <td>₹{w.amount}</td>
            </tr>
          ))}

          {/* New Waste Entry Row */}
          <tr>
            <td><input name="day" value={newWaste.day} onChange={handleWasteChange} /></td>
            <td><input name="month" value={newWaste.month} onChange={handleWasteChange} /></td>
            <td><input name="year" value={newWaste.year} onChange={handleWasteChange} /></td>
            <td><input name="plastic_kg" value={newWaste.plastic_kg} onChange={handleWasteChange} /></td>
            <td><input name="electronic_kg" value={newWaste.electronic_kg} onChange={handleWasteChange} /></td>
            <td><input name="bio_kg" value={newWaste.bio_kg} onChange={handleWasteChange} /></td>
            <td>-</td>
            <td><input name="amount" value={newWaste.amount} onChange={handleWasteChange} /></td>
            <td><button onClick={handleAddWaste}>Add</button></td>
          </tr>
        </tbody>
      </table>

      {/* Billing Table */}
      <h2>💰 Billing Information</h2>
      <table className="worker-table">
        <thead>
          <tr><th>Full Name</th><th>House No</th><th>Bill No</th><th>Bill Date</th><th>Amount Due</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {billingData.map((b, idx) => (
            <tr key={idx}>
              <td>{b.full_name}</td>
              <td>{b.house_no}</td>
              <td>{b.bill_no}</td>
              <td>{b.bill_date}</td>
              <td>₹{b.amount_due}</td>
            </tr>
          ))}

          {/* New Bill Entry Row */}
          <tr>
            <td><input name="full_name" value={newBill.full_name} onChange={handleBillChange} /></td>
            <td><input name="house_no" value={newBill.house_no} onChange={handleBillChange} /></td>
            <td><input name="bill_no" value={newBill.bill_no} onChange={handleBillChange} /></td>
            <td><input type="date" name="bill_date" value={newBill.bill_date} onChange={handleBillChange} /></td>
            <td><input name="amount_due" value={newBill.amount_due} onChange={handleBillChange} /></td>
            <td><button onClick={handleAddBill}>Add</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WorkerPage;
