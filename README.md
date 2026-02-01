# ApolloCite

✅ **Full-stack Appointment Booking (React + Express + MongoDB)**

A small clinic/hospital booking system containing three parts:

- `backend` — Express + MongoDB API (server-side)
- `frontend` — Public-facing React app (patient side)
- `admin` — Admin dashboard React app (admin operations)

---

## 🚀 Quick Start

1. Clone the repository

   ```bash
   git clone <repo-url>
   cd "ApolloCite"
   ```

2. Install dependencies

   ```bash
   # backend
   cd backend
   npm install

   # frontend
   cd ../frontend
   npm install

   # admin
   cd ../admin
   npm install
   ```

3. Create environment files

   - `backend/.env` (example):

     ```env
     MONGODB_URI=mongodb+srv://<user>:<pw>@cluster0.mongodb.net
     CLOUDINARY_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_key
     CLOUDINARY_API_SECRET=your_cloudinary_secret
     JWT_SECRET=some_long_secret
     ADMIN_EMAIL=admin@example.com
     ADMIN_PASSWORD=strong_admin_password
     PORT=8000
     # Optional (for payments):
     # RAZORPAY_KEY_ID=xxx
     # RAZORPAY_KEY_SECRET=xxx
     ```

   - `frontend/.env` and `admin/.env` (example):

     ```env
     VITE_BACKEND_URL=http://localhost:8000
     ```

4. Start services (in separate terminals)

   ```bash
   # backend
   cd backend
   npm run server

   # frontend (patient site)
   cd ../frontend
   npm run dev

   # admin dashboard
   cd ../admin
   npm run dev
   ```

5. Build for production

   ```bash
   # frontend
   cd frontend
   npm run build

   # admin
   cd ../admin
   npm run build
   ```

---

## 📦 Project Structure (top-level)

- `backend/` — Express app
  - `config/` — DB & Cloudinary setup
  - `controllers/`, `models/`, `routes/`, `middlewares/`
- `frontend/` — Public React app (Vite + Tailwind)
- `admin/` — Admin React app (Vite + Tailwind)

---

## 🔧 Notes & Environment

- Backend expects these env vars (minimum): `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLOUDINARY_*`.
- Frontend & Admin use `VITE_BACKEND_URL` (accessed via `import.meta.env.VITE_BACKEND_URL`).
- Start the backend before interacting with either UI to avoid CORS/connection errors.

---

## ✅ Features (implemented)

- User registration/login (JWT auth)
- Admin authentication (single admin using `ADMIN_EMAIL` + `ADMIN_PASSWORD`)
- Doctor CRUD (admin features)
- Appointment booking & management
- Cloudinary image upload integration
- (Optional) Razorpay payment integration — prepared in code but keys commented out

---

## 🧪 Tests

There are no automated tests configured. Add tests to each package as needed.

---

## 💡 Contributing

- Feel free to open issues or PRs. Keep changes small and focused.

---

## 👤 Author

Shubham Jhan


---
