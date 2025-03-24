const express = require('express');
const mysql = require('mysql2');
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
app.post('/user/login', (req, res) => {
    const { email, password } = req.body;
    console.log("Received User Login Request:", req.body);

    if (!db) {
        return res.status(500).json({ message: "Database connection error" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error" });
        }
        if (result.length > 0) {
            const storedPassword = result[0].password;
            if (storedPassword === password) {
                res.json({ success: true, message: "Login successful!", user: result[0] });
            } else {
                res.status(401).json({ message: "Invalid email or password" });
            }
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    });
});

app.post('/user/details', (req, res) => {
    const { email } = req.body;
    console.log("🔍 Fetching user details for:", email);

    if (!email) return res.status(400).json({ message: "Email is required." });

    const sql = "SELECT user_id, full_name, house_number FROM users WHERE email = ?";
    db.query(sql, [email], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    });
});

app.post('/user/billing', (req, res) => {
    const { user_id } = req.body;
    console.log("🔍 Fetching billing details for user_id:", user_id);

    if (!user_id) return res.status(400).json({ message: "User ID is required." });

    const sql = "SELECT * FROM bills WHERE user_id = ? ORDER BY bill_id DESC LIMIT 1";
    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.json({ message: "No billing data found" }); // No billing record exists
        }
    });
});


app.post('/user/request-waste', (req, res) => {
    const { user_id } = req.body;
    console.log("🔍 Waste collection request received for user_id:", user_id);

    if (!user_id) return res.status(400).json({ message: "User ID is required." });

    const sql = "INSERT INTO waste_requests (user_id, status) VALUES (?, 'Pending')";
    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ success: true, message: "Waste collection request submitted!" });
    });
});

app.get('/admin/waste-requests', (req, res) => {
    const sql = `
        SELECT wr.request_id, u.user_id, u.house_number, u.full_name AS user_name, wr.status
        FROM waste_requests wr
        JOIN users u ON wr.user_id = u.user_id
        WHERE wr.status = 'Pending'`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error fetching waste requests:", err);
            return res.status(500).json({ message: "Database error" });
        }

        console.log("✅ Waste requests fetched:", result);
        res.json(result);
    });
});

app.post('/admin/approve-request', (req, res) => {
    const { request_id, user_id } = req.body;
    console.log(`🔍 Approving request ${request_id} for user ${user_id}`);

    if (!request_id || !user_id) {
        console.error("❌ Missing request_id or user_id!");
        return res.status(400).json({ message: "Request ID and User ID are required." });
    }

    // 1️⃣ Update waste request status to "Completed"
    const updateRequestSQL = "UPDATE waste_requests SET status = 'Completed' WHERE request_id = ?";
    
    db.query(updateRequestSQL, [request_id], (err, result) => {
        if (err) {
            console.error("❌ Error updating waste request:", err);
            return res.status(500).json({ message: "Database error while updating waste request" });
        }
        console.log(`✅ Waste request ${request_id} marked as Completed.`);

        // Fetch user details (full_name & house_number)
        const userSQL = "SELECT full_name, house_number FROM users WHERE user_id = ?";
        
        db.query(userSQL, [user_id], (err, userResult) => {
            if (err || userResult.length === 0) {
                console.error("❌ Error fetching user details:", err);
                return res.status(500).json({ message: "Database error while fetching user details" });
            }

            const { full_name, house_number } = userResult[0];

            // 2️⃣ Insert a new bill for the user
            const billAmount = 500; // Example billing amount
            const billDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            const billNo = `BILL${Date.now()}`;

            const insertBillSQL = `INSERT INTO bills (user_id, full_name, house_no, bill_no, bill_date, amount_due, payment_status) 
    VALUES (?, ?, ?, ?, ?, ?, 'Unpaid')
            `;

            db.query(insertBillSQL, [user_id, full_name, house_number, billNo, billDate, billAmount], (err, result) => {
                if (err) {
                    console.error("❌ Error inserting bill:", err);
                    return res.status(500).json({ message: "Database error while creating bill" });
                }
                console.log("✅ Bill created successfully.");
                res.json({ success: true, message: "Request approved and bill generated!" });
            });
        });
    });
});

