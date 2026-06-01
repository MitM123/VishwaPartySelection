# Plywood Showroom — Selection Notes (MERN)

A simple, premium app to store **parties (clients)** and their **selection notes**.
Stack: **React (Vite)** + **Node/Express** + **MongoDB (Mongoose)**.

Search is available for both:
- **Party search** — by name, mobile, or address (on the client list).
- **Selection search** — by brand, product name, category, or color (inside a client).

---

## 1. Requirements
- Node.js 18+  →  https://nodejs.org
- MongoDB running locally, OR a free MongoDB Atlas cloud URI.
  - Local install: https://www.mongodb.com/try/download/community
  - Atlas (cloud, recommended): create a free cluster, copy the connection string.

---

## 2. Backend setup
```bash
cd backend
cp .env.example .env          # then edit .env if needed
npm install
npm run seed                  # OPTIONAL: loads the Rajesh Patel sample
npm run dev                   # starts API on http://localhost:5000
```
`.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/plywood_showroom
CLIENT_URL=http://localhost:5173
```
For Atlas, replace MONGO_URI with your string, e.g.
`mongodb+srv://USER:PASS@cluster0.xxxx.mongodb.net/plywood_showroom`

---

## 3. Frontend setup (new terminal)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                   # opens http://localhost:5173
```
`.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Open http://localhost:5173 — add a client, open it, add selections. Everything is saved in MongoDB.

---

## 4. API reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/clients?search=` | List parties (search by name/mobile/address) |
| POST | `/api/clients` | Create party |
| GET | `/api/clients/:id` | Get one party |
| PUT | `/api/clients/:id` | Update party |
| DELETE | `/api/clients/:id` | Delete party + its selections |
| GET | `/api/clients/:id/selections?search=` | List/search a party's selections |
| POST | `/api/clients/:id/selections` | Add a selection |
| PUT | `/api/selections/:id` | Update a selection |
| DELETE | `/api/selections/:id` | Delete a selection |
| GET | `/api/selections?search=` | Global selection search |

---

## 5. Data model

**Client (party)**: name*, mobile*, address, notes
**Selection**: client (ref), brand, name*, thickness, color, category, quantity, remarks, image (base64), selectionDate
( * = required )

---

## 6. Notes
- Product images are stored as base64 strings in MongoDB (simple, no file server needed).
  For large scale, switch to `multer` + cloud storage (S3 / Cloudinary) and store only the URL.
- Unlike the browser-only version, data here lives in **MongoDB**, so it is safe and shared
  across every device that connects to the same backend.
