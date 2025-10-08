const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "accounts.json");

app.use(cors());
app.use(bodyParser.json());

async function readDB() {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return { accounts: [] };
  }
}

async function writeDB(db) {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

// List all accounts (without passwords)
app.get("/accounts", async (req, res) => {
  const db = await readDB();
  const safe = db.accounts.map((a) => ({ username: a.username }));
  res.json(safe);
});

// Get single account (without password)
app.get("/accounts/:username", async (req, res) => {
  const { username } = req.params;
  const db = await readDB();
  const account = db.accounts.find((a) => a.username === username);
  if (!account) return res.status(404).json({ message: "Account not found" });
  res.json({ username: account.username });
});

// Create account
app.post("/accounts", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "username and password required" });

  const db = await readDB();
  if (db.accounts.find((a) => a.username === username)) {
    return res.status(409).json({ message: "username already exists" });
  }

  db.accounts.push({ username, password });
  await writeDB(db);
  res.status(201).json({ username });
});

// Update account (username or password)
app.put("/accounts/:username", async (req, res) => {
  const { username } = req.params;
  const { username: newUsername, password } = req.body;

  const db = await readDB();
  const idx = db.accounts.findIndex((a) => a.username === username);
  if (idx === -1) return res.status(404).json({ message: "Account not found" });

  // If changing username, ensure new one isn't taken
  if (newUsername && newUsername !== username) {
    if (db.accounts.find((a) => a.username === newUsername)) {
      return res.status(409).json({ message: "new username already exists" });
    }
    db.accounts[idx].username = newUsername;
  }
  if (password) db.accounts[idx].password = password;

  await writeDB(db);
  res.json({ username: db.accounts[idx].username });
});

// Simple health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