// ✅ Admin Fetches Billing History
app.get('/admin/billing-history', (req, res) => {
    const sql = `
        SELECT b.bill_id, u.house_number, u.full_name AS user_name, 
                DATE_FORMAT(b.bill_date, '%d/%m/%y') AS bill_date, 
                b.bill_no, b.amount_due, b.payment_status
        FROM bills b
        JOIN users u ON b.user_id = u.user_id
        ORDER BY b.bill_id DESC`;

    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error fetching billing history:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(result);
    });
});

// ✅ User Fetches Their Billing History
app.post('/user/billing-history', (req, res) => {
    const { user_id } = req.body;
    console.log("🔍 Fetching billing history for user_id:", user_id);

    if (!user_id) return res.status(400).json({ message: "User ID is required." });

    const sql = "SELECT bill_id, user_id, DATE_FORMAT(bill_date, '%d/%m/%y') AS bill_date, amount_due, payment_status, bill_no FROM bills WHERE user_id = ? ORDER BY bill_id DESC";
    db.query(sql, [user_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(result);
    });
});

// ✅ User Pays Bill & Updates Payment Status
app.post('/user/pay-bill', (req, res) => {
    const { bill_id } = req.body;
    console.log(`💰 Marking bill ${bill_id} as Paid`);

    if (!bill_id) return res.status(400).json({ message: "Bill ID is required." });

    const sql = "UPDATE bills SET payment_status = 'Paid' WHERE bill_id = ?";
    db.query(sql, [bill_id], (err, result) => {
        if (err) {
            console.error("❌ Error updating payment status:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ success: true, message: "Payment successful!" });
    });
});

app.get('/api/waste', (req, res) => {
    const sql = "SELECT * FROM waste_data ORDER BY id DESC";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error fetching waste data:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(result);
    });
});

app.post('/api/waste', (req, res) => {
    const { day, month, year, plastic_kg, electronic_kg, bio_kg, amount } = req.body;
    if (!day || !month || !year || !amount) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "INSERT INTO waste_data (day, month, year, plastic_kg, electronic_kg, bio_kg, amount) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [day, month, year, plastic_kg, electronic_kg, bio_kg, amount], (err, result) => {
        if (err) {
            console.error("❌ Error adding waste data:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ success: true, message: "Waste data added successfully!" });
    });
});

app.put('/api/waste/:id', (req, res) => {
    const { id } = req.params;
    const { plastic_kg, electronic_kg, bio_kg, amount } = req.body;

    const sql = "UPDATE waste_data SET plastic_kg = ?, electronic_kg = ?, bio_kg = ?, amount = ? WHERE id = ?";
    db.query(sql, [plastic_kg, electronic_kg, bio_kg, amount, id], (err, result) => {
        if (err) {
            console.error("❌ Error updating waste data:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ success: true, message: "Waste data updated successfully!" });
    });
});

app.get('/api/billing', (req, res) => {
    const sql = "SELECT * FROM bills ORDER BY bill_id DESC";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Error fetching billing data:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(result);
    });
});

app.put('/api/billing/:id', (req, res) => {
    const { id } = req.params;
    const { full_name, house_no, bill_no, bill_date, bill_amount } = req.body;

    const sql = "UPDATE bills SET full_name = ?, house_no = ?, bill_no = ?, bill_date = ?, bill_amount = ? WHERE bill_id = ?";
    db.query(sql, [full_name, house_no, bill_no, bill_date, bill_amount, id], (err, result) => {
        if (err) {
            console.error("❌ Error updating billing data:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json({ success: true, message: "Billing data updated successfully!" });
    });
});

app.get("/admin/waste-summary", (req, res) => {
    const query = `
      SELECT 
        SUM(plastic_kg + electronic_kg + bio_kg) AS total_waste,
        SUM(recycle_percentage / 100 * (plastic_kg + electronic_kg + bio_kg)) AS total_recyclable,
        SUM(amount) AS total_amount
      FROM waste_data;
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("❌ Error fetching waste summary:", err);
        res.status(500).json({ error: "Database error" });
      } else {
        res.json(results[0]); // Send summary data
      }
    });
  });
  app.get('/admin/waste-data', (req, res) => {
    const query = `
      SELECT 
        SUM(plastic_kg + electronic_kg + bio_kg) AS total_waste,
        SUM(recycle_percentage / 100 * (plastic_kg + electronic_kg + bio_kg)) AS total_recyclable,
        SUM(amount) AS total_amount
      FROM waste_data;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Error fetching waste data:", err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results[0]); // Send summary data as JSON
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
