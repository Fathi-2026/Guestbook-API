const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

// ✅ PostgreSQL Connection
const pool = new Pool({
  user: "postgres",
  host: "guestbook-db",   // <-- container name of the DB
  database: "guestbook",
  password: "pass123",
  port: 5432,
});

// Test route
app.get("/", (req, res) => {
  res.send("Guestbook API connected to PostgreSQL 🚀");
});

// GET all messages
app.get("/messages", async (req, res) => {
  const result = await pool.query("SELECT * FROM messages ORDER BY id DESC");
  res.json(result.rows);
});

// POST a new message
app.post("/messages", async (req, res) => {
  const { name, message } = req.body;
  const result = await pool.query(
    "INSERT INTO messages (name, message) VALUES ($1, $2) RETURNING *",
    [name, message]
  );
  res.json(result.rows[0]);
});

const PORT = 3000;
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));