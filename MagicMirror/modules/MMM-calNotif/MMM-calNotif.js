Module.register("MMM-calNotif", {
  
	start: function () {
           setTimeout(() => {
           Log.info("has started" + this.name);
           this.remindedEvents = [];
       },1000);
  },

	defaults: {
		advancedMin: 30
	   },

	notificationReceived: function (notification,payload,sender) {
		if (notification === "CALENDAR_EVENTS" && payload.length > 0) {
			let now = new Date();

			for (let i = 0;i< payload.length ; i++){
			let nextEvent = payload[i];
			let start = nextEvent.startDate;
			
			let diff = (start - now.getTime()) / 1000 / 60 ;
			let eventID = nextEvent.title + start;
			
			
			
			if ( diff > 0 && diff <= this.config.advancedMin && !this.remindedEvents.includes(eventID)) {
				this.remindedEvents.push(eventID);
				this.sendNotification("SHOW_ALERT",{
				type: "notification",
				title: "Upcoming event",
				message: nextEvent.title + " in " + Math.round(diff) + " min" ,
				timer: 60000
				});
			     }
			   }
			
			}
		}
  

});