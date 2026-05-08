

Module.register("MMM-news", {
   
    defaults: {
         
        updateInterval: 300000, //  5 minutes 
        rotateInterval: 8000, //8 seconds
        maxHeadlines: 40, 
        animationSpeed: 1000
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.news = [];
        this.currentIndex = 0;
        this.loaded = false;
        this.getNews();
        this.scheduleUpdate();
    },



    getStyles: function() {
        return ["MMM-news.css"];
    },

 
    getNews: function() {
        this.sendSocketNotification("GET_NEWS", {
            apiKey: this.config.apiKey
        });
    },

    // next update
    scheduleUpdate: function() {
        var self = this;
        setInterval(function() {
            self.getNews();
        }, this.config.updateInterval);

        //  headline rotation
        setInterval(function() {
            if (self.news.length > 0) {
                self.currentIndex = (self.currentIndex + 1) % self.news.length;
                self.updateDom(self.config.animationSpeed);
            }
        }, this.config.rotateInterval);
    },

   
    socketNotificationReceived: function(notification, payload) {
        if (notification === "NEWS_RESULT") {
            this.news = payload.slice(0, this.config.maxHeadlines);
            this.loaded = true;
            this.currentIndex = 0;
            this.updateDom(this.config.animationSpeed);
        } else if (notification === "NEWS_ERROR") {
            Log.error("Error fetching news: " + payload);
            this.loaded = false;
            this.updateDom(this.config.animationSpeed);
        }
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "mmm-arabic-news";

        if (!this.loaded) {
            wrapper.innerHTML = "Loading news...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (this.news.length === 0) {
            wrapper.innerHTML = "No news available";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        var currentNews = this.news[this.currentIndex];


        var headlineContainer = document.createElement("div");
        headlineContainer.className = "headline-container";

       
        var title = document.createElement("div");
        title.className = "headline-title";
        title.innerHTML = currentNews.title;
        headlineContainer.appendChild(title);

        // Source and date
        var meta = document.createElement("div");
        meta.className = "headline-meta";
        meta.innerHTML = currentNews.source + " • " + this.formatDate(currentNews.date);
        headlineContainer.appendChild(meta);

        //  indicator
        var progress = document.createElement("div");
        progress.className = "progress-indicator";
        progress.innerHTML = (this.currentIndex + 1) + " / " + this.news.length;
        headlineContainer.appendChild(progress);

        wrapper.appendChild(headlineContainer);

        return wrapper;
    },

    formatDate: function(dateString) {
        if (!dateString) return "";
        
        var date = new Date(dateString);
        var now = new Date();
        var diff = now - date;
        var minutes = Math.floor(diff / 60000);
        var hours = Math.floor(diff / 3600000);
        var days = Math.floor(diff / 86400000);
if (minutes < 60) {
return minutes + " minutes ago";
        } else if (hours < 24) {
            return hours + " hours ago";
        } else if (days < 7) {
            return days + " days ago";
        } else {
            return date.toLocaleDateString();
        }
    }
});