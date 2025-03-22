import React, { useState } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  
  const [houseData, setHouseData] = useState([
    {
      house_number: 101,
      user_name: 'John Doe',
      collection_request: true,
      amount_paid: 500,
      bill_no: 'B123',
      billing_month: 'March'
    },
    {
      house_number: 102,
      user_name: 'Jane Smith',
      collection_request: false,
      amount_paid: 450,
      bill_no: 'B124',
      billing_month: 'March'
    }
  ]);

  
  const [financeData, setFinanceData] = useState([
    {
      month: 'March',
      amount_received: 2000,
      fuel_cost: 300,
      labour_cost: 500,
      transport_cost: 200
    }
  ]);

  return (
    <div className="admin-container">
      <h1>🏡 Admin Dashboard</h1>

      <h2>House Details</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>House #</th>
            <th>User Name</th>
            <th>Request</th>
            <th>Amount Paid</th>
            <th>Bill No</th>
            <th>Month</th>
          </tr>
        </thead>
        <tbody>
          {houseData.map((house, idx) => (
            <tr key={idx}>
              <td>{house.house_number}</td>
              <td><input value={house.user_name} /></td>
              <td>
                <select defaultValue={house.collection_request ? 'Yes' : 'No'}>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </td>
              <td><input value={house.amount_paid} /></td>
              <td><input value={house.bill_no} /></td>
              <td>{house.billing_month}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Monthly Finance Summary</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Amount Received</th>
            <th>Fuel Cost</th>
            <th>Labour Cost</th>
            <th>Transport Cost</th>
            <th>Total Revenue</th>
            <th>Total Profit</th>
          </tr>
        </thead>
        <tbody>
          {financeData.map((fin, idx) => {
            const totalExpenses = fin.fuel_cost + fin.labour_cost + fin.transport_cost;
            const revenue = fin.amount_received - totalExpenses;
            const profit = revenue; 
            return (
              <tr key={idx}>
                <td>{fin.month}</td>
                <td><input value={fin.amount_received} /></td>
                <td><input value={fin.fuel_cost} /></td>
                <td><input value={fin.labour_cost} /></td>
                <td><input value={fin.transport_cost} /></td>
                <td>{revenue}</td>
                <td>{profit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
