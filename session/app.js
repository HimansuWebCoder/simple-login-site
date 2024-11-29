const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;

app.use(session({
	secret: "hhh",
	resave: false,
	saveUninitialized: false,
	cookie: {secure: false}
}))

app.use(express.json());

const user = {
	email: 'test'
}

function authenticate(req, res, next) {
	console.log("authenticate session email", req.session.email);
	if (req.session.email) {
		next();
	} else {
		res.json({Status: "Unauthorized user login"})
	}
}

app.post('/login', (req, res) => {
     const { email } = req.body;
     req.session.email = email
     console.log("session email", req.session.email);
     if (req.session.email === user.email) {
     	res.json("login successfully")
     }
})

app.get('/posts', authenticate, (req, res) => {
	res.json({message: "I am post"});
})

app.listen(port, () => {
	console.log(port);
})