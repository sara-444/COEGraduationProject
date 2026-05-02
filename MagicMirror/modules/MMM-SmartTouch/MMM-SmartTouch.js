
Module.register("MMM-SmartTouch", {
  defaults: {
  },

  start: function () {
    Log.info(this.name + " has started...");
  },

  getStyles: function () {
    return ["MMM-smarttouch.css"];
  },


  getTranslations: function () {
    return {
      en: "translations/en.json",
      nb: "translations/nb.json",
    };
  },

  createContainerDiv: function () {
    const containerDiv = document.createElement("div");
    containerDiv.className = "box";

    return containerDiv;
  },

  toggleStandby: function () {
    const existingBodyClass = document.body.className;
    if (existingBodyClass === "st-standby show") {
      document.body.className = "st-standby fade";
    } else {
      document.body.className = "st-standby show";
    }
  },

  createStandByButtonDiv: function () {
    const standByButtonDiv = document.createElement("div");
    standByButtonDiv.className = "st-container__standby-button";

    standByButtonDiv.addEventListener("click", () => this.toggleStandby());

    return standByButtonDiv;
  },

  getDom: function () {
    
    document.body.className = "st-standby show";

    const container = this.createContainerDiv();

    const standByButton = this.createStandByButtonDiv();
    container.appendChild(standByButton);

    return container;
  },

  notificationReceived: function (notification, payload, sender) {
		if(notification === "HIDE_ALL"){
			document.body.className = "st-standby fade";
		}else if ( notification === "SHOW_ALL"){
			document.body.className = "st-standby show";
		}
  }

});
 
