# Campus Poll System — Frontend Client

Modern, responsive university polling web application built with **React 18**, **Vite**, **React Router v6**, **Axios**, **Recharts**, and **Lucide React**.

---

## 🏛️ Features

### 👑 Administrator Portal
- **Live Metrics Dashboard**: Visual overview of total users, total polls, active polls, scheduled polls, closed polls, and total valid votes.
- **Poll Creation**: Dynamic question formulation, customizable answer options (minimum 2), start/end scheduling, and results visibility policies (`ALWAYS`, `AFTER_CLOSE`, `ADMIN_ONLY`).
- **Poll Management**: Real-time table to publish, edit, or close polls with confirmation safety modals.
- **Ballot Integrity Locking**: Prevents editing question wording or answer options once voting has commenced.
- **Interactive Visual Analytics**: Real-time Recharts Bar Chart, Pie/Doughnut Chart, and percentage breakdown table.
- **User Directory**: View registered university students with verified Student IDs.

### 🎓 Student Voting Portal
- **Personalized Welcome**: Displays student name, verified Student ID, and status.
- **Active Ballots**: Real-time view of all currently open campus polls.
- **Secure Ballot Submission**: Single-choice voting with instant confirmation.
- **Duplicate-Vote Prevention**: Enforced at the frontend, backend service, and MySQL database unique constraint levels (`409 Conflict`). Displays `"You have already voted in this poll."`
- **Upcoming & Closed Polls**: Overview of future scheduled surveys and historical election outcomes.
- **Personal Voting Ledger**: Complete timestamped record of all ballots cast.

---

## 🛠️ Technology Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 6.0
- **Routing**: React Router DOM 6.28
- **HTTP Client**: Axios 1.7 (with Bearer token request interceptor & 401 handling)
- **Data Visualization**: Recharts 2.15 (BarChart, PieChart, Tooltip, ResponsiveContainer)
- **Icons**: Lucide React 0.469
- **Design System**: Custom University Theme (Navy Blue `#0f172a`, Royal Blue `#1e40af`, Emerald Green, and Alert accents)

---

## 📂 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── ConfirmationModal.jsx # Action safety confirmation modal
│   │   ├── DashboardCard.jsx     # Statistic display metric card
│   │   ├── EmptyState.jsx        # Clean fallback state for zero-item lists
│   │   ├── LoadingSpinner.jsx    # Animated loading indicator
│   │   ├── Navbar.jsx            # Top banner with role & student ID badge
│   │   ├── PollCard.jsx          # Reusable poll card with dynamic action buttons
│   │   ├── PollStatusBadge.jsx   # Status indicator (Active, Scheduled, Closed, Draft)
│   │   ├── ProtectedRoute.jsx    # Role-based route guard (ADMIN / STUDENT)
│   │   ├── ResultsChart.jsx      # Recharts Bar & Pie visualizer with breakdown table
│   │   └── Sidebar.jsx           # Responsive campus sidebar navigation
│   │
│   ├── context/
│   │   └── AuthContext.jsx       # Global auth state, JWT token storage, login/logout
│   │
│   ├── pages/
│   │   ├── admin/                # Admin views
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminPollResults.jsx
│   │   │   ├── CreatePoll.jsx
│   │   │   ├── EditPoll.jsx
│   │   │   ├── ManagePolls.jsx
│   │   │   └── UserManagement.jsx
│   │   │
│   │   ├── student/              # Student views
│   │   │   ├── ActivePolls.jsx
│   │   │   ├── ClosedPolls.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── StudentPollResults.jsx
│   │   │   ├── UpcomingPolls.jsx
│   │   │   ├── VoteScreen.jsx
│   │   │   └── VotingHistory.jsx
│   │   │
│   │   ├── Login.jsx             # Login with 1-click Quick Demo Autofill pills
│   │   ├── Register.jsx          # Student registration with Student ID verification
│   │   ├── Unauthorized.jsx      # 403 Forbidden page
│   │   └── NotFound.jsx          # 404 Catch-all page
│   │
│   ├── services/
│   │   └── api.js                # Centralized Axios client with automatic JWT header
│   │
│   ├── App.jsx                   # Route hierarchy & role guards
│   ├── index.css                 # Custom CSS design system
│   └── main.jsx                  # Application entry point
│
├── .env                          # Local environment variables
├── .env.example                  # Environment variable reference
├── index.html                    # HTML shell with Google Fonts (Outfit & Plus Jakarta Sans)
├── package.json                  # Dependencies & scripts
└── vite.config.js                # Dev server configuration (Port 5173 & /api proxy)
```

---

## 🚀 Getting Started on Windows

### 1. Prerequisites
Ensure **Node.js 18+** and **npm** are installed:
```powershell
node -v
npm.cmd -v
```

### 2. Install Dependencies
Run from the `frontend/` directory:
```powershell
cd c:\Users\Spandana\Desktop\tt_project_07\frontend
npm.cmd install
```

> **Note for Windows PowerShell Users**: Use `npm.cmd` instead of `npm` if script execution policies (`npm.ps1`) are restricted.

### 3. Environment Configuration
The application uses `.env`:
```properties
VITE_API_BASE_URL=http://localhost:8080/api
```
*(A template is also provided in `.env.example`)*

### 4. Start Development Server
```powershell
npm.cmd run dev
```
Open **`http://localhost:5173`** (or `http://127.0.0.1:5173`) in your browser.

### 5. Build for Production
To create an optimized production build:
```powershell
npm.cmd run build
```
The output will be placed in the `dist/` directory.

---

## 🔑 Demo Test Accounts

The login page contains convenient **1-Click Demo Autofill buttons**:

| Role | Email | Password | Student ID | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@campus.edu` | `Admin@123` | `ADM2026001` | Full administrative control & results |
| **Student 1** | `student1@campus.edu` | `Student@123` | `STU2026001` | Voting & student dashboard |
| **Student 2** | `student2@campus.edu` | `Student@123` | `STU2026002` | Secondary voter account |

New students can also register freely on the `/register` page with their name, Student ID, and college email.
