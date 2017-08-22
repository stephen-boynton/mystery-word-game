const fs = require("fs");
const words = fs
	.readFileSync("/usr/share/dict/words", "utf-8")
	.toLowerCase()
	.split("\n");

function randomNumber() {
	return Math.floor(Math.random() * words.length);
}

function splitWord(word) {
	return word.split("");
}

function guessArr(wordArr) {
	const guessArr = [];
	wordArr.forEach((elm, ind, arr) => {
		guessArr[ind] = "_ ";
	});
	console.log(guessArr);
	return guessArr;
}

function getWord() {
	const index = randomNumber();
	const word = words[index];
	const wordArr = splitWord(word);
	const guessArray = guessArr(wordArr);
	return { word: word, wordArr: wordArr, guessArr: guessArray };
}

module.exports = {
	getWord: getWord
};
