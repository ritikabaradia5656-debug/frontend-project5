const input = document.getElementById("cityInput");
const btn = document.getElementById("searchBtn");
const weatherBox = document.getElementById("weatherBox");

const API_KEY = "cca8448653fba09f5b0fb95e60151cd8"; // your key

btn.addEventListener("click", async () => {
  const city = input.value.trim();

  if (!city) return;

  weatherBox.innerHTML = "Loading... ⏳";

  try {
    // 🔹 Try OpenWeather first
    let res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    let data = await res.json();
    console.log("OpenWeather:", data);

    // ❌ If API key fails or city error → fallback
    if (data.cod != 200) {
      console.log("Switching to backup API...");

      const backupRes = await fetch(`https://wttr.in/${city}?format=j1`);
      const backupData = await backupRes.json();

      console.log("Backup API:", backupData);

      const temp = backupData.current_condition[0].temp_C;
      const desc = backupData.current_condition[0].weatherDesc[0].value;
      const humidity = backupData.current_condition[0].humidity;
      const wind = backupData.current_condition[0].windspeedKmph;

      weatherBox.innerHTML = `
        <div class="weather-card">
          <h2>${city}</h2>
          <p class="temp">🌡 ${temp}°C</p>
          <p class="desc">${desc}</p>
          <p>💧 Humidity: ${humidity}%</p>
          <p>🌬 Wind: ${wind} km/h</p>
        </div>
      `;

      return;
    }

    // ✅ OpenWeather success
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

   weatherBox.innerHTML = `
  <div class="weather-card">
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="${icon}" alt="weather icon">
    <p class="temp">🌡 ${data.main.temp}°C</p>
    <p>🤔 Feels like: ${data.main.feels_like}°C</p>
    <p class="desc">🌥 ${desc}</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬 Wind: ${data.wind.speed} km/h</p>
  </div>
`;
  } catch (error) {
    console.log(error);
    weatherBox.innerHTML = `<p class="error">Error fetching data ⚠️</p>`;
  }
});


// 🔥 BONUS: Press Enter to search
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});