const cors = require("cors");
const db = require("./db");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
// Welcome route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the server" });
});


// GET spending summary by category
app.get("/expenses/summary", (req, res) => {
  db.all(
    "SELECT category, SUM(amount) as total FROM expenses GROUP BY category",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// GET all expenses
app.get("/expenses", (req, res) => {
  db.all("SELECT * FROM expenses ORDER BY date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST a new expense
app.post("/expenses", (req, res) => {
  const { name, amount, category, date } = req.body;

  if (!name || !amount || !category || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `INSERT INTO expenses (name, amount, category, date) VALUES (?, ?, ?, ?)`;

  db.run(sql, [name, amount, category, date], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, amount, category, date });
  });
});

// DELETE all expenses — must come BEFORE /:id route
app.delete("/expenses", (req, res) => {
  db.run("DELETE FROM expenses", [], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "All expenses deleted successfully" });
  });
}); 
// DELETE a single expense by ID
app.delete("/expenses/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM expenses WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Expense deleted successfully" });
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
