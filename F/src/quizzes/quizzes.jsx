import React, { useState } from "react";
import "../styles/Courses.css"; // Add a CSS file for custom styles
import QuizDisplay from "./quizzesDisplay";

const Quizzes = () => {
  const [selectedCourse, setSelectedCourse] = useState("");

  return (
    <div className="container  bg-light  rounded shadow">
      <div>
      <header className="text-center mb-4">
        <h1 className="display-4 text-primary">Quizzes</h1>
        <p className="lead text-secondary">
          Discover a variety of free and paid quizzes tailored to your learning needs. Select a field to find quizzes that match your interests.
        </p>
      </header>

      <section className="mb-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <label htmlFor="courses" className="form-label text-primary">Field</label>
            <select
              id="courses"
              name="courses"
              className="form-select border-primary text-primary"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="" disabled>
                Select a Field
              </option>
              <option value="web">Web Development</option>
              <option value="js-oop">JS OOP and Frameworks</option>
              <option value="db">Database</option>
              <option value="network">Network</option>
              <option value="english">English</option>
            </select>
          </div>
        </div>
      </section>

      <hr />

      <section className="text-center">
      <QuizDisplay isDashboard={false} />
      </section>
      </div>
    </div>
  );
};

export default Quizzes;
