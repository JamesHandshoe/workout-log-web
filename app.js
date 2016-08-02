$(document).ready(function(){
	var WorkoutLog = (function($, undefined){
		var API_BASE = location.hostname === "localhost" ?
			"//localhost:3000/api/" :
			"//workoutapi-1150-jhandshoe.herokuapp.com/";

		var setAuthHeader = function(sessionToken){

			window.localStorage.setItem("sessionToken", sessionToken);

			$.ajaxSetup({
				"headers": {
					"Authorization": sessionToken
				}
			});

			$.ajax({
				type: "GET",
				url: API_BASE + "login"
			}).then(function(data){
				WorkoutLog.username = data;
			});
		};

		return {
			API_BASE: API_BASE,
			setAuthHeader: setAuthHeader
		};
	})(jQuery);

	// ensure .disabled aren't clickable

	$('.nav-tabs a[data-toggle=tab]').on('click', function(e){
		var token = window.localStorage.getItem('sessionToken');
		if ($(this).hasClass('disabled') && !token) {
			e.preventDefault();
			return false;
		}
	});

	//bind tab change events
	$('a[data-toggle=tab]').on('shown.bs.tab', function(e) {
		var target = $(e.target).attr("href");
		if (target === "#log") {
			WorkoutLog.log.setDefinitions();
		}

		if (target === '#history') {
			WorkoutLog.log.setHistory();
		}

		if (target === "#feed") {
			WorkoutLog.setFeed();
		}
	});



	var token = window.localStorage.getItem('sessionToken');
	if (token){
		WorkoutLog.setAuthHeader(token);
	}

	window.WorkoutLog = WorkoutLog;

	WorkoutLog.socket = io.connect("http://localhost:3000");

	WorkoutLog.socket.on("new log", function(data){
		WorkoutLog.addFeedItem(data);
	});

	WorkoutLog.socket.on("chat-message", function(data){
		WorkoutLog.addFeedItem(data);
	});
});
/*test api - put this back in to check if apis are working
	$('#testAPI').on('click', function(){
		console.log("its working");
		var test = $.ajax({
			type: "GET",
			url: "http://localhost:3000/api/test"
		});
		test.done(function(data){
			console.log(data);
		});
		test.fail(function(){
			console.log("oh noes!!!");
		});
	});
*/
