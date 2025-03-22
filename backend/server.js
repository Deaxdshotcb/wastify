const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'waste_management_system'
};

let db;

function handleDisconnect() {
    db = mysql.createConnection(dbConfig);

    db.connect(err => {
        if (err) {
            console.error("Database connection failed.", err);
        } else {
            console.log("✅ MySQL Connected...");
        }
    });

    db.on('error', err => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error("🔄 Connection lost. Reconnecting...");
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect(); // Start MySQL connection management

// Admin Login Route
app.post('/admin/login', (req, res) => {
    const { admin_id, password } = req.body;
    console.log("Received Admin Login Request:", req.body);

    if (!db) {
        return res.status(500).json({ message: "Database connection error" });
    }

    const sql = "SELECT * FROM admins WHERE admin_id = ?";
    db.query(sql, [admin_id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (result.length > 0) {
            const storedPassword = result[0].password;
            if (storedPassword === password) {
                res.json({ success: true, message: "Login successful!" });
            } else {
                res.status(401).json({ message: "Invalid ID or password" });
            }
        } else {
            res.status(401).json({ message: "Invalid ID or password" });
        }
    });
});

// User Signup Route
app.post('/signup', (req, res) => {
    const { full_name, house_number, email, password } = req.body;
    if (!full_name || !house_number || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'INSERT INTO users (full_name, house_number, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [full_name, house_number, email, password], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
