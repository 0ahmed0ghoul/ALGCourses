import React, { useState } from "react";
import "../styles/Courses.css"; // Add a CSS file for custom styles
import CourseDisplay from "./courseDisplay";

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState("");

  return (
    <div>
      <section>
        <div className=" bg-light  rounded shadow" style={{"marginTop":"200px"}}>
          <header className="text-center mb-4">
            <h1 className="display-4 text-primary">Courses</h1>
            <p className="lead text-secondary">
              Discover a variety of free and paid courses tailored to your
              learning needs. Select a field to find courses that match your
              interests.
            </p>
          </header>
          <CourseDisplay isDashboard={false} />
        </div>
      </section>
    </div>
  );
};

export default Courses;
