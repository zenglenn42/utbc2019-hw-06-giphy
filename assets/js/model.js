function Model() {}
Model.prototype.apiBaseUrl = "https://api.giphy.com/v1/gifs/search";
// See: https://github.com/Giphy/GiphyAPI#search-endpoint
//      Using public beta key for now since this is a student app
//      per their API usage guidelines.
Model.prototype.apiKey = "dc6zaTOxFJmzC";
Model.prototype.apiSearchLimit = 10;
Model.prototype.apiMethod = "GET";
Model.prototype.appTitle = "GIPHY App";
Model.prototype.searchList = [
	"clouds",
	"cities",
	"earth",
	"flowers",
	"nature",
	"space",
	"sunflowers",
	"sunrise",
	"sunset",
	"waterfalls",
	"yosemite"
];
Model.prototype.addSearch = function(searchStr) {
	if (typeof searchStr === "string") {
		var nSearchStr = searchStr.toLowerCase();
		this.searchList.push(nSearchStr);
		return nSearchStr;
	} else {
		console.log("Model.addSearch: non-string parameter passed in.  Ignoring");
	}
};
Model.prototype.hasThatAlready = function(searchStr) {
	return  (this.searchList.indexOf(searchStr.toLowerCase()) !== -1);
}
Model.prototype.getQueryUrl = function(giphyTag) {
	var queryUrl = encodeURI(
		`${this.apiBaseUrl}?q=${giphyTag}&api_key=${this.apiKey}&limit=${this.apiSearchLimit}`
	);
	return queryUrl;
}
Model.prototype.getSearchList = function() {
	return this.searchList;
}
Model.prototype.runUnitTests = function() {
	console.log("Running model unit tests.")

	var searchArray = this.getSearchList();
	var length = searchArray.length;
	console.log(searchArray);

	this.addSearch("bugs bunny")
	console.log(searchArray);

	return (searchArray.length === ++length);
}