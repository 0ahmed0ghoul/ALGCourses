import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import mysql from "mysql";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import fs from 'fs';

ffmpeg.setFfmpegPath('C:/ffmpeg/bin/ffmpeg.exe'); 
ffmpeg.setFfprobePath('C:/ffmpeg/bin/ffprobe.exe');
const app = express();

app.use(cookieParser()); 
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(session({secret: "your-secret-key",resave: false,saveUninitialized: true,cookie: {secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000, },}));
app.use(cors({origin: "http://localhost:5173", methods: "GET,POST,PUT,DELETE", credentials: true, }));
app.use("../F/public", express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({host: "localhost",user: "root",password: "",database: "ga",});
db.connect((err) => {if (err) throw err;console.log("Connected to MySQL");});



const storage = multer.diskStorage({
  destination: (req, file, cb) => {cb(null, path.join(__dirname, "uploads"));},
  filename: (req, file, cb) => {
    const teacherId = req.params.id; // Access the teacher ID from req.params
    const uniqueName = `course-${teacherId}-${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Use a unique name for the file
  },
});

const upload = multer({ storage });
const verifyUser = (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1]; // 'Bearer <token>'
    if (!token) {
    token = req.cookies?.token;
  }
  if (!token) {
    return res.status(403).json({ Error: "Token is missing" });
  }
  jwt.verify(token, "jwt-secret-key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ Error: "Invalid or expired token" });
    }
    req.id = decoded.id;
    req.email = decoded.email;
    next();
  });
};
app.get("/", verifyUser, (req, res) => {
  if (req.id) {
    db.query(
      "SELECT name, email, id FROM users WHERE id = ?",
      [req.id],
      (err, results) => {
        if (err || results.length === 0) {
          console.error("SQL Error or No Results:", err);
          return res.status(500).json({ Error: "Failed to fetch user data" });
        }
        res.json({
          Status: "Success",
          name: results[0].name,
          email: results[0].email,
          id: results[0].id,
        });
      }
    );
  } else {
    res.status(401).json({ Error: "Unauthorized" });
  }
});


app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    "INSERT INTO users (name, email, password,isTeacher) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword,false],
    (err, results) => {
      if (err) {
        return res.status(500).json({ Status: "Error", error: err });
      }
      const user_id = results.id;
      const token = jwt.sign({ user_id }, "jwt-secret-key", {
        expiresIn: "1d",
      });
      res.status(201).json({
        Status: "Success",
        message: "User created",
        token,
        name
      });
    }
  );
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, data) => {
    if (err) {
      return res.status(500).json({ Error: "Login error in server" });
    }
    if (data.length > 0) {
      bcrypt.compare(password.toString(), data[0].password, (err, result) => {
        if (err) {
          return res.status(500).json({ Error: "Password compare error" });
        }
        if (result) {
          const name = data[0].name;
          const userId = data[0].id;
          req.session.email = data[0].email;
          const token = jwt.sign({ id: userId, name: name, email: data[0].email },"jwt-secret-key",{ expiresIn: "1d" });
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
          });
          return res.json({ Status: "Success", token,name }); 
        } else {
          console.error("Password mismatch");
          return res.status(400).json({ Error: "Password not matched" });
        }
      });
    } else {
      console.error("No user found with email:", email);
      return res.status(404).json({ Error: "No email found" });
    }
  });
});
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ Error: "Failed to logout." });
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.json({ Status: "Success" });
  });
});
app.get("/api/user/:id", (req, res) => {
  const { id } = req.params; 
  db.query("SELECT name, email, isTeacher, savedCourses, savedQuizzes FROM users WHERE id = ?",[id],
    (err, results) => {
      if (err) {
        console.error("Error:", err); 
        return res.status(500).json({ Error: "Failed to fetch user data" });
      }

      if (results.length === 0) {
        return res.status(404).json({ Error: "User not found" });
      }
      res.json({
        Status: "Success",
        name: results[0].name,
        email: results[0].email,
        isTeacher: results[0].isTeacher,
        savedCourses: results[0].savedCourses || 0,
        savedQuizzes: results[0].savedQuizzes || 0,
      });
    }
  );
});
app.put("/update-user/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "UPDATE users SET isTeacher = ? WHERE id = ?",
    [true, id], 
    (err, results) => {
      if (err) {
        console.error("Error updating user:", err); 
        return res.status(500).json({ error: "Failed to update user" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({
        message: "User updated successfully",
        userId: id,
      });
    }
  );
});
app.get("/check-teacher", verifyUser, (req, res) => {
  const userId = req.id; // Provided by verifyUser middleware
  if (!userId) {
    return res
      .status(400)
      .json({ Error: "Invalid session or user not authenticated" });
  }

  const sql = "SELECT * FROM teachers WHERE userId = ?";
  db.query(sql, [userId], (err, data) => {
    if (err) {
      console.error("Error querying teachers table:", err);
      return res.status(500).json({ Error: "Server error" });
    }
    if (data.length > 0) {
      return res.json({ isTeacher: true, teacherId: data[0].teacher_id });
    } else {
      return res.json({ isTeacher: false });
    }
  });
});
// Not in use
// app.post("/teacher/login", (req, res) => {
//   const { email, password } = req.body;

//   const checkUserSql = "SELECT * FROM users WHERE email = ?";
//   db.query(checkUserSql, [email], (err, userData) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ Error: "Server error" });
//     }
//     if (userData.length === 0) {return res.status(404).json({ Error: "Invalid email or password" });}
//     const userId = userData[0].id; 

//     const fetchTeacherSql = "SELECT * FROM teachers WHERE userId = ?";
//     db.query(fetchTeacherSql, [userId], (err, teacherData) => {
//       if (err) {
//         console.error("Database error:", err);
//         return res.status(500).json({ Error: "Server error" });
//       }
//       if (teacherData.length === 0) {
//         return res.status(404).json({ Error: "Teacher not found" });
//       }
//       const teacher = teacherData[0];
//       bcrypt.compare(password, teacher.password, (err, isMatch) => {
//         if (err) {
//           console.error("Error comparing passwords:", err);
//           return res.status(500).json({ Error: "Password comparison error" });
//         }

//         if (!isMatch) {
//           return res.status(401).json({ Error: "Invalid email or password" });
//         }
//         return res.json({
//           Status: "Login successful",
//           user: {
//             email: userData[0].email,
//             firstName: userData[0].first_name,
//             lastName: userData[0].last_name,
//             country: userData[0].country,
//             grade: userData[0].grade,
//             bio: teacher.bio,
//             profilePicture: userData[0].profile_picture,
//             teacherId: userData[0].teacher_id,
//           },
//         });
//       });
//     });
//   });
// });
app.post("/teacher/signup", verifyUser, upload.single("profilePicture"), (req, res) => {
  const { password, firstName, lastName, dob, country, grade, bio } = req.body;
  const email = req.email; // Email from verified token

  if (!password || !firstName || !lastName || !dob || !country || !grade || !bio) {
    return res.status(400).json({ Error: "All fields are required." });
  }

  const profilePicture = req.file ? req.file.filename : null;

  const checkUserSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkUserSql, [email], (err, userData) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Server error" });
    }

    if (userData.length === 0) {
      return res.status(404).json({ Error: "User does not exist" });
    }
    const user_id = userData[0].id;

    if (req.file) {
      const newProfilePictureName = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${user_id}-${Date.now()}${path.extname(req.file.originalname)}`;
      const filePath = path.join(__dirname, "uploads", newProfilePictureName);
      fs.renameSync(path.join(__dirname, "uploads", req.file.filename), filePath);
      req.file.filename = newProfilePictureName;
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ Error: "Password hashing error" });
      }
      const insertTeacherSql = `INSERT INTO teachers (userId, password, first_name, last_name, dob, country, grade, bio, profile_picture)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertTeacherSql,
        [user_id, hashedPassword, firstName, lastName, dob, country, grade, bio, req.file.filename],
        (err, result) => {
          if (err) {
            console.error("Error inserting teacher:", err);
            return res.status(500).json({ Error: "Teacher signup error" });
          }
          res.json({
            Status: "Teacher signup successful",
            userId: user_id,
            teacherId: result.insertId,
          });
        }
      );
    });
  });
});
app.put("/teacher/:id/edit", upload.single('profilePicture'), (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, dob, country, grade, bio } = req.body;
  const profilePicture = req.file ? req.file.filename : null;  // Get filename from the uploaded file
  const sql = 'UPDATE teachers SET first_name = ?, last_name = ?, dob = ?, country = ?, grade = ?, bio = ?, profile_picture = ? WHERE teacher_id = ?';
  db.query(sql, [firstName, lastName, dob, country, grade, bio, profilePicture, id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ Error: "Teacher not found or not authorized" });
    }
    res.status(200).json({ message: "Teacher updated successfully" });
  });
});
app.get("/api/teacher/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM teachers WHERE teacher_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ Error: "Teacher not found" });
    }
    res.json(result[0]);
  });
});
app.get("/api/teacher/:id/courses", (req, res) => {
  const { id: teacherId } = req.params;
  const getCourseSql = `SELECT * FROM courses WHERE teacher_id = ?`;
  db.query(getCourseSql, teacherId, (err, data) => {
    if (err) {
      console.error("Error getting courses:", err);
      return res.status(500).json({ error: "Error retrieving courses" });
    }
    res.status(200).json({ message: "Courses retrieved successfully", data });
  });
});
app.get("/api/teacher/:id/quizzes", (req, res) => {
  const { id: teacherId } = req.params;

  const getCourseSql = `SELECT * FROM quizzes WHERE teacher_id = ?`;

  db.query(getCourseSql, teacherId, (err, data) => {
    if (err) {
      console.error("Error getting courses:", err);
      return res.status(500).json({ error: "Error retrieving courses" });
    }
    res.status(200).json({ message: "Courses retrieved successfully", data });
  });
});
app.post("/api/teacher/:id/create-course", upload.single("videoFile"), (req, res) => {
  const { id: teacherId } = req.params;
  const { title, description, price, category, level } = req.body;
  const videoFile = req.file;

  if (!title || !description || !videoFile || !category || !level) {
    console.error("Missing required fields");
    return res.status(400).json({ error: "Missing required fields" });
  }
  const finalPrice = price ? price : 0; 

  const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  if (!validVideoTypes.includes(videoFile.mimetype)) {
    console.error("Invalid file type. Only video files are allowed.");
    return res.status(400).json({ error: "Invalid file type. Only video files are allowed." });
  }
  const thumbnailPath = path.join('uploads/thumbnails', `${videoFile.filename}.png`);

  ffmpeg(videoFile.path)
    .screenshots({
      count: 1,
      folder: 'uploads/thumbnails',
      filename: `${videoFile.filename}.png`, 
      size: '320x240',
    })
    .on('end', () => {
      const insertCourseSql = `
        INSERT INTO courses (title, description, price, category, level, video_file_path, thumbnail, teacher_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [title, description, finalPrice, category, level, videoFile.path, thumbnailPath, teacherId];
      db.query(insertCourseSql, params, (err, result) => {
        if (err) {
          console.error("Error inserting course:", err);
          return res.status(500).json({ error: "Course creation error" });
        }
        res.status(201).json({
          message: "Course created successfully",
          courseId: result.insertId,
        });
      });
    })
    .on('error', (err) => {
      console.error("Error extracting thumbnail:", err);
      return res.status(500).json({ error: "Error extracting thumbnail" });
    });
});
app.put("/api/teacher/:teacherId/course/:courseId/edit", (req, res) => {
  const { teacherId, courseId } = req.params;
  const { title, description, price, level, category } = req.body;
  console.log(title, description, price, level, category);
  const sql = "UPDATE courses SET title = ?, description = ?, price = ?, category = ?, level = ? WHERE id = ? AND teacher_id = ?";
  db.query(sql, [title, description, price, category, level, courseId, teacherId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ Error: "Course not found or not authorized" });
    }
    res.status(200).json({ message: "Course updated successfully" });
  });
});
app.delete("/api/teacher/:teacherId/course/:courseId", (req, res) => {
  const { teacherId, courseId } = req.params;
  const sql = "DELETE FROM courses WHERE id = ? AND teacher_id = ?";
  db.query(sql, [courseId, teacherId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Error: "Course not found or not authorized" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  });
});
app.post('/api/teacher/:teacherId/create-quiz', (req, res) => {
  const { teacherId } = req.params;
  const { title, description, questions } = req.body;

  if (!title || !questions || questions.length === 0) {
    return res.status(400).json({ message: "Quiz title and at least one question are required." });
  }
  const formattedQuestions = questions.map(q => [
    q.questionText,
    q.options,
    q.correctOption
  ]);
  const insertQuizSql = "INSERT INTO quizzes (title, description, teacher_id, questions) VALUES (?, ?, ?, ?)";
  const questionsJson = JSON.stringify(formattedQuestions); 
  db.query(insertQuizSql, [title, description, teacherId, questionsJson], (err, result) => {
    if (err) {
      console.error("Error inserting quiz:", err);
      return res.status(500).json({ message: "Error creating quiz." });
    }
    res.status(201).json({ message: "Quiz created successfully!" });
  });
});
app.delete("/api/teacher/:teacherId/quiz/:quizId", (req, res) => {
  const { teacherId, quizId } = req.params;
  const sql = "DELETE FROM quizzes WHERE id = ? AND teacher_id = ?";
  db.query(sql, [quizId, teacherId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Error: "quiz not found or not authorized" });
    }
    res.status(200).json({ message: "quizze deleted successfully" });
  });
});



