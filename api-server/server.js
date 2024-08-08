const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const { SECRET_KEY } = require('../config');
const todoTasks = require("./tasks");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Mock local database
const users = [];
const tasks = [...todoTasks];

// Create default admin and user
const createDefaultUsers = async () => {
  const defaultAdmin = {
    username: "adminDefault",
    email: "admin@mail.com",
    password: await bcrypt.hash("admin123", 10),
    role: "admin",
  };
  const defaultUser = {
    username: "userDefault",
    email: "user@mail.com",
    password: await bcrypt.hash("user123", 10),
    role: "user",
  };
  users.push(defaultAdmin, defaultUser);
};
createDefaultUsers();


// Register
app.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;

  // Check if user already exists
  const userExists = users.find((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user with role
  users.push({ username, email, password: hashedPassword, role });

  res.status(201).json({ message: "User registered successfully" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Create JWT
  const token = jwt.sign({ email: user.email, role: user.role, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// Authenticate the token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Get user profile
app.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(user => user.email === req.user.email);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { username, email, role } = user;
  res.json({ username, email, role });
});

// Authorize role
const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

// Get tasks
app.get("/tasks", authenticateToken, (req, res) => {
  const sortedTasks = tasks.sort(
    (a, b) => new Date(a.datetime) - new Date(b.datetime)
  );
  res.json(sortedTasks);
});

// Get task with id
app.get("/tasks/:id", authenticateToken, authorizeRole("admin"), (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }


})

const generateTaskId = () => {
  const ids = tasks.map((task) => task.id);
  const maxId = ids.length ? Math.max(...ids) : 0;
  return maxId + 1;
};

const validateTask = (req, res, next) => {
    const { name, description } = req.body;
  
    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }
  
    if (name.length < 1 || name.length > 30) {
      return res
        .status(400)
        .json({ message: "Task name must be between 1 and 30 characters" });
    }
  
    if (description.length < 1 || description.length > 150) {
      return res
        .status(400)
        .json({ message: "Task description must be between 1 and 150 characters" });
    }
  
    next();
  };

// Create task
app.post("/tasks", authenticateToken, validateTask, authorizeRole("admin"), (req, res) => {
  const task = {
    id: generateTaskId(),
    ...req.body,
    createdBy: req.user.email,
  };
  tasks.push(task);
  res.status(201).json(task);
});

// Update task
app.put("/tasks/:id", authenticateToken, validateTask, authorizeRole("admin"), (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };

  res.status(200).json(tasks[taskIndex]);
});

// Delete task
app.delete(
  "/tasks/:id",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    tasks.splice(taskIndex, 1);
    res.status(200).json({ message: "Task deleted successfully" });
  }
);

// Get all users
app.get("/users", authenticateToken, authorizeRole("admin"), (req, res) => {
  res.json(users);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
