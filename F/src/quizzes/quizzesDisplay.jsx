import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../authContext";
import { useNavigate } from "react-router-dom";
import '../styles/quiz.css'
const QuizDisplay = ({ isDashboard }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8081/getquizzes") // Replace with your API endpoint
      .then((response) => {
        setQuizzes(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setLoading(false);
      });
  }, []);

  const checkUser = (quiz) => {
    if (auth) {
      navigate(`/quiz/${quiz.id}`);
    } else {
      alert("You need to log in first to view quiz details.");
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  const reversedQuizzes = [...quizzes].reverse().slice(0, 2);

  return (
    <Container className="my-5">
      <div className="flex-nowrap">
        {reversedQuizzes.map((quiz, index) => (
          <div key={index} className="quiz-card">
            <Card className="h-100 shadow-sm">
              <Card.Img
                variant="top"
                src={quiz.image || "https://via.placeholder.com/300x150?text=No+Image"}
                alt={quiz.title || `Quiz ${index + 1}`}
                className="quiz-card-img"
              />
              <Card.Body>
                <Card.Title className="quiz-card-title text-truncate">
                  {quiz.title || `Quiz ${index + 1} Title`}
                </Card.Title>
                <Card.Text className="quiz-card-description">
                  {quiz.description || "Description not available"}
                </Card.Text>
                <Button variant="success" className="w-100" onClick={() => checkUser(quiz)}>
                  Start Quiz
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </Container>
  );
  
};

export default QuizDisplay;
