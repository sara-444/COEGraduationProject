
Module.register("MMM-PrayerTimes", {
    defaults: {
        location: "auto", 
        updateInterval: 60 * 60 * 1000, // every hour
        method: 2, 
        showNextPrayer: true,
        showQiblaDirection: false,
        animationSpeed: 1000,
        header: "Prayer Times",
        timeFormat: "12"
    },

  

    // Required styles
    getStyles: function() {
        return ["MMM-PrayerTimes.css"];
    },

  
    start: function() {
        Log.info("Starting module: " + this.name);
        this.prayerTimes = null;
        this.nextPrayer = null;
        this.loaded = false;
        this.error = null;
        
       
        this.getPrayerTimes();
        this.scheduleUpdate();
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "prayer-times-wrapper";

        if (!this.loaded) {
            wrapper.innerHTML = "Loading prayer times...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (this.error) {
            wrapper.innerHTML = "Error: " + this.error;
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (!this.prayerTimes) {
            wrapper.innerHTML = "No prayer times available";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        const header = document.createElement("div");
        header.className = "prayer-header";
        header.innerHTML = this.prayerTimes.title || this.prayerTimes.city || "Prayer Times";
        wrapper.appendChild(header);

        if (this.prayerTimes.date_for && this.prayerTimes.date_for !== "undefined") {
            const dateDiv = document.createElement("div");
            dateDiv.className = "prayer-date";
            dateDiv.innerHTML = this.prayerTimes.date_for;
            wrapper.appendChild(dateDiv);
        }

        //prayer times table
        const table = document.createElement("table");
        table.className = "prayer-table small";

        const prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
        const prayerNames = {
            fajr: "Fajr",
            dhuhr: "Dhuhr",
            asr: "Asr",
            maghrib: "Maghrib",
            isha: "Isha"
        };

        prayers.forEach(prayer => {
            const row = document.createElement("tr");
            
            if (this.nextPrayer && this.nextPrayer.name === prayer) {
                row.className = "next-prayer";
            }

            const nameCell = document.createElement("td");
            nameCell.className = "prayer-name";
            nameCell.innerHTML = prayerNames[prayer];
            row.appendChild(nameCell);

            const timeCell = document.createElement("td");
            timeCell.className = "prayer-time";
            const time = this.prayerTimes.items[0][prayer];
            timeCell.innerHTML = this.formatTime(time);
            row.appendChild(timeCell);

        

            table.appendChild(row);
        });

        wrapper.appendChild(table);

    

        return wrapper;
    },

    getPrayerTimes: function() {
        Log.info("MMM-PrayerTimes: Requesting prayer times");
        this.sendSocketNotification("GET_PRAYER_TIMES", this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "PRAYER_TIMES_RESULT") {
            if (payload.success) {
                Log.info("MMM-PrayerTimes: Prayer times received");
                this.prayerTimes = payload.data;
                this.calculateNextPrayer();
                this.loaded = true;
                this.error = null;
            } else {
                Log.error("MMM-PrayerTimes: Error fetching prayer times:", payload.error);
                this.loaded = true;
                this.error = payload.error;
            }
            this.updateDom(this.config.animationSpeed);
        }
    },

    formatTime: function(timeString) {
        if (!timeString) return "";
        
        // Handle if timeString already has AM/PM (like "6:14 am")
        if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
            if (this.config.timeFormat === "12") {
                // Already in 12-hour format, just return it
                return timeString;
            } else {
                // Convert to 24-hour format
                const isPM = timeString.toLowerCase().includes('pm');
                const timeOnly = timeString.replace(/am|pm/gi, '').trim();
                const [hours, minutes] = timeOnly.split(':').map(Number);
                let hour24 = hours;
                if (isPM && hours !== 12) hour24 = hours + 12;
                if (!isPM && hours === 12) hour24 = 0;
                return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
        }
        
        // Handle 24-hour format input
        const [hours, minutes] = timeString.split(':').map(Number);
        
        if (this.config.timeFormat === "12") {
            const period = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
        } else {
            return timeString;
        }
    },

    // Parse time string to Date object
    parseTime: function(timeString) {
        if (!timeString) return new Date();
        
        // Handle if timeString has AM/PM (like "6:14 am")
        if (timeString.toLowerCase().includes('am') || timeString.toLowerCase().includes('pm')) {
            const isPM = timeString.toLowerCase().includes('pm');
            const timeOnly = timeString.replace(/am|pm/gi, '').trim();
            let [hours, minutes] = timeOnly.split(':').map(Number);
            
            // Convert to 24-hour format
            if (isPM && hours !== 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
            
            const date = new Date();
            date.setHours(hours, minutes, 0, 0);
            return date;
        }
        
        // Handle 24-hour format
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    },

    calculateNextPrayer: function() {
        if (!this.prayerTimes || !this.prayerTimes.items || !this.prayerTimes.items[0]) {
            return;
        }

        const now = new Date();
        const prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
        const todayPrayers = this.prayerTimes.items[0];

        for (let i = 0; i < prayers.length; i++) {
            const prayerTime = this.parseTime(todayPrayers[prayers[i]]);
            
            if (prayerTime > now) {
                this.nextPrayer = {
                    name: prayers[i],
                    time: prayerTime
                };
                return;
            }
        }

        const fajrTime = this.parseTime(todayPrayers.fajr);
        fajrTime.setDate(fajrTime.getDate() + 1);
        this.nextPrayer = {
            name: "fajr",
            time: fajrTime
        };
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getPrayerTimes();
        }, this.config.updateInterval);

        // Update every minute
        setInterval(() => {
            this.calculateNextPrayer();
            this.updateDom(this.config.animationSpeed);
        }, 60000);
    }
});