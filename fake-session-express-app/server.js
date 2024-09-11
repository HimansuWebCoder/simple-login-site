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
    {
        id: 3,
        email: "user3@example.com",
        passwordHash: bcrypt.hashSync("password3", 10),
        content: "User 2 content",
    },
];

const profile = [
    {
        id: 1,
        email: "user1@example.com",
        name: "Himansu",
        passion: "Backend Development",
    },
    {
        id: 2,
        email: "user2@example.com",
        name: "Prashant",
        passion: "Frontend Development",
    },
    {
        id: 3,
        email: "user3@example.com",
        name: "Chinmaya",
        passion: "Python Development",
    },
];

const skills = [
    {
        id: 1,
        skill: "HTML",
    },
    {
        id: 2,
        skill: "CSS",
    },
    {
        id: 3,
        skill: "JS",
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
        // Find skills data based on id
        const userSkills = skills.find((skill) => skill.id === user.id);

        // Prepare response with both profile and content data
        return res.json({
            message: "Login successful",
            profile: userProfile,
            skills: userSkills,
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

            const userSkills = skills.find((skill) => skill.id === user.id);
            console.log(userSkills);
            if (userProfile && userSkills) {
                res.json({ profile: userProfile, skills: userSkills }); // Send profile data
                // res.sendFile(path.join(__dirname, "./view.html"));
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

app.listen(3000, () => {
    console.log("Server running on port http://localhost:3000");
});
