// Final App.js code with Horizontal Overview Panel, Square Buttons, Legend, and Answered Count

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
      }
    }
  }, [currentQuestion, quizStarted, questions.length, questions]);

  const handleAnswer = (answer) => {
    if (showReport || timeLeft === 0) return;
    setUserAnswers({ ...userAnswers, [currentQuestion]: answer });
    setAttemptedQuestions((prev) => new Set(prev).add(currentQuestion));
    if (answer === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
    const next = currentQuestion + 1;
    if (next < questions.length) {
      setCurrentQuestion(next);
    }
  };

  const submitQuiz = () => {
    setShowReport(true);
  };

  if (!quizStarted) {
    return (
      <div className="App">
        <h1>Start Quiz</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={startQuiz}>Start Quiz</button>
      </div>
    );
  }

  if (questions.length === 0) return <p>Loading questions...</p>;

  if (showReport) {
    return (
      <div className="App">
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
    <div className="App">
      <h1>Quiz App</h1>
      <p><strong>Time Left:</strong> {formatTime(timeLeft)}</p>
      <p><strong>Answered:</strong> {attemptedQuestions.size} / {questions.length}</p>

      {/* Status Legend */}
      <div style={{ marginBottom: 10 }}>
        <span style={{ background: "#ccc", padding: "5px 10px", marginRight: 10 }}>⬜ Not Viewed</span>
        <span style={{ background: "#3498db", color: "white", padding: "5px 10px", marginRight: 10 }}>⬛ Viewed</span>
        <span style={{ background: "#2ecc71", color: "white", padding: "5px 10px" }}>✅ Attempted</span>
      </div>

      {/* Horizontal Overview Panel */}
      <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px", justifyContent: "center" }}>
        {questions.map((_, i) => {
          const isVisited = visitedQuestions.has(i);
          const isAttempted = attemptedQuestions.has(i);
          let bg = "#ccc"; // Not viewed
          if (isVisited) bg = "#3498db"; // Viewed
          if (isAttempted) bg = "#2ecc71"; // Attempted

          return (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
              title={`Question ${i + 1}`}
              style={{
                width: 30,
                height: 30,
                margin: 5,
                backgroundColor: bg,
                color: "white",
                fontSize: 12,
                borderRadius: 4,
                border: "none"
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div style={{ padding: "10px" }}>
        <h2>Q{currentQuestion + 1}</h2>
        <p dangerouslySetInnerHTML={{ __html: question.question }} />

        {shuffledAnswers.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt)}
            style={{ display: "block", margin: "10px 0", padding: "10px", width: "100%" }}
            dangerouslySetInnerHTML={{ __html: opt }}
          />
        ))}

        <button onClick={submitQuiz} style={{ marginTop: "20px", backgroundColor: "#e67e22", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px" }}>
          Submit Quiz
        </button>
      </div>
    </div>
  );
}

export default App;
