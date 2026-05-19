# 🏛️ AI-Based Smart Complaint Management System

A full-stack MERN application with AI-powered complaint analysis using OpenRouter (Mistral 7B).

**B.Tech 4th Semester ESE Examination | AI Driven Full Stack Development (AI308B)**

---

## 🚀 Live Demo
- **Frontend:** `https://complaint-management-frontend.onrender.com`
- **Backend API:** `https://complaint-management-backend.onrender.com`

---

## 📁 Project Structure

```
AI-Based Smart Complaint Management System/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Login, Signup, Profile
│   │   ├── complaintController.js  # CRUD + Search + AI Save
│   │   └── aiController.js         # OpenRouter AI Integration
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT protect + adminOnly
│   │   └── errorMiddleware.js      # Global error handler
│   ├── models/
│   │   ├── User.js                 # User schema (bcrypt)
│   │   └── Complaint.js            # Complaint schema + AI fields
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth/*
│   │   ├── complaintRoutes.js      # /api/complaints/*
│   │   └── aiRoutes.js             # /api/ai/*
│   ├── .env.example                # Template (copy to .env and fill values)
│   └── server.js                   # Express entry point
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── _redirects              # Render SPA routing fix
│   └── src/
│       ├── components/
│       │   ├── Navbar.js + .css
│       │   ├── AIAnalysisCard.js + .css
│       │   └── PrivateRoute.js
│       ├── context/
│       │   └── AuthContext.js      # JWT auth state
│       ├── pages/
│       │   ├── Home.js + .css
│       │   ├── Login.js
│       │   ├── Signup.js
│       │   ├── RegisterComplaint.js + .css
│       │   ├── ComplaintList.js + .css
│       │   ├── ComplaintDetail.js + .css
│       │   └── Dashboard.js + .css
│       ├── utils/
│       │   └── api.js              # Axios instance with JWT interceptor
│       └── App.js
├── render.yaml                     # Render deployment config
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6, Axios, React Toastify |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT + bcryptjs |
| AI | OpenRouter API (Mistral 7B Instruct Free) |
| Deployment | Render (Backend: Web Service, Frontend: Static Site) |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- OpenRouter API key (free at openrouter.ai)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ai-complaint-management.git
cd "ai-complaint-management"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in the `backend` folder (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/complaintDB
JWT_SECRET=smartcomplaint_jwt_secret_key_2025
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000` — API calls are proxied to `http://localhost:5000`.

---

## 📡 API Endpoints

### Auth APIs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/profile` | Get user profile | Protected |

**Sample Signup Request:**
```json
{
  "name": "Rahul Kumar",
  "email": "rahul@gmail.com",
  "password": "password123"
}
```

**Sample Login Request:**
```json
{
  "email": "rahul@gmail.com",
  "password": "password123"
}
```

---

### Complaint APIs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/complaints` | Add new complaint | Public |
| GET | `/api/complaints` | Get all complaints | Public |
| GET | `/api/complaints/:id` | Get complaint by ID | Public |
| PUT | `/api/complaints/:id` | Update complaint status | Protected |
| DELETE | `/api/complaints/:id` | Delete complaint | Protected |
| GET | `/api/complaints/search?location=X` | Search by location | Public |
| PUT | `/api/complaints/:id/ai-analysis` | Save AI analysis | Protected |

**Sample Add Complaint:**
```json
{
  "name": "Rahul Kumar",
  "email": "rahul@gmail.com",
  "title": "Water Leakage Issue",
  "description": "Water pipeline damaged near market area causing flooding.",
  "category": "Water Supply",
  "location": "Ghaziabad"
}
```

---

### AI APIs
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ai/analyze` | Analyze complaint with AI | Public |

**Sample AI Analyze Request:**
```json
{
  "title": "Water Leakage Issue",
  "description": "Water pipeline damaged near market area.",
  "category": "Water Supply",
  "location": "Ghaziabad"
}
```

**Sample AI Response:**
```json
{
  "message": "AI analysis completed successfully",
  "analysis": {
    "urgency": "High - Immediate attention required",
    "department": "Water Supply & Sanitation Department",
    "autoResponse": "Thank you for reporting the water leakage issue...",
    "summary": "Water pipeline damage reported near market area in Ghaziabad."
  }
}
```

---

## 🤖 AI Features

1. **Priority Detection** — High / Medium / Low urgency classification
2. **Department Recommendation** — Suggests responsible government department
3. **Auto Response** — Generates professional response for complainant
4. **Complaint Summary** — Creates brief 1-2 sentence summary

---

## 🔒 Security Features

- JWT token-based authentication (7-day expiry)
- bcrypt password hashing (salt rounds: 10)
- Protected routes on frontend (PrivateRoute component)
- Protected API endpoints (authMiddleware)
- Input validation with express-validator
- `.env` file excluded from git (never committed)

---

## 🗄️ MongoDB Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: user/admin, default: user),
  createdAt: Date
}
```

### Complaint Schema
```javascript
{
  name: String (required),
  email: String (required),
  title: String (required),
  description: String (required),
  category: String (enum: 8 categories),
  location: String (required),
  status: String (enum: Pending/In Progress/Resolved/Rejected),
  aiAnalysis: {
    urgency: String,
    department: String,
    autoResponse: String,
    summary: String
  },
  submittedBy: ObjectId (ref: User),
  createdAt: Date
}
```

---

## 🚀 Deployment on Render

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: AI-Based Smart Complaint Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy Backend on Render
1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repository
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add Environment Variables:
   - `MONGODB_URI` → your MongoDB Atlas URI
   - `JWT_SECRET` → `smartcomplaint_jwt_secret_key_2025`
   - `OPENROUTER_API_KEY` → your OpenRouter key
5. Click **Deploy** → Copy the backend URL (e.g., `https://complaint-management-backend.onrender.com`)

### Step 3: Deploy Frontend on Render
1. Go to Render → **New** → **Static Site**
2. Connect your GitHub repository
3. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
4. Add Environment Variable:
   - `REACT_APP_API_URL` → paste your backend URL from Step 2
5. Click **Deploy**

---

## 🧪 Test Cases

### Auth API Tests
| Test Case | Expected Output |
|-----------|----------------|
| Valid signup | `201` - Token generated |
| Duplicate email signup | `400` - User already exists |
| Valid login | `200` - Token returned |
| Wrong password | `401` - Unauthorized |
| Access protected route without token | `401` - Access denied |

### Complaint API Tests
| Test Case | Expected Output |
|-----------|----------------|
| Add valid complaint | `201` - Complaint stored |
| Missing required field | `400` - Validation error |
| Get all complaints | `200` - Array returned |
| Search by location | `200` - Filtered results |
| Update status (authenticated) | `200` - Status updated |
| Delete complaint (authenticated) | `200` - Deleted |

### AI API Tests
| Complaint Type | Expected AI Output |
|---------------|-------------------|
| Water leakage | Water dept suggestion, High priority |
| Electricity issue | Electricity dept, High priority |
| Garbage complaint | Sanitation dept, Medium priority |
| Road damage | PWD dept suggestion |

---

## 👨‍💻 Author

**Sushant Sharma**
B.Tech — Artificial Intelligence & Machine Learning
4th Semester | AI Driven Full Stack Development (AI308B)
Even Semester 2025-26
