const fs = require("fs");
const words = fs
	.readFileSync("/usr/share/dict/words", "utf-8")
	.toLowerCase()
	.split("\n");

function randomNumber() {
	return Math.floor(Math.random() * words.length);
}

function getWord() {
	const word = randomNumber();
	console.log(words[word]);
	return words[word];
}

module.exports = {
	getWord: getWord
};
