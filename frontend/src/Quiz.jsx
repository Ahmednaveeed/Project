import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';
import "./LearnerProfile.css"; // Reuse styles for sidebar and layout

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      question: "What does a red traffic light indicate?",
      options: [
        "Slow down and proceed with caution",
        "Stop and wait until the light turns green",
        "Speed up to clear the intersection",
        "Ignore if there is no police officer present"
      ],
      correctAnswer: 1
    },
    {
      question: "When approaching a roundabout, you should:",
      options: [
        "A) Yield to traffic already in the roundabout",
        "B) drift and make donuts",
        "C) Honk your horn to alert other drivers",
        "D) Stop completely before entering"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the speed limit in residential areas unless otherwise posted?",
      options: [
        "A) 30 km/h",
        "B) 50 km/h",
        "C) 70 km/h",
        "D) 100 km/h"
      ],
      correctAnswer: 1
    },
    {
      question: "When should you use your headlights?",
      options: [
        "A) Only at night",
        "B) When visibility is less than 150 meters",
        "C) Only in heavy rain",
        "D) Only on highways"
      ],
      correctAnswer: 1
    },
    {
      question: "What does a yellow traffic light mean?",
      options: [
        "A) Speed up to cross the intersection",
        "B) Stop if it's safe to do so",
        "C) Ignore it as it's about to turn green",
        "D) Honk your horn and proceed"
      ],
      correctAnswer: 1
    },
    {
      question: "When parking uphill with a curb, you should turn your wheels:",
      options: [
        "A) Away from the curb",
        "B) Toward the curb",
        "C) Straight ahead",
        "D) It doesn't matter"
      ],
      correctAnswer: 0
    },
    {
      question: "What does a flashing red traffic light mean?",
      options: [
        "A) Treat it like a stop sign",
        "B) Proceed with caution",
        "C) The light is broken, ignore it",
        "D) Speed up to clear the intersection"
      ],
      correctAnswer: 0
    },
    {
      question: "When are you allowed to pass another vehicle?",
      options: [
        "A) When there's a solid yellow line on your side",
        "B) When you're in a no-passing zone",
        "C) When there's a dashed line on your side",
        "D) Whenever you feel it's safe"
      ],
      correctAnswer: 2
    },
    {
      question: "What should you do when an emergency vehicle approaches with flashing lights?",
      options: [
        "A) run for your life",
        "B) Pull over to the right and stop",
        "C) Continue driving normally",
        "D) Flash your headlights at them"
      ],
      correctAnswer: 1
    },
    {
      question: "What does a white painted curb typically indicate?",
      options: [
        "A) Loading zone for passengers or mail",
        "B) No parking at any time",
        "C) Parking for electric vehicles only",
        "D) Free parking zone"
      ],
      correctAnswer: 0
    }
  ];

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) correct++;
    });
    setScore(correct);
    setShowResult(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="quiz-page">
      <div className="sidebar">
        <h2 className="sidebar-title">Road Master</h2>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/LearnerProfile")}>My Profile</li>
          <li onClick={() => navigate("/ViewBookings")}>View Bookings</li>
          <li onClick={() => navigate("/LearningMaterial")}>Learning Material</li>
          <li className="active" onClick={() => navigate("/Quiz")}>Take Quiz</li>
          <li onClick={() => navigate("/BookInstructor")}>Book Instructor</li>
        </ul>
      </div>

      <div className="quiz-content">
        {showResult ? (
          <div className="quiz-result">
            <h2>Quiz Results</h2>
            <p className={`result ${score >= 8 ? 'pass' : 'fail'}`}>
              {score >= 8 ? '🎉 You Passed!' : '❌ Try Again!'}
            </p>
            <p className="score">Score: {score}/10</p>
            <div className="quiz-actions">
              <button onClick={restartQuiz}>Retake Quiz</button>
              <button onClick={() => navigate("/LearnerProfile")}>Back to Dashboard</button>
            </div>
          </div>
        ) : (
          <>
            <div className="quiz-header">
              <h2>Traffic Rules Quiz</h2>
              <p>Question {currentQuestion + 1} of {questions.length}</p>
            </div>

            <div className="quiz-question-box">
              <h3>{questions[currentQuestion].question}</h3>
              <div className="quiz-options">
                {questions[currentQuestion].options.map((option, index) => (
                  <div
                    key={index}
                    className={`quiz-option ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>

            <div className="quiz-controls">
              <button onClick={handlePrevQuestion} disabled={currentQuestion === 0}>Previous</button>
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={calculateScore}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                >
                  Submit Quiz
                </button>
              )}
            </div>

            <div className="quiz-progress-bar">
              <div
                className="quiz-progress"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
