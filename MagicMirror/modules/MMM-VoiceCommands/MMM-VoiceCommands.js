Module.register("MMM-VoiceCommands" , {
 start() {
 Log.info("starting " + this.name);
 },
 
 	notificationReceived: function (notification,payload,sender) {
  		if (notification === "ALL_MODULES_STARTED") {

   		this.sendNotification("REGISTER_VOICE_MODULE", {
    			mode: "MODULES",
    			sentences: [
     				"SHOW",
     				"HIDE",
				"START YOUTUBE",
				"PLAY",
				"PAUSE",
				"NEXT",
				"PREVIOUS",
				"ZERO",
     				"ONE",
     				"SHOW EVENTS",
     				"HIDE EVENTS",
     				"SHOW CANVAS",
     				"HIDE CANVAS",
     				"SHOW WEATHER",
     				"HIDE WEATHER"
   				 ]
  			 });



		}else  if (sender && sender.name === "MMM-voice" && notification ==="VOICE_MODULES" ){
		Log.info("notifications:  " + notification);
		Log.info(payload);




			if (payload.includes("START")){
				this.sendNotification("START_YOUTUBE");
			}else if (payload.includes("PLAY")){
				this.sendNotification("PLAY_VIDEO");
			}else if (payload.includes("PAUSE")){
				this.sendNotification("PAUSE_VIDEO");
			}else if (payload.includes("NEXT")){
				this.sendNotification("NEXT_VIDEO");
			}else if (payload.includes("PREVIOUS")){
				this.sendNotification("PREVIOUS_VIDEO");
			}



			else if (payload.includes("ZERO")){
				this.sendNotification("PAGE_CHANGED",0);
			}else if (payload.includes("ONE")){
				this.sendNotification("PAGE_CHANGED",1);
			}



			else if (payload.includes("HIDE EVENTS")){
				MM.getModules().withClass('calendar').enumerate(function(module) {
				module.hide(1000);
				});
			}else if (payload.includes("SHOW EVENTS")){
				MM.getModules().withClass('calendar').enumerate(function(module) {
				module.show(1000);
				});
			}



			else if (payload.includes("HIDE CANVAS")){
				MM.getModules().withClass('MMM-canvas').enumerate(function(module) {
				module.hide(1000);
				});
			}else if (payload.includes("SHOW CANVAS")){
				MM.getModules().withClass('MMM-canvas').enumerate(function(module) {
				module.show(1000);
				});
			}


			else if (payload.includes("SHOW WEATHER")){
				this.sendNotification("SHOW");
			}else if (payload.includes("HIDE WEATHER")){
				this.sendNotification("HIDE");
			}

			else if(payload.includes("HIDE")){
				this.sendNotification("HIDE_ALL");
			} else if (payload.includes("SHOW")){
				this.sendNotification("SHOW_ALL");
			}
  	} 
 	},




});