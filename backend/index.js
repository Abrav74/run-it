const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");
const bcrypt = require("bcryptjs");

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

// Utility to return account without sensitive fields
function safeAccount(a) {
  return { username: a.username };
}

// List all accounts (without passwords)
app.get("/accounts", async (req, res) => {
  const db = await readDB();
  const safe = db.accounts.map((a) => safeAccount(a));
  res.json(safe);
});

// Get single account (without password)
app.get("/accounts/:username", async (req, res) => {
  const { username } = req.params;
  const db = await readDB();
  const account = db.accounts.find((a) => a.username === username);
  if (!account) return res.status(404).json({ message: "Account not found" });
  res.json(safeAccount(account));
});

// Create account with validation and hashed password
app.post("/accounts", async (req, res) => {
  let { username, password } = req.body || {};
  username = typeof username === "string" ? username.trim() : "";
  password = typeof password === "string" ? password : "";

  if (!username || username.length < 3)
    return res
      .status(400)
      .json({ message: "username must be at least 3 characters" });
  if (!password || password.length < 6)
    return res
      .status(400)
      .json({ message: "password must be at least 6 characters" });

  const db = await readDB();
  if (db.accounts.find((a) => a.username === username)) {
    return res.status(409).json({ message: "username already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  db.accounts.push({ username, passwordHash: hashed });
  await writeDB(db);
  res.status(201).json(safeAccount({ username }));
});

// Update account (username or password) with validation
app.put("/accounts/:username", async (req, res) => {
  const { username } = req.params;
  let { username: newUsername, password } = req.body || {};
  newUsername =
    typeof newUsername === "string" ? newUsername.trim() : undefined;
  password = typeof password === "string" ? password : undefined;

  const db = await readDB();
  const idx = db.accounts.findIndex((a) => a.username === username);
  if (idx === -1) return res.status(404).json({ message: "Account not found" });

  if (newUsername && newUsername !== username) {
    if (newUsername.length < 3)
      return res
        .status(400)
        .json({ message: "username must be at least 3 characters" });
    if (db.accounts.find((a) => a.username === newUsername)) {
      return res.status(409).json({ message: "new username already exists" });
    }
    db.accounts[idx].username = newUsername;
  }

  if (password) {
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
    const hashed = await bcrypt.hash(password, 10);
    db.accounts[idx].passwordHash = hashed;
  }

  await writeDB(db);
  res.json(safeAccount(db.accounts[idx]));
});

// Simple health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
