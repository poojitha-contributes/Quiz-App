# 🎯 Quiz App – CausalFunnel Internship Assignment

This is a web-based quiz application developed for the Software Engineer Intern task at **CausalFunnel**. The app lets users take a timed quiz of 15 questions, fetched from an external API, and shows the result with detailed feedback.

---

## ✅ Features

- 📧 Email verification before starting the quiz
- 🧠 Fetches 15 multiple-choice questions from [Open Trivia DB API](https://opentdb.com/api.php?amount=15)
- ⏳ 30-minute countdown timer (auto-submit when time ends)
- 🔁 Randomized answer options for every question
- 🧭 Horizontal overview panel:
  - ✅ **Green (Attempted)**
  - 🟦 **Blue (Viewed, not attempted)**
  - ⬜ **Grey (Not viewed)**
- 🔢 Shows count of answered questions (e.g., 5/15)
- 📊 Final report showing:
  - The user's answer (green/red)
  - The correct answer for every question
- 📱 Fully responsive and works on latest versions of Chrome, Firefox, Safari, and Edge

---

## 🧪 Live Demo

👉 [Click to View Live Quiz App](https://aquamarine-valkyrie-ce7613.netlify.app)

---

## 🧠 How It Works

1. User enters an email address to start the quiz.
2. 15 random questions are fetched from the Open Trivia API.
3. Timer starts from 30:00 and auto-submits after time ends.
4. Users can navigate to any question using the horizontal panel.
5. Overview panel shows which questions were visited or attempted.
6. Final report is shown with score and answers comparison.

---

## 🚀 How to Run Locally

```bash
git clone https://github.com/poojitha-contributes/Quiz-App.git
cd Quiz-App
npm install
npm start
