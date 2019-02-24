import React, { Component } from "react";

import axios from "axios";

const APP_ID = "70f92be2ff3cdd0a4cc712e9fac9f1c0";

export default class Weather extends Component {
  state = {
    city: "",
    weather: null
  };

  CancelToken = axios.CancelToken;
  cancel = null;

  cancelRequest = () => {
    if (this.cancel) this.cancel();
    this.cancel = null;
  };

  componentWillUnmount() {
    this.cancelRequest();
  }

  getWeather = place => {
    this.cancelRequest();
    const lang = "pl";
    const url = encodeURI(
      `http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${APP_ID}&lang=${lang}&units=metric`
    );
    axios
      .get(url, {
        cancelToken: new axios.CancelToken(c => {
          this.cancel = c;
        })
      })
      .then(result => {
        if (result.status === 200) {
          const weather = { ...result.data };
          console.log(weather);
          this.setState({ weather, city: place });
        }
      })
      .catch(err => {
        console.error(
          "Error while getting weather for ",
          place,
          ". Error: ",
          err
        );
        this.setState({ weather: null });
      });
  };
  getIconUrl = icon => {
    return `http://openweathermap.org/img/w/${icon}.png`;
  };
  render() {
    if (this.props.place !== this.state.city) this.getWeather(this.props.place);
    if (this.state.weather) {
      console.log(
        "Display weather for ",
        this.state.city,
        "\n",
        this.state.weather
      );
      return (
        <div id="wetherMainFrame">
          <h6 className="badge m-2 badge-primary">{this.state.city}</h6>
          <div>{this.state.weather.weather[0].description}</div>
          <img
            src={this.getIconUrl(this.state.weather.weather[0].icon)}
            alt={this.state.weather.weather[0].main}
          />
          <div>Temperature: {this.state.weather.main.temp}</div>
          <div>Pressure: {this.state.weather.main.pressure}</div>
          <div>Humidity: {this.state.weather.main.humidity}</div>
          <div>Wind speed: {this.state.weather.wind.speed}</div>
        </div>
      );
    }

    return <div>Place no selected!</div>;
  }
}
