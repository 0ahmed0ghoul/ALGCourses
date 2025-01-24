import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/quizPlay.css';

function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook to navigate to other pages
  const [quiz, setQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/quiz/${id}`)
      .then((response) => {
        const quizData = response.data.quizData || [];
        if (quizData.length > 0) {
          const parsedQuestions = JSON.parse(quizData[0].questions);
          setQuiz(parsedQuestions);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      });
  }, [id]);

  const handleAnswerClick = (selectedAnswerIndex) => {
    const correctAnswerIndex = parseInt(quiz[currentQuestionIndex][2], 10); // Ensure correctOption is parsed as an integer

    // Check if the selected answer is correct
    if (selectedAnswerIndex === correctAnswerIndex) {
      setScore((prevScore) => prevScore + 1); // Update score only if answer is correct
    }

    // Style the options based on the correct answer
    const buttons = document.querySelectorAll('.answer');
    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === correctAnswerIndex) {
        button.style.border = '3px solid green';
        button.style.background = 'rgba(0, 255, 17, 0.408)';
      } else {
        button.style.border = '3px solid red';
        button.style.background = 'rgba(255, 0, 0, 0.408)';
      }
      button.style.color = 'black';
    });
  };

  const resetButtonStyles = () => {
    const buttons = document.querySelectorAll('.answer');
    buttons.forEach((button) => {
      button.disabled = false;
      button.style.border = '';
      button.style.background = '';
      button.style.color = '';
    });
  };

  const handleNextClick = () => {
    resetButtonStyles();
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < quiz.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setShowScore(true);
    }
  };

  const handleRestartClick = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    resetButtonStyles();
  };

  const handleGoHomeClick = () => {
    navigate('/'); // This will navigate to the homepage or root route
  };

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (!quiz.length) {
    return <div>No quiz data available.</div>;
  }

  const currentQuestion = quiz[currentQuestionIndex];
  const questionText = currentQuestion ? currentQuestion[0] : '';
  const options = currentQuestion ? currentQuestion[1] : [];

  return (
    <div id="quiz-container">
      {showScore ? (
        <div>
          <h2>You scored {score} out of {quiz.length}!</h2>
          <button onClick={handleRestartClick} style={{width:"100%",height:"fit-content",margin:"10px 10px 10px 0",textAlign:"center"}}>Restart Quiz</button>
          <button onClick={handleGoHomeClick} style={{width:"100%",height:"fit-content",margin:"10px 10px 10px 0",textAlign:"center"}}>Go to Homepage</button>
        </div>
      ) : (
        <>
          <h2 id="question">{questionText}</h2>
          <div id="answers">
            {options.length > 0 ? (
              options.map((option, index) => (
                <button
                  key={index}
                  className="answer"
                  onClick={() => handleAnswerClick(index)}
                >
                  {option}
                </button>
              ))
            ) : (
              <div>No options available for this question.</div>
            )}
          </div>
          <button id="next-btn" onClick={handleNextClick}>
            Next Question
          </button>
        </>
      )}
    </div>
  );
}

export default QuizPlay;
