# Fursa — How to Download and Run This Project

This guide is written for someone who has **never written a line of code**. Just follow the steps in order, copy-paste exactly what is shown, and the project will run on your computer.

If something does not work, scroll down to the **Troubleshooting** section at the bottom.

---

## What is this project?

**Fursa (فُرصة)** is a job platform that connects job seekers in Gaza with employers. It has three kinds of users:

- **Job Seeker** — looks for jobs and applies to them
- **Employer** — posts jobs and reviews applications
- **Admin** — approves or rejects job postings

The website supports **Arabic** (default, right-to-left) and **English**.

---

## What you will install (one-time setup)

You will install **four free programs**. They are all safe and well-known.

| # | Program     | What it does                                   | Download link |
|---|-------------|------------------------------------------------|---------------|
| 1 | **Node.js** | Runs the website's code on your computer       | https://nodejs.org/en/download |
| 2 | **pnpm**    | Downloads the small pieces the project needs   | (installed in Step 2 below)    |
| 3 | **Git**     | Downloads the project from the internet         | https://git-scm.com/downloads  |
| 4 | **VS Code** | A simple program to view/edit the project      | https://code.visualstudio.com/ |

You also need accounts on **two free services** the project uses:

| Service       | What it does                              | Sign up                    |
|---------------|-------------------------------------------|----------------------------|
| **Clerk**     | Handles login & sign-up safely             | https://clerk.com (free)   |
| **PostgreSQL**| The database that stores users & jobs      | See Step 5 below           |

---

## Step 1 — Install Node.js

1. Open **https://nodejs.org/en/download** in your web browser.
2. Click the big green button labeled **"LTS"** (it says something like "Recommended For Most Users").
3. Open the file you just downloaded and click **Next, Next, Next, Install**. Use all the default options.
4. To check it worked, open a new terminal:
   - **Windows**: Press the Windows key, type `cmd`, press Enter.
   - **Mac**: Press `Cmd + Space`, type `Terminal`, press Enter.
   - **Linux**: Press `Ctrl + Alt + T`.
5. In the black window that appears, type:
   ```
   node --version
   ```
   and press **Enter**. You should see something like `v22.x.x`. If you do, Node.js is installed correctly.

---

## Step 2 — Install pnpm

In the **same terminal window** from Step 1, type this and press **Enter**:

```
npm install -g pnpm
```

Wait until it finishes (about 30 seconds). To check it worked, type:

```
pnpm --version
```

You should see a number like `10.x.x`.

---

## Step 3 — Install Git

1. Open **https://git-scm.com/downloads** and download Git for your operating system.
2. Open the downloaded file and click **Next, Next, Next, Install** with all defaults.
3. To check it worked, open a **new** terminal window and type:
   ```
   git --version
   ```
   You should see something like `git version 2.x.x`.

---

## Step 4 — Download the project

1. Pick a folder where you want to keep the project. For example, your **Desktop**.
2. In the terminal, navigate to that folder. For example, on Windows:
   ```
   cd Desktop
   ```
   On Mac/Linux:
   ```
   cd ~/Desktop
   ```
3. Download the project. Replace `<YOUR-PROJECT-URL>` with the actual link to your project (your teacher / repository owner will give you this URL — it usually ends in `.git`).
   ```
   git clone <YOUR-PROJECT-URL> fursa
   ```
4. Move into the new folder:
   ```
   cd fursa
   ```

---

## Step 5 — Get a free PostgreSQL database

The project needs a database to remember users, jobs, and applications.

The easiest free option is **Neon** (no credit card needed):

1. Open **https://neon.tech** and click **Sign Up** (you can use your Google account).
2. Click **Create Project**. Give it any name (e.g. `fursa`). Choose any region close to you.
3. After it is created, you will see a section called **Connection String** with a long line that starts with `postgresql://...`. **Copy this whole line** — you will need it in the next step.

> If you prefer another provider (Supabase, Railway, your own PostgreSQL), that is fine — just copy your own connection string instead.

---

## Step 6 — Get free Clerk login keys

The project uses **Clerk** to handle login and sign-up.

1. Open **https://clerk.com** and click **Sign Up** (free).
2. Click **+ Create application**. Give it a name (e.g. `Fursa`).
3. On the screen that asks which sign-in methods to enable, leave the defaults (Email + Google) and click **Create application**.
4. On the next screen click **Show API Keys**. You will see two values:
   - `Publishable key` — starts with `pk_test_...`
   - `Secret key` — starts with `sk_test_...`
5. **Copy both** — you will paste them in the next step.

---

## Step 7 — Configure the project (the `.env` file)

1. In your terminal, make sure you are still inside the `fursa` folder.
2. Create a file named exactly `.env` in this folder. The easiest way:
   - **Windows**:
     ```
     copy nul .env
     ```
   - **Mac/Linux**:
     ```
     touch .env
     ```
3. Open VS Code by typing:
   ```
   code .
   ```
   (If `code` is not recognized, just open VS Code from your Start menu / Applications and use **File → Open Folder** to open the `fursa` folder.)
