const form = document.querySelector("form");
const h2s = document.querySelectorAll("h2");
const hidden = document.getElementById("hidden");
const hiddenClass = hidden.className;
console.log(hiddenClass);

if (hiddenClass.length > 0) {
	let count = 0;
	let hiddenArr = hiddenClass.split("");
	h2s.forEach((elm, ind, arr) => {
		console.log(elm);
		if (elm.innerHTML === hiddenArr[count]) {
			elm.className = "red";
			count++;
		}
	});
}
