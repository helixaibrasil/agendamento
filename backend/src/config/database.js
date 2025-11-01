const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database/agendamentos.db');

// Create database connection
const db = new Database(dbPath, {
  verbose: console.log
});

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

module.exports = db;
