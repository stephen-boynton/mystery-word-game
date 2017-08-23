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
	word.message = "";
	word.end = false;
	if (check > -1) {
		word.message = "You already guessed that letter!"
		res.redirect("/game");
	} else {
		next();
	}
}

function lengthCheck(req, res, next) {
	const word = req.session.word;
	if (req.body.guess.length > 1) {
		word.message = "You may only enter one letter at a time!";
		res.redirect("/game");
	} else if (req.body.guess.length === 0) {
		word.message = "You're submission was blank...";
		res.redirect("/game")
	} else {
		next();
	}
}

function containsAlpha (req, res, next) {
	const word = req.session.word;
	const alpha = dal.containAlpha(req.body.guess)
	if (alpha === false) {
		word.message = "Invalid character.";
		res.redirect("/game");
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
		next();
	} else {
		word.guesses -= 1;
		req.success = false;
		next();
	}
}

function winCheck(req, res, next) {
	const word = req.session.word;
	const win = dal.haveWon(word.guessArr);
	console.log("hello!");
	console.log(win);
	if (word.guesses === 0 && req.success === false) {
		req.session.word.missing = dal.missingLetters(word.wordArr, word.guessArr);
		word.guessArr = word.wordArr;
		word.end = true;
		next();
	} else if (win === -1) {
		word.message = "YOU HAVE WON!"
		word.end = true;
		res.redirect("/game")
	} else {
		next();
	}
}

app.get("/", (req, res) => {
	if(req.session.word) {
		res.redirect("/game")
	} else {
	res.render("new");
}
})

app.get("/game", (req, res) => {
	if(req.session.word) {
		res.render("game", { word: req.session.word });
	} else {
		res.redirect('/')
	}
});

app.post(
	"/guess",
	repeatCheck,
	lengthCheck,
	containsAlpha,
	successCheck,
	winCheck,
	(req, res) => {
		res.redirect("/game");
	}
);

app.get("/restart", (req, res) => {
	req.session.destroy();
	res.redirect("/")
})

app.post("/easy", (req, res) => {
		const word = dal.getWord(1);
		console.log(word);
		req.session.word = word;
		res.redirect("/game");
})

app.post("/medium", (req, res) => {
		const word = dal.getWord(2);
		console.log(word);
		req.session.word = word;
		res.redirect("/game");
})

app.post("/hard", (req, res) => {
		const word = dal.getWord(3);
		console.log(word);
		req.session.word = word;
		res.redirect("/game");
})

//your routes

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
