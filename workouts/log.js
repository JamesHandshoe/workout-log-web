var index;
$(function(){
	$('#log-success').hide();
	$('#log-fail').hide();

	$.extend(WorkoutLog,{
		log: {
			workouts: [],
			setDefinitions: function(){
				var defs = WorkoutLog.definition.userDefinitions;
				var len = defs.length;
				var opts = "";
				for (var i = 0; i < len; i++){
					opts += "<option value='" + defs[i].id + "'>" + defs[i].description + "</option>";
				}
				$("#log-definition").children().remove();
				$("#log-definition").append(opts);
			},

			setHistory: function() {
				var history = WorkoutLog.log.workouts;
				var len = history.length;
				var lis = "";
				for (var i = 0; i < len; i++) {
					lis += "<li class='list-group-item'>" + 
					// history[i].id + " - " + 
					history[i].def + " - " + 
					history[i].result + " " +
					// pass the log.id into the button's id attribute // watch your quotes!
					"<button id='" + history[i].id + "' class='remove'><strong>X</strong></button></li>";
				}
				$('#history-list').children().remove();
				$('#history-list').append(lis);
			},

			create: function() {
				var itsLog = {
					desc: $("#log-description").val(),
					result: $("#log-result").val(),
					def: $("#log-definition option:selected").text()
				};

				var postData = { log: itsLog };
				var logger = $.ajax({
					type: "POST",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(postData),
					contentType: "application/json"
				});

				logger.done(function(data) {
					WorkoutLog.log.workouts.push(data);
					$('#log-success').fadeIn();
					$('#log-result').val("");
					$('#log-description').val("");
				});

				logger.fail(function() {
					console.log("something broke");
					$('#log-fail').fadeIn();
				});

			},

			delete: function(){
				var thisLog = {
						// "this" is the button on the li
						// .attr("id") targets the value of the id attribute of button
					id: $(this).attr("id")
				};
				var deleteData = { log: thisLog };
				var deleteLog = $.ajax({
					type: "DELETE",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(deleteData),
					contentType: "application/json"
				});

				// removes list item
				// references button then grabs closest li
				$(this).closest("li").remove();

				// deletes item out of workouts array
				for(var i = 0; i < WorkoutLog.log.workouts.length; i++){
					if(WorkoutLog.log.workouts[i].id == thisLog.id){
						WorkoutLog.log.workouts.splice(i, 1);
					}
				}
				deleteLog.fail(function(){
					console.log("nope. you didn't delete it.");
				});
			},

			fetchAll: function(){
				var fetchDefs = $.ajax({
					type: "GET",
					url: WorkoutLog.API_BASE + "log",
					header: {
						"Authorization": window.localStorage.getItem("sessionToken")
					}
				});

				fetchDefs.done(function(data){
					WorkoutLog.log.workouts = data;
				});

				fetchDefs.fail(function(err){
					console.log("an error occured" + err.message);
				});
			}
		}
	});

	$('#log-save').on('click', WorkoutLog.log.create);

	$("#history-list").delegate('.remove', 'click', WorkoutLog.log.delete);
	if (window.localStorage.getItem("sessionToken")) {
		WorkoutLog.log.fetchAll();
	}


});