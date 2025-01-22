/* Global Variables */
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "ae684c8809f260571a8216177ef33e56";

let d = new Date();
let newDate = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();

const userInfo = document.querySelector("#userInfo");

const generateBtn = document.querySelector("#generate");

const performAction=e=> {
  e.preventDefault();
  
  //get user input
  const zipCode = document.querySelector("#zip").value;
  const content = document.querySelector("#feelings").value;
  
  if (zipCode !== "") {
    generateBtn.classList.remove("invalid");
    getWeatherData(baseUrl, zipCode, apiKey)
    .then(function (data) {
      
      postData("/add", {
        temp: convertKelvinToCelsius(data.main.temp),
        date: newDate,
        content: content,
      });
    })
    .then(function () {
      
      updateUI();
    })
    .catch(function (error) {
      console.log(error);
      alert("The zip code is invalid. Try again");
    });
    userInfo.reset();
  } else {
    generateBtn.classList.add("invalid");
  }
}
generateBtn.addEventListener("click", performAction);

const getWeatherData = async (baseUrl, zipCode, apiKey) => {
 
  const res = await fetch(`${baseUrl}?q=${zipCode}&appid=${apiKey}`);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};


const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      temp: data.temp,
      date: data.date,
      content: data.content,
    }),
  });

  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

const updateUI = async () => {
  const request = await fetch("/all");
  try {
    const allData = await request.json();
    console.log(allData);

    if (
      allData.date !== undefined &&
      allData.temp !== undefined &&
      allData.content !== undefined
    ) {
      document.querySelector("#date").innerHTML = allData.date;
      document.querySelector("#temp").innerHTML = allData.temp + " degree C";
      document.querySelector("#content").innerHTML = allData.content;
    }
  } catch (error) {
    console.log("error", error);
  }
};

const convertKelvinToCelsius=kelvin=> {
  if (kelvin < 0) {
    return "below absolute zero (0 K)";
  } else {
    return (kelvin - 273.15).toFixed(2);
  }
}
