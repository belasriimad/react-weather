import React from "react";
import places from "places.js";
import moment from "moment";
import "moment/locale/fr";

function App() {
  const [city, setCity] = React.useState("");
  const [weather, setWeather] = React.useState(null);
  const [data, setData] = React.useState([]);
  const iconLink = "https://darksky.net/images/weather-icons/";

  React.useEffect(() => {
    getPlaces();
  }, []);

  const getPlaces = () => {
    let placesAutocomplete = places({
      appId: "pl84BDTK7HU7",
      apiKey: "671cd803cf905b98ff3217c773e5207a",
      container: document.querySelector("#address-input")
    });
    placesAutocomplete.on("change", function(e) {
      getWeather(e.suggestion);
    });
  };

  const key = "1d5cfbb4b1ba74f6287033207b5f59d7";
  const getWeather = async suggestion => {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const apiURL = `https://api.darksky.net/forecast/${key}/${suggestion.latlng.lat},${suggestion.latlng.lng}?lang=fr&units=ca`;
    const data = await fetch(proxy + apiURL);
    const resData = await data.json();
    console.log(resData);
    const weatherData = {
      time: resData.currently.time,
      summary: resData.currently.summary,
      icon: `${resData.currently.icon}.png`,
      temperature: `${Math.round(resData.currently.temperature)}˚C`,
      humidity: resData.currently.humidity
    };
    setWeather(weatherData);
    setData(resData.daily.data);
  };

  const convertTimestamp = time => {
    let day = moment
      .unix(time)
      .locale("fr")
      .utc();
    return day.format("dddd MMM Do");
  };

  return (
    <div className="container">
      <div className="row my-4">
        <div className="col-md-6 mx-auto">
          <div className="card bg-white text-dark">
            <div className="card-header">
              <h3 className="card-title mt-2 text-center">React Weather</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      type="search"
                      name="city"
                      id="address-input"
                      autoComplete="off"
                      className="form-control"
                      placeholder="Entrer une ville"
                      aria-describedby="helpId"
                      onChange={event => setCity(event.target.value)}
                    />
                  </div>
                </div>
                {weather !== null && (
                  <div className="weather border-bottom">
                    <div className="weather-header">
                      <img
                        src={iconLink + weather.icon}
                        alt="icon"
                        width="80"
                        height="80"
                        className="img-fluid"
                      />
                      <h3 className="temperature font-weight-bold">
                        {weather.temperature}
                      </h3>
                    </div>
                    <h3 className="temperature my-2 font-weight-bold">
                      {moment().calendar()}
                    </h3>
                    <h5 className="font-weight-bold">{weather.summary}</h5>
                  </div>
                )}
                <div className="row">
                  {data != null &&
                    data.map(day => (
                      <div className="col mb-1" key={day.time}>
                        <div className="day">
                          <span className="text-dark">
                            {convertTimestamp(day.time)}
                          </span>
                          <img
                            src={iconLink + day.icon + ".png"}
                            alt="icon"
                            width="50"
                            height="50"
                            className="img-fluid"
                          />
                          <span className="text-dark">
                            Max: {Math.round(day.temperatureHigh) + "˚C"}
                          </span>
                          <span className="text-dark">
                            Min: {Math.round(day.temperatureLow) + "˚C"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
