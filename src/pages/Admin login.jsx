import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormStyles.css';

const AdminLogin = () => {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/admin/login', {
                admin_id: adminId,
                password: password
            });

            if (response.data.success) {
                localStorage.setItem("adminLoggedIn", true);
                localStorage.setItem("adminId", adminId); // Store admin ID
                navigate('/admin-dashboard'); // ✅ Redirect after login
            } else {
                setError('Invalid admin ID or password');
            }
        } catch (error) {
            console.error("Login Error:", error);
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h2>Admin Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
