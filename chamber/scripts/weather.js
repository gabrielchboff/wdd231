
document.addEventListener("DOMContentLoaded", () => {
    const weatherWidget = document.getElementById("weatherWidget");
    if (!weatherWidget) return;

    // Porto Alegre coordinates (adjust if needed)
    const lat = -30.0346;
    const lon = -51.2177;
    const apiKey = "d69339819a05c0148b07a3cbe8d01078";

    if (apiKey === "d69339819a05c0148b07a3cbe8d01078") {
        displayPlaceholderWeather();
        return;
    }

    fetchWeather(lat, lon, apiKey);
});

async function fetchWeather(lat, lon, apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Weather data not available");

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error("Weather error:", error);
        document.getElementById("weatherWidget").innerHTML =
            "<p>⚠️ Unable to load weather data.</p>";
    }
}

function displayWeather(data) {
    const weatherWidget = document.getElementById("weatherWidget");

    // CURRENT WEATHER
    const current = data.list[0];
    const temp = Math.round(current.main.temp);
    const description = current.weather[0].description;
    const icon = current.weather[0].icon;

    // 3-DAY FORECAST (one per day at noon)
    const forecastDays = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    ).slice(0, 3);

    weatherWidget.innerHTML = `
        <div class="weather-current">
            <div class="weather-icon">${getWeatherEmoji(icon)}</div>
            <div class="weather-temp">${temp}°C</div>
            <div class="weather-desc">${description}</div>
        </div>

        <div class="weather-forecast">
            ${forecastDays.map(day => {
                const date = new Date(day.dt_txt);
                const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                return `
                    <div class="forecast-day">
                        <div class="forecast-name">${dayName}</div>
                        <div class="forecast-icon">${getWeatherEmoji(day.weather[0].icon)}</div>
                        <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function displayPlaceholderWeather() {
    document.getElementById("weatherWidget").innerHTML = `
        <div class="weather-current">
            <div class="weather-icon">☀️</div>
            <div class="weather-temp">24°C</div>
            <div class="weather-desc">Clear Sky</div>
        </div>

        <div class="weather-forecast">
            <div class="forecast-day">
                <div class="forecast-name">Mon</div>
                <div class="forecast-icon">⛅</div>
                <div class="forecast-temp">25°C</div>
            </div>
            <div class="forecast-day">
                <div class="forecast-name">Tue</div>
                <div class="forecast-icon">🌦️</div>
                <div class="forecast-temp">22°C</div>
            </div>
            <div class="forecast-day">
                <div class="forecast-name">Wed</div>
                <div class="forecast-icon">☁️</div>
                <div class="forecast-temp">21°C</div>
            </div>
        </div>
    `;
}

function getWeatherEmoji(iconCode) {
    const weatherEmojis = {
        "01d": "☀️", "01n": "🌙",
        "02d": "⛅", "02n": "☁️",
        "03d": "☁️", "03n": "☁️",
        "04d": "☁️", "04n": "☁️",
        "09d": "🌧️", "09n": "🌧️",
        "10d": "🌦️", "10n": "🌧️",
        "11d": "⛈️", "11n": "⛈️",
        "13d": "❄️", "13n": "❄️",
        "50d": "🌫️", "50n": "🌫️"
    };

    return weatherEmojis[iconCode] || "🌤️";
}
