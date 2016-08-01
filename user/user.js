$(function(){

// calls to api to return user info on reload
var getUsername = $.ajax({
	type: "GET",
	url: WorkoutLog.API_BASE + "user",
	headers: {
	"Authorization": window.localStorage.getItem("sessionToken")
	}
}).done(function(data){
	userInfo = data;
	username = userInfo[0].username;
	// inputs username to dom
	$("#welcome").text("Welcome, " + username);
	});

});