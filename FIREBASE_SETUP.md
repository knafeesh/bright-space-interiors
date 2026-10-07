# Firebase Setup & Deployment Guide for The Bright Space Interiors

This guide explains how to connect Firebase (Firestore & Storage) to your website so that when the admin updates projects, services, or images, the changes persist permanently and update live across the website.

---

## 1. Firebase Setup (Takes ~3 minutes)

### Step 1: Create or Open Your Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your existing Firebase project (or click **"Add project"** and name it e.g. `bright-space-interiors`).

### Step 2: Enable Cloud Firestore
1. In the left sidebar, click **Build** → **Firestore Database**.
2. Click **Create database**.
3. Choose your database location (e.g. `asia-south1 (Mumbai)` for best performance in India).
4. Start in **Production mode** (all reads/writes go through our backend API routes with admin authentication).
5. Click **Create**.

### Step 3: Enable Cloud Storage
1. In the left sidebar, click **Build** → **Storage**.
2. Click **Get started**.
3. Choose your storage location (same region as Firestore).
4. Click **Done**.
5. Note your bucket domain (e.g. `your-project-id.firebasestorage.app`).

### Step 4: Generate Admin Service Account Key
1. In Firebase Console, click the **Gear icon (Project settings)** at the top left.
2. Go to the **Service accounts** tab.
3. Select **Firebase Admin SDK** (Node.js).
4. Click **"Generate new private key"** and confirm.
5. A JSON file will download to your computer. Open it in a text editor.

You will see:
```json
{
  "project_id": "your-project-id",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
}
```

---

## 2. Add Environment Variables to Vercel

1. Open your project on [Vercel](https://vercel.com/dashboard).
2. Go to **Settings** → **Environment Variables**.
3. Add the following variables (choose **Production**, **Preview**, and **Development**):

| Variable Name | Value |
|---|---|
| `ADMIN_SESSION_SECRET` | Any random string (minimum 16 characters), e.g. `bs-interiors-super-secret-key-2026-xyz` |
| `FIREBASE_PROJECT_ID` | `project_id` from your downloaded JSON |
| `FIREBASE_CLIENT_EMAIL` | `client_email` from your downloaded JSON |
| `FIREBASE_PRIVATE_KEY` | `private_key` from your downloaded JSON (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`) |
| `FIREBASE_STORAGE_BUCKET` | Your storage bucket domain (e.g. `your-project-id.firebasestorage.app`) |

*(Optional: you can also set `ADMIN_USERNAME` and `ADMIN_PASSWORD` if you wish to change the admin login from `Azam` / `Azam@2005`).*

4. Go to **Deployments** tab on Vercel and click **Redeploy** (or simply push a git commit to trigger automatic deployment).

---

## 3. How the Admin System Works Now

1. **Live Synchronized Updates**:
   - Any project added, edited, or deleted in the **Portfolio Manager** updates the Firestore database immediately and broadcasts across the site.
   - Any service or specialty added, edited, or deleted in the **Services Manager** is saved live.
   - Any uploaded image is saved permanently to Firebase Cloud Storage, generates a CDN URL, and is automatically added to the **Media Library**.

2. **One-Click Image Upload**:
   - In Portfolio Manager, Services Manager, and Media Library, you can now click **"Upload Image"** to choose any image from your computer/phone.
   - The image is securely uploaded, compressed, and assigned to the project or service in real time.

3. **Status Pill in Admin Header**:
   - When saving: displays `"Updating live site..."` with a spinner.
   - When finished: displays `"Live Synced"` with a green checkmark.
   - If offline or error: displays `"Sync Failed"` and gives an actionable message.

4. **Security**:
   - Admin routes and write APIs are protected with HTTP-only HMAC-signed session cookies.
   - Customer leads with contact info can only be viewed by authenticated admins.
