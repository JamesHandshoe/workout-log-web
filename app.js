$(document).ready(function(){
	var WorkoutLog = (function($, undefined){
		var API_BASE = "http://localhost:3000/api/";

		var setAuthHeader = function(sessionToken){

			window.localStorage.setItem("sessionToken", sessionToken);

			$.ajaxSetup({
				"headers": {
					"Authorization": sessionToken
				}
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
	});



	var token = window.localStorage.getItem('sessionToken');
	if (token){
		WorkoutLog.setAuthHeader(token);
	}

	window.WorkoutLog = WorkoutLog;
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
