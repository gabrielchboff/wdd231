// select HTML elements in the document
const currentTemp = document.querySelector("#current-temp");
const weatherIcon = document.querySelector("#weather-icon");
const captionDesc = document.querySelector("figcaption");

const url = `https://api.openweathermap.org/data/3.0/weather?lat=49.76&lon=6.65&units=metric&appid=d69339819a05c0148b07a3cbe8d01078`;
console.log(url);

function displayResults(data) {
  currentTemp.innerHTML = `<strong>${data.current.temp.toFixed(0)}</strong>`;

  const iconsrc = `https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`;
  const desc = data.current.weather[0].description;

  weatherIcon.setAttribute("src", iconsrc);
  weatherIcon.setAttribute("alt", desc);
  captionDesc.textContent = desc;
}

async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      displayResults(data);
    } else {
      throw Error(await response.text());
    }
  } catch (error) {
    console.log(error);
  }
}

apiFetch();
