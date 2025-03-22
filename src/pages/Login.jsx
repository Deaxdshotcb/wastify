import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export const Login = () => {
  return (
    <div className="login-container">
      <h2>Welcome to Wastify</h2>
      <p>Please choose an option to continue</p>
      <div className="login-options">
        <Link to="/login/user" className="login-btn">User Login</Link>
        <Link to="/login/admin" className="login-btn">Admin Login</Link>
        <Link to="/login/signup" className="login-btn">Sign Up</Link>
      </div>
    </div>
  );
};


