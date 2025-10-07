# Mongol EESH English - Static site (GitHub Pages)

This is a simple static website to practice Mongolian national exam (ЭЕШ) English questions.
It is ready to be deployed on **GitHub Pages**.

## Files
- `index.html` — main HTML page
- `style.css` — styles
- `script.js` — client-side logic (loads `questions.json`)
- `questions.json` — sample question set (edit with real ЭЕШ questions)

## How to deploy to GitHub Pages (quick)
1. Create a new repository on GitHub (for example `mongol-english-exam`).
2. On your local machine:
```bash
git init
git add .
git commit -m "Initial commit - Mongol EESH site"
git branch -M main
# replace USERNAME and REPO with your values:
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```
3. On GitHub: go to the repository → **Settings** → **Pages** (or "Code and automation" → Pages).
   - Source: select `main` branch and folder `/ (root)`.
   - Save. After a minute your site will be live at:
     `https://USERNAME.github.io/REPO/`

## Quick local test
You can open `index.html` directly in your browser to test (no server required), but `fetch('questions.json')` may be blocked by some browsers when opening from file://.
If that happens, run a tiny local server:
```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

## Replacing questions
Edit `questions.json` with your own question objects. Each question format:
```json
{
  "id": 1,
  "question_mn": "Монгол хэл дээрх асуулт...",
  "question_en": "English question...",
  "choices": ["A","B","C","D"],
  "answer": "B",
  "explanation_mn": "Монгол тайлбар",
  "explanation_en": "English explanation"
}
```

## Notes
- This is intentionally simple (static). For user accounts, score tracking, or AI explanations, consider adding a backend (Firebase, Supabase, or a small server).
- If you want, I can help you push this repository step-by-step or convert it into a Gradio/Hugging Face Space app.
