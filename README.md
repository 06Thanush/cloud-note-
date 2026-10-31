# CloudNotes — Cloud-Based Note-Taking Web Application

A modern, full-featured cloud-based note-taking web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Firebase (Authentication & Cloud Firestore)**.

Notes synchronize across devices in real time, auto-save continuously, support organizing via tags, pinning, color coding, and feature a public link sharing system with expiration times and instant access revocation.

---

## 🚀 Key Features

### 1. 🔐 Authentication (Firebase Auth)
- **Email & Password Registration & Login** with client-side validation and friendly error handling.
- **Google Sign-In** with one click.
- **Protected Dashboard**: Unauthenticated users are redirected to login.
- **Session Persistence**: Stays logged in across browser tabs and refreshes.

### 2. 📝 Notes Management
- **Real-Time CRUD**: Create, edit, and delete notes with immediate cloud persistence.
- **Continuous Auto-Save**: Debounced auto-save ensures changes are never lost while typing.
- **Titles & Descriptions**: Clean, formatted note content with quick formatting toolbar (Bold, Headings, Bullet Lists, Numbered Lists, Checklists, Code blocks).
- **Tag Organization**: Add and manage custom tags, with instant tag-based filtering.
- **Pin Important Notes**: Keep critical notes pinned at the top of the dashboard.
- **Color Coding**: Choose from pastel SaaS accent colors (Purple, Indigo, Rose, Amber, Emerald, Sky).
- **Instant Search**: Search across note titles, descriptions, and `#tags` in real time.

### 3. 🔗 Secure Sharing System
- **Generate Public Read-Only Links**: Share any note via a unique URL (`/share/[shareId]`).
- **Expiration Timers**: Set link expiration to **1 Hour**, **24 Hours**, **7 Days**, **30 Days**, or **Never**.
- **Instant Revocation**: Disable sharing at any moment to immediately revoke public access.
- **Expiration Protection**: Expired or disabled links display a clean notice and block content.

### 4. 📊 Dashboard & SaaS UX
- **Live Metrics**: Total notes count, pinned count, shared count, and total unique tags.
- **Sidebar Navigation**: Filter by All Notes, Pinned, Shared, or browse by individual tags.
- **Dark & Light Mode**: Premium theme toggle with smooth transitions.
- **Responsive Layout**: Designed for mobile, tablet, and desktop with a mobile drawer.
- **Empty States & Feedback**: Polished empty state screens and floating toast notifications.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Clean white & light-purple theme)
- **Icons**: Lucide React
- **Backend / Database**: Google Firebase (Authentication & Cloud Firestore)
- **Effects**: Canvas Confetti

---

## 📋 Getting Started in VS Code

### Step 1: Open the Project in VS Code
Open VS Code, press `Ctrl+O` (or `Cmd+O`), and select this folder:
```
Cloud-Based Note-Taking App
```
Or run in terminal:
```bash
code .
```

---

### Step 2: Set Up Firebase Credentials

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add Project** (e.g. `my-cloudnotes`).
2. **Enable Authentication**:
   - Go to **Build > Authentication > Get Started**.
   - Under the **Sign-in method** tab, enable **Email/Password** and **Google**.
3. **Enable Cloud Firestore**:
   - Go to **Build > Firestore Database > Create Database**.
   - Choose a location and select **Start in production mode** or **test mode**.
   - Go to the **Rules** tab and paste the contents from [`firestore.rules`](./firestore.rules), then click **Publish**.
4. **Register a Web App**:
   - In Project Settings (**Gear Icon > Project settings > General**), scroll to **Your apps** and click the **Web `</>`** icon.
   - Enter an app name and copy your Firebase configuration keys.
5. **Add Credentials to `.env.local`**:
   - Open `.env.local` in the root folder and paste your keys:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

*(Note: The app includes a setup banner that guides you if placeholder keys are active).*

---

### Step 3: Run the Development Server

In VS Code's terminal (`Ctrl + ~` or Terminal > New Terminal), run:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 📁 Project Structure

```
├── .env.local                    # Firebase environment variables
├── .env.local.example            # Example configuration template
├── firestore.rules               # Secure Cloud Firestore security rules
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── next.config.ts                # Next.js configuration
├── src/
│   ├── app/
│   │   ├── globals.css           # Tailwind styling & dark mode setup
│   │   ├── layout.tsx            # Root layout with AuthProvider & Theme setup
│   │   ├── page.tsx              # Modern SaaS landing page
│   │   ├── login/page.tsx        # Email & Google Sign-In
│   │   ├── register/page.tsx     # Account registration
│   │   ├── dashboard/page.tsx    # Live dashboard with notes, search & filters
│   │   └── share/[shareId]/page.tsx # Public read-only view with expiry validation
│   ├── components/
│   │   ├── Navbar.tsx            # Search bar, sync indicator, new note CTA
│   │   ├── Sidebar.tsx           # Navigation, filters, tags list, profile & logout
│   │   ├── NoteCard.tsx          # Card view with tags, color theme, pin, actions
│   │   ├── NoteEditorModal.tsx   # Continuous auto-save, rich toolbar & tag manager
│   │   ├── ShareModal.tsx        # Link generator, expiration timer & access toggle
│   │   ├── DeleteConfirmModal.tsx# Confirmation dialog for safe note deletions
│   │   ├── ThemeToggle.tsx       # Dark & Light mode switcher
│   │   ├── Toast.tsx             # Floating notification alerts
│   │   └── FirebaseConfigNotice.tsx # Setup guide notice for Firebase keys
│   ├── context/
│   │   └── AuthContext.tsx       # Firebase Auth context & hooks
│   ├── lib/
│   │   ├── firebase.ts           # Firebase client initialization
│   │   └── notes.ts              # Firestore real-time CRUD & share helpers
│   └── types/
│       └── note.ts               # Note & user TypeScript interfaces
```

---

## 🛡️ Security Rules (`firestore.rules`)

The application enforces secure access directly in Firestore:
- **User Privacy**: Each user can only read, write, update, and delete their own notes (`request.auth.uid == resource.data.userId`).
- **Safe Public Access**: Non-owners can only read a note if `isShared == true` AND the expiration timestamp has not elapsed (`shareExpiresAt == null || shareExpiresAt > request.time.toMillis()`).

---

## 🚢 Deployment

### Deploying to Vercel
1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Add the `NEXT_PUBLIC_FIREBASE_*` environment variables in the Vercel project settings.
4. Click **Deploy**.

### Deploying to Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase login` and `firebase init hosting`.
3. Build the app with `npm run build` and run `firebase deploy`.
