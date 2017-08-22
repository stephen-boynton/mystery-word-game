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

//your routes

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
