// Weather Widget for Porto Alegre Chamber of Commerce
// Using OpenWeatherMap API

document.addEventListener("DOMContentLoaded", function () {
    const weatherWidget = document.getElementById("weatherWidget");

    if (weatherWidget) {
        // Porto Alegre coordinates
        const lat = -30.0346;
        const lon = -51.2177;
        const apiKey = "YOUR_API_KEY_HERE"; // Replace with your OpenWeatherMap API key

        // Check if API key is set
        if (apiKey === "YOUR_API_KEY_HERE") {
            displayPlaceholderWeather();
            return;
        }

        fetchWeather(lat, lon, apiKey);
    }
});

async function fetchWeather(lat, lon, apiKey) {
    const weatherWidget = document.getElementById("weatherWidget");
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Weather data not available");
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
        weatherWidget.innerHTML = `
            <div style="text-align: center; color: #e74c3c;">
                <p>⚠️ Unable to load weather data</p>
                <p style="font-size: 0.9rem;">Please check your internet connection</p>
            </div>
        `;
    }
}

function displayWeather(data) {
    const weatherWidget = document.getElementById("weatherWidget");
    const temp = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    const feelsLike = Math.round(data.main.feels_like);

    // Get weather emoji based on icon code
    const weatherEmoji = getWeatherEmoji(icon);

    weatherWidget.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%;">
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 0.5rem;">${weatherEmoji}</div>
                <div style="font-size: 3rem; font-weight: bold; color: var(--primary);">${temp}°C</div>
                <div style="font-size: 1.2rem; color: #666; text-transform: capitalize; margin-top: 0.5rem;">${description}</div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; width: 100%; max-width: 500px;">
                <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.7); border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.25rem;">Feels Like</div>
                    <div style="font-size: 1.3rem; font-weight: 600; color: var(--primary);">${feelsLike}°C</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.7); border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.25rem;">Humidity</div>
                    <div style="font-size: 1.3rem; font-weight: 600; color: var(--primary);">${humidity}%</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.7); border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.25rem;">Wind Speed</div>
                    <div style="font-size: 1.3rem; font-weight: 600; color: var(--primary);">${windSpeed} km/h</div>
                </div>
            </div>
        </div>
    `;
}

function displayPlaceholderWeather() {
    const weatherWidget = document.getElementById("weatherWidget");

    // Display placeholder/demo weather data
    weatherWidget.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%;">
            <div style="text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 0.5rem;">☀️</div>
                <div style="font-size: 3rem; font-weight: bold; color: var(--primary);">24°C</div>
                <div style="font-size: 1.2rem; color: #666; text-transform: capitalize; margin-top: 0.5rem;">Clear Sky</div>
                <div style="font-size: 0.85rem; color: #999; margin-top: 0.5rem; font-style: italic;">
                    (Demo data - Add API key to show live weather)
                </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; width: 100%; max-width: 500px;">
                <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.7); border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.25rem;">Feels Like</div>
                    <div style="font-size: 1.3rem; font-weight: 600; color: var(--primary);">26°C</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.7); border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.25rem;">Humidity</div>
                    <div style="font-size: 1.3rem; font-weight: 600; color: var(--primary);">65%</div>
                </div>
                <div style="text-align: center; padding: 1rem; background: rgba(255,255,255,0.7); border-radius: 8px;">
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.25rem;">Wind Speed</div>
                    <div style="font-size: 1.3rem; font-weight: 600; color: var(--primary);">12 km/h</div>
                </div>
            </div>
        </div>
    `;
}

function getWeatherEmoji(iconCode) {
    const weatherEmojis = {
        "01d": "☀️", // clear sky day
        "01n": "🌙", // clear sky night
        "02d": "⛅", // few clouds day
        "02n": "☁️", // few clouds night
        "03d": "☁️", // scattered clouds
        "03n": "☁️",
        "04d": "☁️", // broken clouds
        "04n": "☁️",
        "09d": "🌧️", // shower rain
        "09n": "🌧️",
        "10d": "🌦️", // rain day
        "10n": "🌧️", // rain night
        "11d": "⛈️", // thunderstorm
        "11n": "⛈️",
        "13d": "❄️", // snow
        "13n": "❄️",
        "50d": "🌫️", // mist
        "50n": "🌫️"
    };

    return weatherEmojis[iconCode] || "🌤️";
}
