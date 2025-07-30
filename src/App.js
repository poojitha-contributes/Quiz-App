// Final App.js code with Enhanced Theme, Responsiveness, Transitions, and UX Improvements

import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [showReport, setShowReport] = useState(false);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set());
  const [userAnswers, setUserAnswers] = useState({});
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const formatTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  const startQuiz = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Enter a valid email address");
      return;
    }
    setQuizStarted(true);
  };

  useEffect(() => {
    if (quizStarted) {
      fetch("https://opentdb.com/api.php?amount=15&type=multiple")
        .then((res) => res.json())
        .then((data) => {
          setQuestions(data.results);
        });
    }
  }, [quizStarted]);

  useEffect(() => {
    if (!quizStarted || showReport) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowReport(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStarted, showReport]);

  useEffect(() => {
    if (quizStarted && questions.length > 0) {
      setVisitedQuestions((prev) => new Set(prev).add(currentQuestion));
      const question = questions[currentQuestion];
      if (question) {
        const options = [...question.incorrect_answers, question.correct_answer];
        const shuffled = [...options].sort(() => Math.random() - 0.5);
        setShuffledAnswers(shuffled);
        setSelectedAnswer(userAnswers[currentQuestion] || null);
      }
    }
  }, [currentQuestion, quizStarted, questions, userAnswers]);

  const handleAnswer = (answer) => {
    if (showReport || timeLeft === 0) return;
    setUserAnswers({ ...userAnswers, [currentQuestion]: answer });
    setSelectedAnswer(answer);
    setAttemptedQuestions((prev) => new Set(prev).add(currentQuestion));
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
  };

  const submitQuiz = () => {
    setShowReport(true);
  };

  if (!quizStarted) {
    return (
      <div className="App" style={{ background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)", minHeight: "100vh", padding: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <h1 style={{ color: "white", marginBottom: "30px", animation: "fadeIn 1s" }}>Quiz App</h1>
        <div style={{ background: "white", padding: 40, borderRadius: 10, width: "90%", maxWidth: "350px", textAlign: "center", animation: "slideUp 1s ease" }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "14px", fontSize: "18px", width: "80%",maxWidth: "400px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button onClick={startQuiz} style={{ width: "100%", padding: "14px", fontSize: "18px", backgroundColor: "black", color: "white", border: "none", borderRadius: "5px" }}>Start Quiz</button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return <p>Loading questions...</p>;

  if (showReport) {
    return (
      <div className="App" style={{ padding: "20px" }}>
        <h2>Quiz Report</h2>
        <h3>Your Score: {score} / {questions.length}</h3>
        {questions.map((q, idx) => (
          <div key={idx} style={{ textAlign: "left", margin: "20px 0" }}>
            <p><strong>Q{idx + 1}:</strong> <span dangerouslySetInnerHTML={{ __html: q.question }} /></p>
            <p><strong>Your Answer:</strong> <span style={{ color: userAnswers[idx] === q.correct_answer ? 'green' : 'red' }} dangerouslySetInnerHTML={{ __html: userAnswers[idx] || 'Not Answered' }} /></p>
            <p><strong>Correct Answer:</strong> <span dangerouslySetInnerHTML={{ __html: q.correct_answer }} /></p>
            <hr />
          </div>
        ))}
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="App" style={{ background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)", minHeight: "100vh", padding: "20px", color: "white" }}>
      <div style={{ background: "white", color: "black", padding: 30, borderRadius: 10, maxWidth: 700, margin: "0 auto" }}>
        <h1>Quiz App</h1>
        <p><strong>Time Left:</strong> {formatTime(timeLeft)}</p>
        <p><strong>Answered:</strong> {attemptedQuestions.size} / {questions.length}</p>

        <div style={{ marginBottom: 10, display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ background: "#ccc", padding: "5px 10px", margin: 5, borderRadius: 4 }}>⬜ Not Viewed</span>
          <span style={{ background: "#3498db", color: "white", padding: "5px 10px", margin: 5, borderRadius: 4 }}>⬛ Viewed</span>
          <span style={{ background: "#2ecc71", color: "white", padding: "5px 10px", margin: 5, borderRadius: 4 }}>✅ Attempted</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px", justifyContent: "center" }}>
          {questions.map((_, i) => {
            const isVisited = visitedQuestions.has(i);
            const isAttempted = attemptedQuestions.has(i);
            let bg = "#ccc";
            if (isVisited) bg = "#3498db";
            if (isAttempted) bg = "#2ecc71";

            return (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                title={`Question ${i + 1}`}
                style={{
                  width: 32,
                  height: 32,
                  margin: 5,
                  backgroundColor: bg,
                  color: "white",
                  fontSize: 14,
                  borderRadius: 6,
                  border: "none",
                  transition: "all 0.3s ease"
                }}>
                {i + 1}
              </button>
            );
          })}
        </div>

        <div style={{ padding: "10px", transition: "all 0.5s ease" }}>
          <h2>Q{currentQuestion + 1}</h2>
          <p dangerouslySetInnerHTML={{ __html: question.question }} />

          {shuffledAnswers.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt)}
              style={{
                display: "block",
                margin: "10px 0",
                padding: "12px",
                width: "100%",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: selectedAnswer === opt ? "#add8e6" : "white",
                color: "black",
                transition: "all 0.3s ease"
              }}
              dangerouslySetInnerHTML={{ __html: opt }}
            />
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: 20 }}>
            <button onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} style={{ flex: 1, padding: "10px 20px", fontSize: 16, backgroundColor: "#add8e6", color: "black", border: "none", borderRadius: 5 }}>Previous</button>
            <button onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))} style={{ flex: 1, padding: "10px 20px", fontSize: 16, backgroundColor: "#add8e6", color: "black", border: "none", borderRadius: 5 }}>Next</button>
          </div>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <button onClick={submitQuiz} style={{ padding: "12px 30px", fontSize: 16, backgroundColor: "#e67e22", color: "white", border: "none", borderRadius: 5 }}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;