$(function(){
	$.extend(WorkoutLog, {
		feed: [],
		addFeedItem: function(feedData){
			var li = $('<li>').append(feedData.username + feedData.message);
			li.addClass('list-group-item');
			$('#feed-list').append(li);
			WorkoutLog.feed.push(feedData);
		},

		sendChat: function(){
			WorkoutLog.socket.emit("chat-message", {
				username: WorkoutLog.username,
				message: " says " + $('#msg').val()
			});

			$('#msg').val("");
		},

		setFeed: function() {
			var feed = WorkoutLog.feed;
			var len = feed.length;
			var feedLis = "";
			for(var i = 0; i < len; i++){
				feedLis += "<li class='list-group-item'>" +
				feed[i].username + feed[i].message +
				"</li>";
			}
			$('#feed-list').children().remove();
			$("#feed-list").append(feedLis);
		},

		fetchAllFeeds: function(){
			var fetchFeeds = $.ajax({
				type: "GET",
				url: WorkoutLog.API_BASE + "feed",
				header: {
					"Authorization": window.localStorage.getItem("sessionToken")
				}
			});

			fetchFeeds.done(function(data){
				WorkoutLog.feed = data;
			});

			fetchFeeds.fail(function(err){

			});
		}
	});

	$("#msg-send").on("click", WorkoutLog.sendChat);

	if (window.localStorage.getItem("sessionToken")){
		WorkoutLog.fetchAllFeeds();
	}
});