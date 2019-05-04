function Controller() {
	this.model = new Model();
	this.populateButtons(".btn-group", this.model.getSearchList());

	// Register callback for adding a new giphy button.
	$("#addButton").on("click", this.addGiphyButtonCB.bind(this));

	// Register callback for clicking on a (possibly dynamically
	// generated) giphy search button.

	$("div .btn-group").on("click", ".btn", this.getClickGiphyButtonCB());

	// Register callback for handling clicks to a giphy image itself.
	// Depending upon the state of the giphy element, this will
	// start or stop the gif animation.

	$("#giphyImages").on("click", ".giphy", this.clickGiphyImgCB);
}
Controller.prototype.addGiphyButtonCB = function() {
	var userButtonText = $("#searchText").val();
	this.addNewButton(".btn-group", userButtonText);
	return false;
}
Controller.prototype.addNewButton = function(groupClass, btnText) {

	if (!this.model.hasThatAlready(btnText)) {
		// Add this to the model, and return the normalized text.
		var nButtonText = this.model.addSearch(btnText);
		var newButton = this.makeButton(nButtonText);

		// Append new button to existing button group.
		$(groupClass).append(newButton);
	}
}
Controller.prototype.getClickGiphyButtonCB = function() {
	var that = this;
	function innerCallback() {
		var giphyTag = $(this).data("giphytag");
		var queryUrl = that.model.getQueryUrl(giphyTag);
	
		$.ajax({
			url: queryUrl,
			method: that.model.apiMethod,
			headers: {
				// Necessary with CORS-anywhere fix.
				"x-requested-with": "xhr"
			}
		}).done(function(response) {

			// Verify we're getting data back from the endpoint.
			$("#giphyImages").empty();
			var nLength = Math.min(response.data.length, that.model.apiSearchLimit);
			console.log("nLength", nLength);
			for (var i = 0; i < nLength; i++) {
				var stillUrl = response.data[i].images.fixed_height_still.url;
				console.log("clickGiphyButtonCB: stillUrl", stillUrl);
				var dynUrl = response.data[i].images.fixed_height.url;
				console.log("clickGiphyButtonCB: dynUrl", dynUrl);
				var rating = response.data[i].rating;
				console.log("clickGiphyButtonCB: rating", rating);
				var img = that.makeImage(stillUrl, dynUrl, rating, giphyTag);
				$("#giphyImages").append(img);
			}
		}).fail(function(err) {
			throw err;
		});
		return false;
	}
	return innerCallback;
}
Controller.prototype.clickGiphyImgCB = function() {
	console.log("clickGiphyImgCB");
	var giphyState = $(this).data("state"); // still | stop

	// toggle the next giphy state
	switch(giphyState) {
		case "start":
			$(this).data("state", "stop");
			var src = $(this).data("dynurl");
			break;

		case "stop":
			$(this).data("state", "start");
			var src = $(this).data("stillurl");
			break;
	}
	$(this).attr("src", src);
}	
Controller.prototype.populateButtons = function(groupClass, strArray) {
	console.log("populateButtons", groupClass, strArray);
	for (var i = 0; i < strArray.length; i++) {
		var btn = this.makeButton(strArray[i]);
		console.log("populateButtons", btn);
		$(groupClass).append(btn);
	}
}
Controller.prototype.makeButton = function(btnText) {
	console.log("makeButton", btnText);
	var btn = `<button class="btn btn-primary" data-giphytag="${btnText}">${btnText}</button>`;
	console.log("makeButton: data-giphytag:", $(btn).data("giphytag"));
	return btn;
}
Controller.prototype.makeImage = function(stillUrl, dynUrl, rating, imgText) {
	var fig = $("<figure>");

	var figcaption = $("<figcaption class='figure-caption text-sm-left'>");
	$(figcaption).html("Rating: " + rating);

	var img = $("<img>").attr("src", stillUrl);
	$(img).attr("alt", imgText);
	$(img).attr("class", "figure-img img-fluid rounded giphy");
	$(img).attr("data-stillurl", stillUrl);
	$(img).attr("data-dynurl", dynUrl);
	$(img).attr("data-state", "start");
	$(img).attr("data-rating", rating);

	$(fig).append(img);
	$(fig).append(figcaption);

	return fig;
}