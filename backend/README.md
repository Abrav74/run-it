# Sports App - Backend

This is a minimal Express backend for the Sports App. It exposes simple endpoints to create, read, and update accounts.

Getting started

1. Change to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The server runs on port 3000 by default. Endpoints:

- GET /health -> { status: 'ok' }
- GET /accounts -> list accounts (usernames only)
- GET /accounts/:username -> get a single account (username only)
- POST /accounts -> create account { username, password }
- PUT /accounts/:username -> update account { username?, password? }

Note: passwords are stored in plaintext in `accounts.json` for simplicity — this is only for local testing. For production, use a real database and proper password hashing.
