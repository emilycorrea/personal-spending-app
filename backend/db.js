// Import sqlite3 module with verbose mode for detailed error messages
const sqlite3 = require('sqlite3').verbose();
// Import path module to handle file paths across different OS
const path = require('path');

// construct absolute path to the database file in the same directory as this script
const dbPath = path.join(__dirname, 'spending.db');

// Create or open SQLite database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Execute database operations sequentially
db.serialize(() => {
    // Create expenses table if it doesn't already exist
    db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique identifier, auto-incremented
            name TEXT NOT NULL,              -- expense name, required
            amount REAL NOT NULL,                   -- expense amount, required
            category TEXT NOT NULL,                          -- expense category, required
            date TEXT NOT NULL,                     -- expense date, required
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- Auto-populated timestamp
        )
    `);
});



// Export database instance for use in other modules
module.exports = db;

