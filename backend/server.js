const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Create or connect to SQLite database
const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('✅ Connected to SQLite database');

        // 🔴 REMOVE THIS TO PREVENT DATA LOSS
        // db.run("DROP TABLE IF EXISTS users", () => { console.log("Dropped old users table."); });

        // Create new users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            job_title TEXT NOT NULL,
            email TEXT NOT NULL,
            experience INTEGER NOT NULL
        )`, () => {
            console.log("✅ Users table ready.");
        });
    }
});

// Get all users
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Add a new user
app.post('/add-user', (req, res) => {
    const { name, age, job_title, email, experience } = req.body;
    if (!name || !age || !job_title || !email || !experience) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    db.run('INSERT INTO users (name, age, job_title, email, experience) VALUES (?, ?, ?, ?, ?)',
        [name, age, job_title, email, experience], function (err) {
            if (err) {
                console.error("Database error:", err.message);
                res.status(500).json({ error: err.message });
            } else {
                console.log(`✅ User added: ${name}, ${age}, ${job_title}, ${email}, ${experience}`);
                res.json({ id: this.lastID, message: "User added successfully" });
            }
        });
});

// Delete a user
app.delete('/delete-user/:id', (req, res) => {
    db.run('DELETE FROM users WHERE id = ?', req.params.id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ message: "User not found" });
        } else {
            res.json({ deletedID: req.params.id, message: "User deleted successfully" });
        }
    });
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});

