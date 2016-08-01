$(function(){
	$('#define-success').hide();
	$('#define-fail').hide();
	$.extend(WorkoutLog,{
		definition: {
			userDefinitions: [],
			create: function() {
				var def = {
					desc: $('#def-description').val(),
					type: $('#def-logtype').val()
				};
				var postData = { definition: def };
				var define = $.ajax({
					type: "POST",
					url: WorkoutLog.API_BASE + "definition",
					data: JSON.stringify( postData ),
					contentType: "application/json"
				});

				define.done(function(data){
					WorkoutLog.definition.userDefinitions.push(data.definition);
					$("#define-success").fadeIn();
					$('#def-description').val();
				});

				define.fail(function(err){
					console.log('oh no' + JSON.stringify(err));
					$("#define-fail").fadeIn();
				});
			},

			delete: function(){
				var thisDefId = {
					id: $('#log-definition').find('option:selected').val()
				};
				var deleteData = { definition: thisDefId };
				var deleteDefinition = $.ajax({
					type: "DELETE",
					url: WorkoutLog.API_BASE + "definition",
					data: JSON.stringify(deleteData),
					contentType: "application/json"
				});
				$('select option:selected').text("");
				$('select option:selected').hide();

				for (var i = 0; i < WorkoutLog.definition.userDefinitions.length; i++){
						if(WorkoutLog.definition.userDefinitions[i].id == thisDefId.id){
						WorkoutLog.definition.userDefinitions.splice(i, 1);
					}
				}

				deleteDefinition.fail(function(){
					console.log("nope. you didn't delete category.");
				});
			},

			fetchAll: function(){
				var getDefs = $.ajax({
					type: 'GET',
					url: WorkoutLog.API_BASE + "definition",
					headers: {
						"Authorization": window.localStorage.getItem("sessionToken")
					}
				})
				.done(function(data) {
					WorkoutLog.definition.userDefinitions = data;
				})
				.fail(function(err){
					console.log(err);
				});
			}
		}
	});

	$('#def-save').on('click', WorkoutLog.definition.create);
	$("#delete-category").on("click", WorkoutLog.definition.delete);
	
	if (window.localStorage.getItem("sessionToken")){
		WorkoutLog.definition.fetchAll();
	}
});