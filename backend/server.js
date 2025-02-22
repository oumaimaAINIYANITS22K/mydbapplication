const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Required for file paths

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Serve static files from the 'public' folder
app.use(express.static('public'));

// Create or connect to SQLite database
const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');

        // Drop old users table (optional: use only if you want to reset)
        db.run("DROP TABLE IF EXISTS users", () => {
            console.log("Dropped old users table.");

            // Create new users table with name, age, and hobby
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                hobby TEXT NOT NULL
            )`, () => {
                insertDefaultUsers();
            });
        });
    }
});

// Function to insert default users with age and hobby
function insertDefaultUsers() {
    const users = [
        { name: "Alice Johnson", age: 25, hobby: "Reading" },
        { name: "Bob Smith", age: 30, hobby: "Gaming" },
        { name: "Charlie Brown", age: 22, hobby: "Hiking" }
    ];

    const stmt = db.prepare('INSERT INTO users (name, age, hobby) VALUES (?, ?, ?)');
    users.forEach(user => {
        stmt.run(user.name, user.age, user.hobby);
    });
    stmt.finalize();
    console.log("Inserted default users with age and hobby.");
}

// ✅ Homepage route (Redirects to index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Add a new user
app.post('/add-user', (req, res) => {
    const { name, age, hobby } = req.body;
    if (!name || !age || !hobby) {
        return res.status(400).json({ error: "All fields (name, age, hobby) are required!" });
    }

    db.run('INSERT INTO users (name, age, hobby) VALUES (?, ?, ?)', [name, age, hobby], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID, message: "User added successfully" });
        }
    });
});

// ✅ Get all users
app.get('/users', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// ✅ Delete a user
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
    console.log(`Server running at http://localhost:${port}`);
});
