const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "ae684c8809f260571a8216177ef33e56&units=metric";

let d = new Date();
let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
const userInfo = document.querySelector("#userInfo");

const generateBtn = document.querySelector("#generate");

const performAction = (e) => {
  e.preventDefault();
  const zipCode = document.querySelector("#zip").value;
  const content = document.querySelector("#feelings").value;
  if (zipCode !== "") {
    generateBtn.classList.remove("invalid");
    getWeatherData(baseUrl, zipCode, apiKey)
      .then(function (data) {
        if (data.cod !== 200) {
          throw new Error(data.message);
        }
        postData("/add", {
          temp: data.main.temp, 
          date: newDate,
          content: content,
        });
      })
      .then(function () {
        updateUI();
      })
      .catch(function (error) {
        console.error(error);
        alert("The zip code is invalid or there was an issue. Try again.");
      });
    userInfo.reset();
  } else {
    generateBtn.classList.add("invalid");
  }
};
generateBtn.addEventListener("click", performAction);

const getWeatherData = async (baseUrl, zipCode, apiKey) => {
  const res = await fetch(`${baseUrl}?q=${zipCode}&appid=${apiKey}`);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.error("Error posting data:", error);
  }
};

const updateUI = async () => {
  const request = await fetch("/all");
  try {
    const allData = await request.json();

    if (
      allData.date !== undefined &&
      allData.temp !== undefined &&
      allData.content !== undefined
    ) {
      document.querySelector("#date").innerHTML = allData.date;
      document.querySelector("#temp").innerHTML = allData.temp + "°C"; 
      document.querySelector("#content").innerHTML = allData.content;
    }
  } catch (error) {
    console.error("Error updating UI:", error);
  }
};
