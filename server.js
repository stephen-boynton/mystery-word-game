const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const mustacheExpress = require("mustache-express");
const dal = require("./dal");
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: "hamsandwich",
		saveUninitialized: false,
		resave: false
	})
);

function repeatCheck(req, res, next) {
	const guess = req.body.guess;
	const word = req.session.word;
	const check = dal.alreadyHave(word.letters, guess);
	if (check > -1) {
		res.send("You already guessed that letter.");
	} else {
		next();
	}
}

function lengthCheck(req, res, next) {
	if (req.body.guess.length > 1) {
		res.send("You may only enter one letter at a time.");
	} else {
		next();
	}
}

function successCheck(req, res, next) {
	const guess = req.body.guess.toLowerCase();
	const word = req.session.word;
	const isGuess = dal.guessCheck(word.wordArr, guess);
	word.letters.push(guess);
	if (isGuess > -1) {
		word.guessArr = dal.update(word.wordArr, word.guessArr, guess);
		req.success = true;
		res.redirect("/");
	} else {
		word.guesses -= 1;
		req.success = false;
		next();
	}
}

function winCheck(req, res, next) {
	const word = req.session.word;
	if (word.guesses === 0 && req.success === false) {
		req.session.word.missing = dal.missingLetters(word.wordArr, word.guessArr);
		word.guessArr = word.wordArr;
		next();
	} else {
		next();
	}
}

app.get("/", (req, res) => {
	if (!req.session.word) {
		const word = dal.getWord();
		console.log(word);
		req.session.word = word;
		res.render("game", { word: req.session.word });
	} else {
		res.render("game", { word: req.session.word });
	}
});

app.post(
	"/guess",
	repeatCheck,
	lengthCheck,
	successCheck,
	winCheck,
	(req, res) => {
		res.redirect("/");
	}
);

//your routes

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
