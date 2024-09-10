// Example of Session-Based Authentication:

const express = require("express");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// Setting up session middleware
app.use(
    session({
        secret: "your_secret_key", // Make sure this is a secure key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set to true if using HTTPS
    }),
);

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "./login.html"));
});

app.get("/view", (req, res) => {
    res.sendFile(path.join(__dirname, "./view.html"));
});

// Fake database
const users = [
    {
        id: 1,
        email: "user1@example.com",
        passwordHash: bcrypt.hashSync("password1", 10),
        content: "User 1 content",
    },
    {
        id: 2,
        email: "user2@example.com",
        passwordHash: bcrypt.hashSync("password2", 10),
        content: "User 2 content",
    },
];

const profile = [
    {
        email: "user1@example.com",
        name: "Himansu",
        passion: "Backend Development",
    },
    {
        email: "user2@example.com",
        name: "Prashant",
        passion: "Frontend Development",
    },
];

// Login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find((user) => user.email === email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
        req.session.userId = user.id; // Create session

        // Find profile data based on email
        const userProfile = profile.find((profile) => profile.email === email);

        // Prepare response with both profile and content data
        res.json({
            message: "Login successful",
            profile: userProfile,
            content: user.content,
        });
    } else {
        res.status(401).send("Invalid credentials");
    }
});

app.get("/content", (req, res) => {
    const userId = req.session.userId; // Get the userId from the session
    if (userId) {
        const user = users.find((user) => user.id === userId);
        if (user) {
            // Find profile data based on email
            const userProfile = profile.find(
                (profile) => profile.email === user.email,
            );
            if (userProfile) {
                res.json({ profile: userProfile }); // Send profile data
                res.sendFile(path.join(__dirname, "./view.html"));
            } else {
                res.status(404).send("Profile not found");
            }
        } else {
            res.status(404).send("User not found");
        }
    } else {
        res.status(401).send("Please log in to view your content");
    }
});

// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     const user = users.find((user) => user.email === email);
//     if (user && (await bcrypt.compare(password, user.passwordHash))) {
//         req.session.userId = user.id; // Create session
//         console.log("Session created for user ID:", user.id); // Debugging line
//         res.send("Login successful");
//     } else {
//         res.status(401).send("Invalid credentials");
//     }
// });

// User-specific content
// app.get("/content", (req, res) => {
//     const user = users.find((user) => user.id === req.session.userId);
//     if (user) {
//         res.send(user.content); // Send content specific to logged-in user
//     } else {
//         res.status(401).send("Please log in to view your content");
//     }
// });

// app.get("/content", (req, res) => {
//     const userId = req.session.userId; // Get the userId from the session
//     if (userId) {
//         const user = users.find((user) => user.id === userId);
//         if (user) {
//             res.json({ content: user.content }); // Send content specific to the logged-in user
//         } else {
//             res.status(404).send("User not found");
//         }
//     } else {
//         res.status(401).send("Please log in to view your content");
//     }
// });

app.get("/test-session", (req, res) => {
    if (req.session.userId) {
        res.send(`Session active. User ID: ${req.session.userId}`);
    } else {
        res.send("No session active");
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
