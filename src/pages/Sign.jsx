import React, { useState } from 'react';
import './FormStyles.css';

export const Sign = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    house_number: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Registered Successfully!');
        setFormData({ full_name: '', house_number: '', email: '', password: '' });
      } else {
        setMessage('Registration Failed: ' + data.error);
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
        <input type="text" name="house_number" placeholder="House Number" value={formData.house_number} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

