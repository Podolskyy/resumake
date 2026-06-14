const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../resumake.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Initialize database schema
function initDb() {
  db.serialize(() => {
    // Resumes table — stores each saved resume profile
    db.run(`
      CREATE TABLE IF NOT EXISTS resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_name TEXT NOT NULL,
        active_tags TEXT,
        page_limit INTEGER DEFAULT 2,
        xml_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Compilation logs — tracks each compile run and its QA results
    db.run(`
      CREATE TABLE IF NOT EXISTS compilation_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resume_id INTEGER,
        active_tags TEXT,
        page_limit INTEGER,
        xsd_status TEXT,
        layout_status TEXT,
        mismatch_percentage REAL,
        pdf_path TEXT,
        screenshot_path TEXT,
        diff_path TEXT,
        compiled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resume_id) REFERENCES resumes (id) ON DELETE CASCADE
      )
    `);

    console.log('Database schema initialized.');
  });
}

// Promisified DB helpers
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

module.exports = {
  db,
  initDb,
  dbRun,
  dbAll,
  dbGet
};
