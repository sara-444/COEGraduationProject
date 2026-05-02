/* Magic Mirror Module: MMM-PrayerTimes
 * Node Helper
 * 
 * This file runs on the Node.js backend and handles API calls
 */

const NodeHelper = require("node_helper");
const https = require("https");

module.exports = NodeHelper.create({
    
    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_PRAYER_TIMES") {
            this.getPrayerTimes(payload);
        }
    },

    getPrayerTimes: function(config) {
        const self = this;
        
        let url;
        if (config.location === "auto") {
            url = `https://muslimsalat.com/daily.json?key=${config.apiKey}`;
        } else {
            
	    const method = config.method || 3;
            url = `https://muslimsalat.com/${config.location}/${method}.json?key=${config.apiKey}`;
        }

        console.log("Fetching prayer times from:", url.replace(config.apiKey, "***"));

        https.get(url, (res) => {
            let data = '';

            
            res.on('data', (chunk) => {
                data += chunk;
            });

            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    
                   
                    if (jsonData.items && jsonData.items.length > 0) {
                        console.log("Prayer times fetched successfully for:", jsonData.title);
                        self.sendSocketNotification("PRAYER_TIMES_RESULT", {
                            success: true,
                            data: jsonData
                        });
                    } else if (jsonData.status_code && jsonData.status_code !== 200) {
                        console.error("API returned error status:", jsonData.status_code);
                        self.sendSocketNotification("PRAYER_TIMES_RESULT", {
                            success: false,
                            error: "API returned error status: " + jsonData.status_code
                        });
                    } else {
                        console.error("Invalid API response:", jsonData);
                        self.sendSocketNotification("PRAYER_TIMES_RESULT", {
                            success: false,
                            error: "Invalid API response format"
                        });
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    self.sendSocketNotification("PRAYER_TIMES_RESULT", {
                        success: false,
                        error: "Error parsing response"
                    });
                }
            });

        }).on('error', (error) => {
            console.error("Error fetching prayer times:", error);
            self.sendSocketNotification("PRAYER_TIMES_RESULT", {
                success: false,
                error: error.message
            });
        });
    }
});