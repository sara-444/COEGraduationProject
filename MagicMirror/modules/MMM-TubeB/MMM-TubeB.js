Module.register("MMM-TubeB",{

 start() {
 Log.info("starting " + this.name);
 },

  getStyles: function () {
    return ["MMM-TubeB.css"];
  },


  createContainerDiv: function () {
    const containerDiv = document.createElement("div");
    containerDiv.className = "container1";

    return containerDiv;
  },

createYoutubeDiv: function () {
    const YoutubeDiv = document.createElement("div");
    YoutubeDiv.className = "butttun";

    YoutubeDiv.innerHTML="YouTube";
    YoutubeDiv.addEventListener("click", () => 
	this.sendNotification("YOUTUBE_LOAD",{
	type: "playlist",
	listType: "playlist",
	id: "PLhOJYyO7mlMEMcSBosR3SlGFmtth1WhAX",
	loop: true,
	autoplay: false
	}
	)    );

    return YoutubeDiv;
  },

  createStartDiv: function () {
    const startDiv = document.createElement("div");
    startDiv.className = "butttun";

    startDiv.innerHTML="▶️";
    startDiv.addEventListener("click", () => 
	this.sendNotification("YOUTUBE_CONTROL",{
	command: "playVideo"
	})    );

    return startDiv;
  },


  createpauseDiv: function () {
    const pauseDiv = document.createElement("div");
    pauseDiv.className = "butttun";

    pauseDiv.innerHTML="◼";
    pauseDiv.addEventListener("click", () => 
	this.sendNotification("YOUTUBE_CONTROL",{
	command: "pauseVideo"
	})    );

    return pauseDiv;
  },


  createnextDiv: function () {
    const nextDiv = document.createElement("div");
    nextDiv.className = "butttun";

    nextDiv.innerHTML="⏭️";
    nextDiv.addEventListener("click", () => 
	this.sendNotification("YOUTUBE_CONTROL",{
	command: "nextVideo"
	})    );

    return nextDiv;
  },


  createprevDiv: function () {
    const prevDiv = document.createElement("div");
    prevDiv.className = "butttun";

    prevDiv.innerHTML="⏮";
    prevDiv.addEventListener("click", () => 
	this.sendNotification("YOUTUBE_CONTROL",{
	command: "previousVideo"
	})    );

    return prevDiv;
  },


   notificationReceived: function (notification, payload, sender) {
		if(notification === "START_YOUTUBE"){
			this.sendNotification("YOUTUBE_LOAD",{
			type: "playlist",
			listType: "playlist",
			id: "PLhOJYyO7mlMEMcSBosR3SlGFmtth1WhAX",
			loop: true,
			autoplay: false
			})
		}else if ( notification === "PLAY_VIDEO"){
			this.sendNotification("YOUTUBE_CONTROL",{
			command: "playVideo"
			})
		}else if ( notification === "PAUSE_VIDEO"){
			this.sendNotification("YOUTUBE_CONTROL",{
			command: "pauseVideo"
			})
		}
		else if ( notification === "NEXT_VIDEO"){
			this.sendNotification("YOUTUBE_CONTROL",{
			command: "nextVideo"
			})
		}
		else if ( notification === "PREVIOUS_VIDEO"){
			this.sendNotification("YOUTUBE_CONTROL",{
			command: "previousVideo"
			})
		}
  },

  getDom: function () {
   

    const container = this.createContainerDiv();

    const startButton = this.createStartDiv();
    container.appendChild(startButton);

    const pauseButton = this.createpauseDiv();
    container.appendChild(pauseButton);

    const nextButton = this.createnextDiv();
    container.appendChild(nextButton);

    const prevButton = this.createprevDiv();
    container.appendChild(prevButton);

    const youtubeButton = this.createYoutubeDiv();
    container.appendChild(youtubeButton);

    return container;
  },


});