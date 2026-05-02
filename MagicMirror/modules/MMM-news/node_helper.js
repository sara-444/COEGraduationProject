
var NodeHelper = require("node_helper");
var https = require("https");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_NEWS") {
            this.fetchNews(payload);
        }
    },

    fetchNews: function(config) {
        var self = this;
        
        if (!config.apiKey) {
            console.error("MMM-News: API key is required");
            self.sendSocketNotification("NEWS_ERROR", "API key is required");
            return;
        }

        console.log("MMM-News: Fetching news from API...");

        var options = {
            method: 'GET',
            hostname: 'arabic-news-api.p.rapidapi.com',
            port: null,
            path: '/aljazeera',
            headers: {
                'x-rapidapi-key': config.apiKey,
                'x-rapidapi-host': 'arabic-news-api.p.rapidapi.com'
            }
        };

        var req = https.request(options, function(res) {
            var chunks = [];

            console.log("MMM-News: Response status code:", res.statusCode);

            res.on("data", function(chunk) {
                chunks.push(chunk);
            });

            res.on("end", function() {
                var body = Buffer.concat(chunks);
                var bodyString = body.toString();
                
                console.log("MMM-News: Raw response:", bodyString.substring(0, 500));
                
                try {
                    var data = JSON.parse(bodyString);
                    console.log("MMM-News: Parsed data type:", typeof data);
                    console.log("MMM-News: Has results:", !!data.results);
                    
                    
                    var newsArray = [];
                    
                    //   data in results array
                    if (data.results && Array.isArray(data.results)) {
                        newsArray = data.results.map(function(item) {
                            return {
                                title: item.headline || "No title",
                                source: "Al Jazeera", 
                                date: item.date || new Date().toISOString(),
                                url: item.url || ""
                            };
                        });
                    }
                    
                    console.log("MMM-News: Processed", newsArray.length, "news items");
                    if (newsArray.length > 0) {
                        console.log("MMM-News: First item:", JSON.stringify(newsArray[0]));
                    }
                    
                    self.sendSocketNotification("NEWS_RESULT", newsArray);
                } catch (e) {
                    console.error("MMM-News: Error parsing response:", e);
                    console.error("MMM-News: Response body:", bodyString.substring(0, 500));
                    self.sendSocketNotification("NEWS_ERROR", "Error parsing response: " + e.message);
                }
            });
        });

        req.on("error", function(e) {
            console.error("MMM-News: Request error", e);
            self.sendSocketNotification("NEWS_ERROR", e.message);
        });

        req.end();
    }
});