import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizCreator = () => {
  const { teacherId } = useParams(); // Get teacherId from URL
  const navigate = useNavigate(); // Use for navigation after quiz creation
  console.log('Teacher ID:', teacherId);  // Add this line to debug
  const [numQuestions, setNumQuestions] = useState(1); // Number of questions state
  const [questions, setQuestions] = useState([]); // Questions state
  const [title, setTitle] = useState(''); // Title of the quiz
  const [description, setDescription] = useState(''); // Description of the quiz

  // Handle the number of questions input change
  const handleNumQuestionsChange = (e) => {
    setNumQuestions(parseInt(e.target.value, 10)); // Ensure it's a number
  };

  // Handle the button click to generate questions
  const handleAddQuestions = () => {
    const newQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
      newQuestions.push({
        questionText: '',
        options: ['', '', '', ''], // Default four options
        correctOption: '',
      });
    }
    setQuestions(newQuestions);
  };

  // Handle question input change
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field.startsWith('option')) {
      const optionIndex = parseInt(field.split('-')[1], 10);
      updatedQuestions[index].options[optionIndex] = value;
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
  
    // Validate if title and questions are present
    if (!title || questions.length === 0) {
      alert("Please provide a quiz title and at least one question.");
      return;
    }
  
    // Prepare the data to send to the backend
    const quizData = {
      title, // Quiz title
      description, // Quiz description (optional)
      questions: questions.map((q) => ({
        questionText: q.questionText, // Question text
        options: q.options, // Array of options
        correctOption: q.correctOption, // Index of correct option
      })),
    };
  
    try {
      // Make the HTTP request to the backend
      const response = await axios.post(`http://localhost:8081/api/teacher/${teacherId}/create-quiz`, quizData);
  
      // Handle successful response
      if (response.status === 201) {
        alert("Quiz created successfully!");
        navigate(`/teacher/${teacherId}/dashboard`); // Redirect to teacher's dashboard
      }
    } catch (error) {
      // Handle errors
      console.error("Error creating quiz:", error);
      alert("An error occurred while creating the quiz.");
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="card shadow-lg p-4">
        <h1 className="text-center mb-4 text-primary">Quiz Creator</h1>
        <form onSubmit={handleSubmit}>
          {/* Quiz Title Input */}
          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the quiz title"
              required
            />
          </div>

          {/* Description Input (Optional) */}
          <div className="mb-4">
            <label htmlFor="description" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter quiz description"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="numQuestions" className="form-label">
              Number of Questions
            </label>
            <div className="d-flex">
              <input
                type="number"
                id="numQuestions"
                className="form-control me-2"
                value={numQuestions}
                onChange={handleNumQuestionsChange}
                min="1"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddQuestions}
              >
                Add Questions
              </button>
            </div>
          </div>

          {/* Display questions in a grid layout */}
          <div className="row g-4">
            {questions.map((question, index) => (
              <div key={index} className="col-md-4">
                <div className="card p-3 border-0 shadow-sm rounded">
                  <div className="mb-2">
                    <label htmlFor={`question-${index}`} className="form-label">
                      Question {index + 1}
                    </label>
                    <input
                      type="text"
                      id={`question-${index}`}
                      className="form-control"
                      value={question.questionText}
                      onChange={(e) =>
                        handleQuestionChange(index, "questionText", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    {question.options.map((option, optionIndex) => (
                      <div className="mb-2" key={optionIndex}>
                        <label htmlFor={`option-${index}-${optionIndex}`} className="form-label">
                          Option {optionIndex + 1}
                        </label>
                        <input
                          type="text"
                          id={`option-${index}-${optionIndex}`}
                          className="form-control"
                          value={question.options[optionIndex]}
                          onChange={(e) =>
                            handleQuestionChange(index, `option-${optionIndex}`, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mb-2">
                    <label htmlFor={`correctOption-${index}`} className="form-label">
                      Correct Option
                    </label>
                    <select
                      id={`correctOption-${index}`}
                      className="form-select"
                      value={question.correctOption}
                      onChange={(e) =>
                        handleQuestionChange(index, "correctOption", e.target.value)
                      }
                    >
                      {question.options.map((_, optionIndex) => (
                        <option key={optionIndex} value={optionIndex}>
                          Option {optionIndex + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conditionally render the Create Quiz button */}
          {questions.length > 0 && (
            <button type="submit" className="btn btn-success w-100 mt-4">
              Create Quiz
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default QuizCreator;
