const dal = require("./dal");

describe("Words data access layer", function() {
	// getWord
	test("getWord should return a single word", function() {
		expect(typeof dal.getWord).toBe("function");
		expect(typeof dal.getWord()).toBe(typeof "string");
	});
});