app.get("/getcourses", (req, res) => {
  const getCourseSql = `SELECT courses.*, teachers.first_name,last_name  
  FROM courses JOIN teachers ON courses.teacher_id = teachers.teacher_id`;

  db.query(getCourseSql, (err, data) => {
    if (err) {
      console.error("Error retrieving courses:", err);
      return res.status(500).json({ error: "Error retrieving courses" });
    }
    res.status(200).json({ message: "Courses retrieved successfully", data });
  });
});
app.get("/getquizzes", (req, res) => {
  const getquizzesSql = `SELECT quizzes.*, teachers.first_name,last_name  
    FROM quizzes JOIN teachers ON quizzes.teacher_id = teachers.teacher_id`;
  db.query(getquizzesSql, (err, data) => {
    if (err) {
      console.error("Error getting quizzes:", err);
      return res.status(500).json({ error: "Error retrieving quizzes" });
    }
    res.status(200).json({ message: "Quizzes retrieved successfully", data });
  });
});
app.get('/checkSaved/:name/:id', (req, res) => {
  const { name, id } = req.params;
  const sql = 'SELECT savedCourses FROM users WHERE name = ?';
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const savedCourses = result[0].savedCourses || [];
    const isSaved = savedCourses.includes(id); 
    res.status(200).json({ isSaved });
  });
});
app.post('/savecourse', (req, res) => {
  const { name, id } = req.body;
  const sql = 'SELECT savedCourses FROM users WHERE name = ?';
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }
    if (result.length === 0) {return res.status(404).json({ error: 'User not found' });}
    let savedCourses = result[0].savedCourses;

    if (typeof savedCourses === 'string') {
      try {savedCourses = JSON.parse(savedCourses);} 
      catch (parseError) {savedCourses = []; }
    }
    if (!Array.isArray(savedCourses)) {savedCourses = [];}
    if (savedCourses.includes(id)) {return res.status(400).json({ error: 'Course already saved' });}
    savedCourses.push(id);
    const updateSql = 'UPDATE users SET savedCourses = ? WHERE name = ?';
    db.query(updateSql, [JSON.stringify(savedCourses), name], (updateErr, updateResult) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ error: 'Error saving course to user' });
      }
      res.status(200).json({ message: 'Course saved successfully!' });
    });
  });
});
app.post('/unsavecourse', (req, res) => {
  const { name, id } = req.body;

  const sql = 'SELECT savedCourses FROM users WHERE name = ?';
  
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Parse savedCourses if it is a string (e.g., JSON string)
    let savedCourses = result[0].savedCourses;
    if (typeof savedCourses === 'string') {
      try {
        savedCourses = JSON.parse(savedCourses); // Parse if it's a JSON string
      } catch (parseErr) {
        console.error("Error parsing savedCourses:", parseErr);
        return res.status(500).json({ error: 'Error parsing savedCourses' });
      }
    }

    // Ensure savedCourses is an array
    if (!Array.isArray(savedCourses)) {
      savedCourses = [];
    }

    // Remove the course from the saved courses list
    savedCourses = savedCourses.filter(courseId => courseId !== id);

    const updateSql = 'UPDATE users SET savedCourses = ? WHERE name = ?';
    db.query(updateSql, [JSON.stringify(savedCourses), name], (updateErr, updateResult) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ error: 'Error unsaving course' });
      }

      res.status(200).json({ message: 'Course unsaved successfully!' });
    });
  });
});
app.get("/course/:id", (req, res) => {
  const { id } = req.params; // Destructure the id from req.params
  const getCourseSql = `
    SELECT courses.*, teachers.first_name, teachers.last_name 
    FROM courses JOIN teachers ON courses.teacher_id = teachers.teacher_id WHERE courses.id = ?`;
  db.query(getCourseSql, [id], (err, data) => {
    if (err) {
      console.error("Error getting course:", err);
      return res.status(500).json({ error: "Error retrieving course" });
    }
    res.status(200).json({ message: "Course retrieved successfully", data });
  });
});
app.get("/quiz/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received quiz ID:", id);  // Log the ID to verify it
  const getQuizSql = `
    SELECT quizzes.*, teachers.first_name, teachers.last_name FROM quizzes
    JOIN teachers ON quizzes.teacher_id = teachers.teacher_id WHERE quizzes.id = ?;`;
  try {
    db.query(getQuizSql, [id], (error, results) => {
      if (error) {
        console.error("Error querying database:", error);
        return res.status(500).json({ error: "Error retrieving quiz" });
      }
      if (!results || results.length === 0) {return res.status(404).json({ message: "Quiz not found" });}
      res.status(200).json({ message: "Quiz retrieved successfully", quizData: results });
    });
  } catch (err) {
    console.error("Error getting quiz:", err);
    res.status(500).json({ error: "Error retrieving quiz" });
  }
});