4. In VS Code, click on the new `.env` file in the left sidebar and paste the following text. Then **replace the values inside the quotes** with the ones you copied earlier:

   ```dotenv
   # --- DATABASE (from Neon, Step 5) ---
   DATABASE_URL="paste-the-connection-string-from-Neon-here"

   # --- CLERK (from Clerk dashboard, Step 6) ---
   CLERK_PUBLISHABLE_KEY="pk_test_paste-yours-here"
   CLERK_SECRET_KEY="sk_test_paste-yours-here"

   # --- SESSION (any long random string of your choice) ---
   SESSION_SECRET="change-me-to-any-long-random-string-of-letters-and-numbers"

   # --- LOCAL DEV (leave these as-is) ---
   PORT=8080
   BASE_PATH=/
   ```

5. Press **Ctrl + S** (Windows/Linux) or **Cmd + S** (Mac) to save the file.

---

## Step 8 — Install all the project's pieces

Back in your terminal (still inside the `fursa` folder), type:

```
pnpm install
```

This downloads all the small libraries the project needs. It can take 1–3 minutes the first time. You only have to do this once.

---

## Step 9 — Set up the database tables

Type:

```
pnpm --filter @workspace/db run push
```

This creates the tables (users, jobs, applications, etc.) inside your Neon database.

You should see a line that says **"Changes applied"** when it is done.

---

## Step 10 — Start the project

In the terminal, type:

```
pnpm dev
```

Wait about 10 seconds. You should see lines like:

```
Server listening on port 8080
VITE v7.x.x  ready
Local:   http://localhost:22659/
```

Now open your web browser and go to:

**http://localhost:22659**

The Fursa website will appear. 🎉

---

## How to use the website

1. Click **Sign up** in the top-right corner.
2. Create an account with your email.
3. The first time, you will be asked to choose your role: **Job Seeker**, **Employer**, or **Admin**.
4. After that, you will land on the homepage. Use the menu in the top-right to access your dashboard, profile, applications, etc.

> **Tip:** To make yourself an Admin, sign up first, then look at the `users` table in your Neon database and change your `role` value to `admin`.

---

## How to stop the project

In the terminal where the project is running, press **Ctrl + C**. The website will shut down.

To start it again later, open a terminal in the `fursa` folder and run `pnpm dev` again. (You do **not** need to redo the install or database steps.)

---

## Troubleshooting

### "command not found: pnpm" / "command not found: node"
You need to **close and reopen your terminal** after installing Node.js or pnpm. The terminal only sees programs that were installed before it was opened.

### "Port 22659 is already in use" or "Port 8080 is already in use"
Another program is using that port. Close other apps that might be running, or restart your computer.

### "Missing Clerk Secret Key"
Your `.env` file is not being read or the values are wrong. Double-check:
- The file is named exactly `.env` (with the dot, no `.txt` at the end).
- The file is in the **root** of the `fursa` folder (the same folder that has `package.json`).
- The keys start with `pk_test_` and `sk_test_` and have no spaces.

### "DATABASE_URL must be set"
Same as above, but for the database line in your `.env`. Make sure you pasted the full Neon connection string, including the `postgresql://` at the start.

### The page is blank or shows an error
Stop the project (`Ctrl + C`), then run `pnpm dev` again. If you changed the `.env` file, you must restart the project for the changes to take effect.

### Login does not work
- Make sure your Clerk application is in **Development mode** (the default). Production keys won't work on `localhost`.
- Make sure both the publishable key and secret key are from the **same** Clerk application.

### Resetting everything
If something goes very wrong, you can start over:
1. Stop the project (Ctrl + C).
2. Delete the `node_modules` folder inside `fursa`.
3. Run `pnpm install` again.
4. Run `pnpm dev` again.

---

## What goes in the `.env` file (quick reference)

| Variable                 | Where to get it                                       | Required? |
|--------------------------|-------------------------------------------------------|-----------|
| `DATABASE_URL`           | Neon dashboard → Connection String                    | ✅ Yes    |
| `CLERK_PUBLISHABLE_KEY`  | Clerk dashboard → API Keys → Publishable key          | ✅ Yes    |
| `CLERK_SECRET_KEY`       | Clerk dashboard → API Keys → Secret key               | ✅ Yes    |
| `SESSION_SECRET`         | Any long random string of your choosing               | ✅ Yes    |
| `PORT`                   | Always `8080` for local development                   | ✅ Yes    |
| `BASE_PATH`              | Always `/` for local development                      | ✅ Yes    |

---

## Project structure (just so you know)

```
fursa/
├── artifacts/
│   ├── fursa/         ← The website (frontend)
│   └── api-server/    ← The backend (handles login, jobs, etc.)
├── lib/
│   ├── db/            ← Database tables
│   └── api-spec/      ← How the frontend talks to the backend
├── .env               ← Your private keys (you create this, never share it!)
└── HOW_TO_RUN.md      ← This file
```

You should **never** share your `.env` file or commit it to Git. It contains your private keys.

---

That's it! If you followed every step, the project is now running on your computer with **your own** database, **your own** login keys, and **your own** account.
