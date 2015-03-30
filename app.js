$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});

	$('.inspiration-getter').submit( function(event) {
		$('.results').html('');
		console.log($(this).find("input[name='answers']").val());
		var tag = $(this).find("input[name='answers']").val();
		getInspiration(tag);
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

var showAnswerers = function(answers) {
	// clone the result template
	var result = $('.templates .answer').clone();

	//set answerer properties in result
	var answersElem = result.find('.answer-text');
	answersElem.text(answers.post_count);

	var userElem = result.find('.userName');
	userElem.text(answers.user.display_name);

	var userTypeElem = result.find('.userType');
	userTypeElem.text(answers.user.user_type);

	var userRepElem = result.find('.userRep');
	userRepElem.text(answers.user.reputation)


	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {

	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};

var getInspiration = function(tag) {
	//http://api.stackexchange.com/docs/top-answerers-on-tags#tag=jquery&period=all_time&filter=default&site=stackoverflow
	console.log('Tag: ' + tag);
	// parameters needed to pass our request to stackOverflow API
	var request = {tag: tag,
						site: 'stackoverflow',
						period: 'all_time',
						filter: 'default'};

	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + tag + "/top-answerers/all_time?",
		//url: "http://api.stackexchange.com/2.2/tags/%7Btag%7D/top-answerers",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result) {
		var searchResults = showSearchResults(request.tag, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			//console.log(item);
			//console.log('Post Count: ' + item.post_count)
			//console.log('Post Count: ' + item.post_count + ' Rep: ' + item.user.reputation + ' User Type: ' + item.user.user_type + ' User: ' + item.user.display_name);
			var answers = showAnswerers(item);
			$('.results').append(answers);

		});
	})
	.fail(function(jqXHR, error, errorThrown) {
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};



