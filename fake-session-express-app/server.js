// // Example of Session-Based Authentication:

// const express = require("express");
// const bcrypt = require("bcrypt");
// const session = require("express-session");
// const cors = require("cors");
// const path = require("path");

// const app = express();

// app.use(express.json());
// app.use(cors());

// // Setting up session middleware
// app.use(
//     session({
//         secret: "your_secret_key", // Make sure this is a secure key
//         resave: false,
//         saveUninitialized: true,
//         cookie: { secure: false }, // Set to true if using HTTPS
//     }),
// );

// app.get("/login", (req, res) => {
//     res.sendFile(path.join(__dirname, "./login.html"));
// });

// app.get("/view", (req, res) => {
//     res.sendFile(path.join(__dirname, "./view.html"));
// });

// // Fake database
// const users = [
//     {
//         id: 1,
//         email: "user1@example.com",
//         passwordHash: bcrypt.hashSync("password1", 10),
//         content: "User 1 content",
//     },
//     {
//         id: 2,
//         email: "user2@example.com",
//         passwordHash: bcrypt.hashSync("password2", 10),
//         content: "User 2 content",
//     },
//     {
//         id: 3,
//         email: "user3@example.com",
//         passwordHash: bcrypt.hashSync("password3", 10),
//         content: "User 2 content",
//     },
// ];

// const profile = [
//     {
//         id: 1,
//         email: "user1@example.com",
//         name: "Himansu",
//         passion: "Backend Development",
//     },
//     {
//         id: 2,
//         email: "user2@example.com",
//         name: "Prashant",
//         passion: "Frontend Development",
//     },
//     {
//         id: 3,
//         email: "user3@example.com",
//         name: "Chinmaya",
//         passion: "Python Development",
//     },
// ];

// const skills = [
//     {
//         id: 1,
//         skill: "HTML",
//     },
//     {
//         id: 2,
//         skill: "CSS",
//     },
//     {
//         id: 3,
//         skill: "JS",
//     },
// ];

// const fruits = [
//     {
//         id: 1,
//         fruit: "Mango",
//     },
//     {
//         id: 2,
//         fruit: "Orange",
//     },
//     {
//         id: 3,
//         fruit: "Lemon",
//     },
// ];

// // Login route
// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     const user = users.find((user) => user.email === email);
//     if (user && (await bcrypt.compare(password, user.passwordHash))) {
//         req.session.userId = user.id; // Create session

//         // Find profile data based on email
//         const userProfile = profile.find((profile) => profile.email === email);
//         // Find skills data based on id
//         const userSkills = skills.find((skill) => skill.id === user.id);
//         const userFruits = fruits.find((fruit) => fruit.id === user.id);

//         // Prepare response with both profile and content data
//         return res.json({
//             message: "Login successful",
//             profile: userProfile,
//             skills: userSkills,
//             content: user.content,
//         });
//     } else {
//         res.status(401).send("Invalid credentials");
//     }
// });

// app.get("/content", (req, res) => {
//     const userId = req.session.userId; // Get the userId from the session
//     if (userId) {
//         const user = users.find((user) => user.id === userId);
//         if (user) {
//             // Find profile data based on email
//             const userProfile = profile.find(
//                 (profile) => profile.email === user.email,
//             );

//             const userSkills = skills.find((skill) => skill.id === user.id);
//             console.log(userSkills);
//             if (userProfile && userSkills) {
//                 res.json({ profile: userProfile, skills: userSkills }); // Send profile data
//                 // res.sendFile(path.join(__dirname, "./view.html"));
//             } else {
//                 res.status(404).send("Profile not found");
//             }
//         } else {
//             res.status(404).send("User not found");
//         }
//     } else {
//         res.status(401).send("Please log in to view your content");
//     }
// });

// app.get("/skills", (req, res) => {
//     const mySkill = skills.find((skill) => skill.id === profile[2].id);
//     req.session.skillsId = mySkill.id; // Create session
//     console.log(mySkill);

//     console.log(req.session.skillsId);

