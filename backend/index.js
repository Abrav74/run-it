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

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ message: "username and password required" });

  const db = await readDB();
  const acc = db.accounts.find((a) => a.username === username);
  if (!acc) return res.status(401).json({ message: "invalid credentials" });

  const ok = await bcrypt.compare(password, acc.passwordHash || "");
  if (!ok) return res.status(401).json({ message: "invalid credentials" });

  // For simplicity we just return username; a real app should return a token/session
  res.json({ username: acc.username });
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

// --- Tournament endpoints ---
const TOURNAMENT_FILE = path.join(__dirname, "tournaments.json");

async function readTournaments() {
  try {
    const raw = await fs.readFile(TOURNAMENT_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return { tournaments: [] };
  }
}

async function writeTournaments(db) {
  await fs.writeFile(TOURNAMENT_FILE, JSON.stringify(db, null, 2), "utf8");
}

// List tournaments
app.get("/tournaments", async (req, res) => {
  const db = await readTournaments();
  res.json(db.tournaments || []);
});

// Get tournament by id
app.get("/tournaments/:id", async (req, res) => {
  const { id } = req.params;
  const db = await readTournaments();
  const t = db.tournaments.find((x) => x.id === id);
  if (!t) return res.status(404).json({ message: "Tournament not found" });
  res.json(t);
});

// Create tournament
app.post("/tournaments", async (req, res) => {
  let { name, date, description, imageUrl, createdBy } = req.body || {};
  name = typeof name === "string" ? name.trim() : "";
  date = typeof date === "string" ? date.trim() : undefined;
  description =
    typeof description === "string" ? description.trim() : undefined;
  imageUrl = typeof imageUrl === "string" ? imageUrl.trim() : undefined;

  if (!name || name.length < 3)
    return res
      .status(400)
      .json({ message: "name must be at least 3 characters" });

  const db = await readTournaments();
  const id = Date.now().toString();
  const tournament = {
    id,
    name,
    date,
    description,
    imageUrl,
    createdBy: createdBy || null,
    createdAt: new Date().toISOString(),
  };

  db.tournaments.push(tournament);
  await writeTournaments(db);
  res.status(201).json(tournament);
});

// Update tournament
app.put("/tournaments/:id", async (req, res) => {
  const { id } = req.params;
  let { name, date, description, imageUrl } = req.body || {};
  name = typeof name === "string" ? name.trim() : undefined;
  date = typeof date === "string" ? date.trim() : undefined;
  description =
    typeof description === "string" ? description.trim() : undefined;
  imageUrl = typeof imageUrl === "string" ? imageUrl.trim() : undefined;

  const db = await readTournaments();
  const idx = db.tournaments.findIndex((t) => t.id === id);
  if (idx === -1)
    return res.status(404).json({ message: "Tournament not found" });

  if (name) {
    if (name.length < 3)
      return res
        .status(400)
        .json({ message: "name must be at least 3 characters" });
    db.tournaments[idx].name = name;
  }
  if (date !== undefined) db.tournaments[idx].date = date;
  if (description !== undefined) db.tournaments[idx].description = description;
  if (imageUrl !== undefined) db.tournaments[idx].imageUrl = imageUrl;
  db.tournaments[idx].updatedAt = new Date().toISOString();

  await writeTournaments(db);
  res.json(db.tournaments[idx]);
});

// Delete tournament
app.delete("/tournaments/:id", async (req, res) => {
  const { id } = req.params;
  const db = await readTournaments();
  const idx = db.tournaments.findIndex((t) => t.id === id);
  if (idx === -1)
    return res.status(404).json({ message: "Tournament not found" });
  const removed = db.tournaments.splice(idx, 1)[0];
  await writeTournaments(db);
  res.json(removed);
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
