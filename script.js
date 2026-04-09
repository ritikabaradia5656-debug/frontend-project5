const input = document.getElementById("cityInput");
const btn = document.getElementById("searchBtn");
const weatherBox = document.getElementById("weatherBox");

btn.addEventListener("click", async () => {
  const city = input.value.trim();

  if (!city) {
    weatherBox.innerHTML = `<p class="error">Please enter a city ❗</p>`;
    return;
  }

  weatherBox.innerHTML = `<p>⏳ Fetching weather...</p>`;

  try {
    const res = await fetch(`https://wttr.in/${city}?format=j1`);
    const data = await res.json();

    // ✅ Current Weather
    const current = data.current_condition[0];

    const temp = current.temp_C;
    const desc = current.weatherDesc[0].value;
    const humidity = current.humidity;
    const wind = current.windspeedKmph;

    // 🌈 Optional background change
    if (desc.toLowerCase().includes("sun")) {
      document.body.style.background = "linear-gradient(135deg, #f6d365, #fda085)";
    } else if (desc.toLowerCase().includes("rain")) {
      document.body.style.background = "linear-gradient(135deg, #4facfe, #00f2fe)";
    }

    // ✅ Main UI
    weatherBox.innerHTML = `
      <div class="weather-card">
        <h2>${city}</h2>
        <p class="temp">🌡 ${temp}°C</p>
        <p class="label">Current Temperature</p>
        <p class="desc">🌥 ${desc}</p>
        <p>💧 Humidity: ${humidity}%</p>
        <p>🌬 Wind: ${wind} km/h</p>
      </div>
    `;

    // 🌦️ Forecast
    const forecastHTML = data.weather.map(day => {
      const dateObj = new Date(day.date);

      const dayName = dateObj.toLocaleDateString("en-IN", {
        weekday: "short"
      });

      const fullDate = dateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
      });

      const minTemp = day.mintempC;
      const maxTemp = day.maxtempC;
      const desc = day.hourly[4].weatherDesc[0].value;

      return `
        <div class="forecast-item">
          <p class="day">${dayName}</p>
          <p class="date">${fullDate}</p>
          <p class="temp-small">⬇ ${minTemp}°C / ⬆ ${maxTemp}°C</p>
          <p class="label-small">Day Range</p>
          <p class="desc-small">${desc}</p>
        </div>
      `;
    }).join("");

    weatherBox.innerHTML += `
      <div class="forecast">
        <h3>Forecast</h3>
        <div class="forecast-container">
          ${forecastHTML}
        </div>
      </div>
    `;

  } catch (error) {
    console.log(error);
    weatherBox.innerHTML = `<p class="error">Error fetching data ⚠️</p>`;
  }
});

// Enter key support
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});
