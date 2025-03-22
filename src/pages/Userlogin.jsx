import React, { useState } from 'react';
import './FormStyles.css';

export const UserLogin = () => {
  const[email,setEmail]=useState('');
  const[password,setPassword]=useState('')
  return (
    <div className="form-container">
      <h2>User Login</h2>
      <form>
      <input type="email" placeholder="Email" required onChange={(e) => console.log(e.target.value)} />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

