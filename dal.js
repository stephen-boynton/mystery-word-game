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
	return guessArr;
}

function getWordObject() {
	const index = randomNumber();
	const word = words[index];
	const wordArr = splitWord(word);
	const guessArray = guessArr(wordArr);
	return {
		word: word,
		wordArr: wordArr,
		guessArr: guessArray,
		letters: [],
		guesses: 8
	};
}

function guessCheck(wordArr, guess) {
	return wordArr.findIndex(elm => {
		return elm === guess;
	});
}

function updateGuessArr(wordArr, guessArr, guess) {
	wordArr.forEach((elm, ind, arr) => {
		if (elm === guess) guessArr[ind] = guess;
	});
	return guessArr;
}

function alreadyHave(letters, guess) {
	return letters.findIndex(elm => {
		return elm === guess;
	});
}

function missingLetters(wordArr, guessArr) {
	const missingLettersArr = [];
	guessArr.forEach((elm, ind, arr) => {
		if (elm === "_ ") missingLettersArr.push(wordArr[ind]);
	});
	return missingLettersArr;
}

module.exports = {
	getWord: getWordObject,
	guessCheck: guessCheck,
	update: updateGuessArr,
	alreadyHave: alreadyHave,
	missingLetters: missingLetters
};