// Utility function to promisify db.query
const query = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

app.get('/admin', async (req, res) => {
  try {
    // Fetch data from all tables
    const users = await query('SELECT * FROM users');
    const teachers = await query('SELECT * FROM teachers');
    const courses = await query('SELECT * FROM courses');
    const quizzes = await query('SELECT * FROM quizzes');

    // Combine all data into a single response
    res.json({
      users,
      teachers,
      courses,
      quizzes
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Error retrieving data' });
  }
});

app.delete("/api/quiz/:quizId", (req, res) => {
  const { quizId } = req.params;
  const sql = "DELETE FROM quizzes WHERE id = ?";
  db.query(sql, [quizId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Error: "quiz not found or not authorized" });
    }
    res.status(200).json({ message: "quizze deleted successfully" });
  });
});
app.delete("/api/course/:courseId", (req, res) => {
  const { courseId } = req.params;
  const sql = "DELETE FROM courses WHERE id = ?";
  db.query(sql, [courseId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Error: "quiz not found or not authorized" });
    }
    res.status(200).json({ message: "quizze deleted successfully" });
  });
});
app.delete("/api/user/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Error: "user not found or not authorized" });
    }
    res.status(200).json({ message: "user deleted successfully" });
  });
});

app.delete("/api/teacher/:teacherId", (req, res) => {
  const { teacherId } = req.params;
  const sql = "DELETE FROM teachers WHERE teacher_id = ?";
  db.query(sql, [teacherId], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ Error: "Server error" });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Error: "teacher not found or not authorized" });
    }
    res.status(200).json({ message: "teacher deleted successfully" });
  });
});


app.listen(8081, () =>
  console.log("Server running on : http://localhost:8081")
);
