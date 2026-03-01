# Evolving Art — Susanne Gabriela

A personal art portfolio capturing the journey of creation, project by project, chapter by chapter.

---

## Folder Structure

```
evolving-art/
├── index.html          ← Main page
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← Drag-to-scroll logic
├── images/
│   ├── project1/
│   │   ├── chapter1/   ← day1.jpg, day2.jpg ...
│   │   ├── chapter2/
│   │   └── chapter3/
│   ├── project2/
│   │   ├── chapter1/
│   │   └── chapter2/
│   └── project3/
│       └── chapter1/
└── README.md
```

---

## How to swap in your images

Replace any file inside `/images/projectX/chapterX/` with your own images.
Keep the same filename or update the `src=""` in `index.html` to match.

---

## How to add a new project

In `index.html`, copy one `<div class="project-column">` block and paste it after the last one.
Update the year, title, description, and chapter content.

---

## How to add a new chapter to an existing project

Inside any `.chapters` div, copy one `<div class="chapter">` block and paste it below the last chapter.
Update the date, images, and journal text.

---

## Deploy to GitHub Pages (step by step)

### 1. Install Git
Download from https://git-scm.com/downloads and install.

### 2. Create a GitHub account
Go to https://github.com and sign up if you haven't.

### 3. Create a new repository
- Click the **+** icon → **New repository**
- Name it: `evolving-art` (or anything you like)
- Set it to **Public**
- Do NOT initialize with a README (you already have one)
- Click **Create repository**

### 4. Open Terminal (Mac) or Command Prompt (Windows)
Navigate to your project folder:
```
cd path/to/evolving-art
```

### 5. Initialize and push
```bash
git init
git add .
git commit -m "Initial commit — Evolving Art V1"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/evolving-art.git
git push -u origin main
```
Replace `YOUR_USERNAME` with your actual GitHub username.

### 6. Enable GitHub Pages
- Go to your repository on GitHub
- Click **Settings** → **Pages** (in the left sidebar)
- Under **Source**, select **Deploy from a branch**
- Choose **main** branch, **/ (root)** folder
- Click **Save**

### 7. Your site is live!
After 1–2 minutes, your portfolio will be live at:
```
https://YOUR_USERNAME.github.io/evolving-art/
```

---

## To update your site later

Whenever you add new images or edit content:
```bash
git add .
git commit -m "Add new chapter to Project X"
git push
```
GitHub Pages will automatically update within a minute.