//     const skill_Id = req.session.skillsId;

//     console.log(skill_Id);

//     if (skill_Id) {
//         const myAllSkills = skills.find((skill) => skill.id === skill_Id);
//         console.log(myAllSkills);
//         res.json({ skills });
//     } else {
//         res.status(404).send("skills not found");
//     }
// });

// app.listen(3000, () => {
//     console.log("Server running on port http://localhost:3000");
// });

// using database
const express = require("express");
const session = require("express-session");
const knex = require("knex");
const cors = require("cors");
const path = require("path");

const app = express();

const db = knex({
    client: "pg",
    connection: {
        host: "localhost",
        port: 5432,
        user: "user_login",
        password: "login",
        database: "auth_user",
    },
});

app.use(express.json());
app.use(cors());

app.use(
    session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    }),
);

// app.use(express.static(path.join(__dirname, "view.html")));

app.get("/view", (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.get("/redirect", (req, res) => {
    res.sendFile(path.join(__dirname, "redirect.html"));
});
// app.post("/login", (req, res) => {
//     const { name, email, password } = req.body;

//     db("users")
//         .insert({ name, email, password })
//         .returning("*")
//         .then((data) => {
//             // req.session.userId = data[0].id;
//             // res.json(req.session.userId);
//             if (!data || data.length === 0) {
//                 throw new Error("Insertion failed or returned no data.");
//             }
//             res.redirect("/content");
//             // console.log(data);
//         })
//         .catch((error) => {
//             console.error(error);
//             res.status(500).json({ error: "An error occurred" });
//         });
// });
// app.get("/get-session", (req, res) => {
//     res.json({ userId: req.session.userId });
//     console.log(req.session.userId);
// });

// app.get("/content", (req, res) => {
//     res.json({ userId: req.session.userId });
// });

// app.get("/content", (req, res) => {
//     console.log("Content route accessed.");
//     res.send("Welcome to the content page.");
// });

// app.post("/test-redirect", (req, res) => {
//     console.log("Test redirect route accessed.");
//     res.redirect("/get-session");
// });

// app.get;

// app.post("/post", (req, res) => {
//     const name = req.body;
//     res.redirect("/all-posts");
// });

// app.get("/all-posts", (req, res) => {
//     console.log("accessed");
//     res.json({ name: "name accessed", like: 23 });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port http://localhost:${PORT}`);
// });

// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const session = require("express-session");

// app.use(express.json());

// app.use(
//     session({
//         secret: "helo",
//         resave: false,
//         saveUninitialized: true,
//         cookie: { secure: false },
//     }),
// );

// const login = {
//     username: "himansu",
//     password: "123",
// };

// const userData = [
//     {
//         login: "himansu",
//         password: "123",
//     },
// ];

// // app.get("/login", (req, res) => {
// //  req.session.user = login;
// //  res.send("user login successfully");
// //  res.json("wrong username and password! please try again");
// // });

// app.post("/login", (req, res) => {
//     const { login, password } = req.body;

//     const userFind = userData.find(
//         (user) => user.login === login && user.password === password,
//     );

//     if (!userFind) {
//         return res.json("wrong username and password! please try again");
//     }
//     {
//         req.session.user = userData;
//         return res.send("user login successfully");
//     }
// });

// app.post("/signup", (req, res) => {
//     const { login, password } = req.body;
//     if (!login || !password) {
//         res.json("username and password must required!");
//     } else {
//         userData.push({ login, password });
//         req.session.user = userData;
//         res.json("user signup successfully");
//     }
// });

// app.get("/user", (req, res) => {
//     const user = req.session.user;

//     // res.json(user);
//     if (!req.session.user) {
//         res.json("you need to login to see the user");
//     } else {
//         res.json(userData);
//         console.log(userData);
//     }
// });

// app.get("/users", (req, res) => {
//     const users = req.session.user;
//     res.json(users);
//     console.log(users);
// });

// app.listen(3000, () => {
//     console.log(`server running at ${3000}`);
// });
