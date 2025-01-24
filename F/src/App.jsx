import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authContext";
import "bootstrap/dist/css/bootstrap.min.css";

// Import Components
import Dashboard from "./Dahboard";
import Register from "./user/Register";
import Login from "./user/Login";
import UserDashboard from "./user/UserDashboard";
import Navbar from "./navbar";
import Courses from "./courses/courses";
import Quizzes from "./quizzes/quizzes";
import CreateCourseForm from "./courses/createCourse";
import QuizCreator from "./quizzes/createQuizzes";
import TeacherSignup from "./teacher/teacherSignup";
import TeacherDashboard from "./teacher/teacherDashboard";
import CourseDetails from "./courses/coursedetails";
import EditCourse from "./courses/courseEdit";
import TeacherEdit from "./teacher/teacherEdit";
import QuizPlay from "./quizzes/quizPlay";
import Admin from "./Admin/admin";

import "./styles/App.css"; // Add custom global styles

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div>
          <Routes>
          <Route path="/" element={<Dashboard />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />} />

            {/* User Routes */}
            <Route path="/signup" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetails />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/quiz/:id" element={<QuizPlay />} />
            <Route path="/user/dashboard/:id" element={<UserDashboard />} />

            {/* Teacher Routes */}
            <Route path="/teacher/signup" element={<TeacherSignup />} />
            <Route path="/teacher/:id/edit" element={<TeacherEdit />} />
            <Route path="/teacher/:id/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/:id/create-course" element={<CreateCourseForm />} />
            <Route path="/teacher/:teacherId/create-quizzes" element={<QuizCreator />} />
            <Route path="/teacher/:id/course/:courseId/edit" element={<EditCourse />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
