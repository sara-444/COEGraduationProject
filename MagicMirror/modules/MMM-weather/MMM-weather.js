Module.register("MMM-weather", {

	defaults:{
		updateInterval: 600000, // 10 min
    		animationSpeed: 1000,
	},
  
	start: function () {
		Log.info("starting this module" + this.name);
		this.weatherData = null;
		this.loaded = false;
		this.scheduleUpdate();
		this.ShowWeather = false;
	},


  getStyles: function() {
    return ["MMM-weather.css"];
  },


  updateWeather: function() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${this.config.latitude}&longitude=${this.config.longitude}&current=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        
       
        this.weatherData = {
          current: {
            temperature: data.current.temperature_2m,
            apparent_temperature: data.current.apparent_temperature,
            humidity: data.current.relativehumidity_2m,
            weathercode: data.current.weathercode,
            windspeed: data.current.windspeed_10m
          },
          tomorrow: {
            weathercode: data.daily.weathercode[1],
            temp_max: data.daily.temperature_2m_max[1],
            temp_min: data.daily.temperature_2m_min[1]
          },
          second: {
            weathercode: data.daily.weathercode[2],
            temp_max: data.daily.temperature_2m_max[2],
            temp_min: data.daily.temperature_2m_min[2]
          },
          third: {
            weathercode: data.daily.weathercode[3],
            temp_max: data.daily.temperature_2m_max[3],
            temp_min: data.daily.temperature_2m_min[3]
          },
          fourth: {
            weathercode: data.daily.weathercode[4],
            temp_max: data.daily.temperature_2m_max[4],
            temp_min: data.daily.temperature_2m_min[4]
          },
          fifth: {
            weathercode: data.daily.weathercode[5],
            temp_max: data.daily.temperature_2m_max[5],
            temp_min: data.daily.temperature_2m_min[5]
          },
          sixth: {
            weathercode: data.daily.weathercode[6],
            temp_max: data.daily.temperature_2m_max[6],
            temp_min: data.daily.temperature_2m_min[6]
          }
        };

        this.loaded = true;
        this.updateDom(this.config.animationSpeed);
      })
      .catch(error => {
        Log.error("Error fetching weather data:", error);
      });
  },


  getDom: function() {
    const wrapper = document.createElement("div");
    wrapper.className = "weather-wrapper";

    if (!this.loaded) {
      wrapper.innerHTML = "Loading weather...";
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    if (!this.weatherData) {
      wrapper.innerHTML = "No weather data";
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    // Today
    const todaySection = document.createElement("div");
    todaySection.className = "today-weather";

    const todayTemp = document.createElement("div");
    todayTemp.className = "main-temp";
    todayTemp.innerHTML = `${Math.round(this.weatherData.current.temperature)}°`;
    
    const todayIcon = document.createElement("div");
    todayIcon.className = "weather-icon";
    todayIcon.innerHTML = this.getWeatherIcon(this.weatherData.current.weathercode);

    const todayDetails = document.createElement("div");
    todayDetails.className = "weather-details";
    todayDetails.innerHTML = `
      <div class="weather-description">${this.getWeatherDescription(this.weatherData.current.weathercode)}</div>
      <div class="detail">Feels like ${Math.round(this.weatherData.current.apparent_temperature)}°</div>
      <div class="detail">Humidity: ${this.weatherData.current.humidity}%</div>
      <div class="detail">Wind: ${Math.round(this.weatherData.current.windspeed)} km/h </div>
    `;

    todaySection.appendChild(todayTemp);
    todaySection.appendChild(todayIcon);
    todaySection.appendChild(todayDetails);

    // Tomorrow
    const tomorrowSection = document.createElement("div");
    tomorrowSection.className = "days-weather";

    tomorrowSection.innerHTML = `
      
      <div class="days-content">
        <div class="days-icon">${this.getWeatherIcon(this.weatherData.tomorrow.weathercode)}</div>
        <div class="days-temps">${Math.round(this.weatherData.tomorrow.temp_max)}° / ${Math.round(this.weatherData.tomorrow.temp_min)}°</div>
      </div>
    `;

    // second
    const secondSection = document.createElement("div");
    secondSection.className = "days-weather";

    secondSection.innerHTML = `
     
      <div class="days-content">
        <div class="days-icon">${this.getWeatherIcon(this.weatherData.second.weathercode)}</div>
        <div class="days-temps">${Math.round(this.weatherData.second.temp_max)}° / ${Math.round(this.weatherData.second.temp_min)}°</div>
      </div>
    `;

    // third
    const thirdSection = document.createElement("div");
    thirdSection.className = "days-weather";

    thirdSection.innerHTML = `
     
      <div class="days-content">
        <div class="days-icon">${this.getWeatherIcon(this.weatherData.third.weathercode)}</div>
        <div class="days-temps">${Math.round(this.weatherData.third.temp_max)}° / ${Math.round(this.weatherData.third.temp_min)}°</div>
      </div>
    `;

    // fourth
    const fourthSection = document.createElement("div");
    fourthSection.className = "days-weather";

    fourthSection.innerHTML = `
     
      <div class="days-content">
        <div class="days-icon">${this.getWeatherIcon(this.weatherData.fourth.weathercode)}</div>
        <div class="days-temps">${Math.round(this.weatherData.fourth.temp_max)}° / ${Math.round(this.weatherData.fourth.temp_min)}°</div>
      </div>
    `;

    // fifth
    const fifthSection = document.createElement("div");
    fifthSection.className = "days-weather";

    fifthSection.innerHTML = `
      
      <div class="days-content">
        <div class="days-icon">${this.getWeatherIcon(this.weatherData.fifth.weathercode)}</div>
        <div class="days-temps">${Math.round(this.weatherData.fifth.temp_max)}° / ${Math.round(this.weatherData.fifth.temp_min)}°</div>
      </div>
    `;

    // sixth
    const sixthSection = document.createElement("div");
    sixthSection.className = "days-weather";

    sixthSection.innerHTML = `
      
      <div class="days-content">
        <div class="days-icon">${this.getWeatherIcon(this.weatherData.sixth.weathercode)}</div>
        <div class="days-temps">${Math.round(this.weatherData.sixth.temp_max)}° / ${Math.round(this.weatherData.sixth.temp_min)}°</div>
      </div>
    `;

    wrapper.appendChild(todaySection);
    wrapper.appendChild(tomorrowSection);

if (this.ShowWeather) {
    wrapper.appendChild(secondSection);
    wrapper.appendChild(thirdSection);
    wrapper.appendChild(fourthSection);
    wrapper.appendChild(fifthSection);
    wrapper.appendChild(sixthSection);
	return wrapper;
}
    return wrapper;
  },

  scheduleUpdate: function() {
    this.updateWeather();
    setInterval(() => {
      this.updateWeather();
    }, this.config.updateInterval);
  },


  getWeatherIcon: function(code) {
    const icons = {
      0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
      45: "🌫️", 48: "🌫️",
      51: "🌦️", 53: "🌦️", 55: "🌧️",
      61: "🌧️", 63: "🌧️", 65: "🌧️",
      71: "🌨️", 73: "🌨️", 75: "❄️", 77: "🌨️",
      80: "🌦️", 81: "🌧️", 82: "⛈️",
      85: "🌨️", 86: "❄️",
      95: "⛈️", 96: "⛈️", 99: "⛈️"
    };
    return icons[code] || "🌡️";
  },

  getWeatherDescription: function(code) {
    const descriptions = {
      0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
      45: "Foggy", 48: "Foggy",
      51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
      61: "Light rain", 63: "Rain", 65: "Heavy rain",
      71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
      80: "Rain showers", 81: "Rain showers", 82: "Heavy rain",
      85: "Snow showers", 86: "Heavy snow",
      95: "Thunderstorm", 96: "Thunderstorm", 99: "Heavy thunderstorm"
    };
    return descriptions[code] || "Unknown";
  },

   notificationReceived: function (notification, payload, sender) {
		if(notification === "SHOW"){
		this.ShowWeather = true;
		this.updateDom(this.config.animationSpeed);
		}
		else if(notification === "HIDE"){
		this.ShowWeather = false;
		this.updateDom(this.config.animationSpeed);
		}
	}
});