import React, { Component } from "react";
import axios from "axios";

const CancelToken = axios.CancelToken;
let cancel;

const APP_ID = "quEBN5y1RpIs0j412mWa";
const APP_CODE = "DyCA3Z89Utyz48Z1XogqmA";

export default class PlacePicker extends Component {
  state = {
    name: "",
    autocomplete: []
  };

  cancelRequest = () => {
    if (cancel) cancel();
    cancel = null;
  };

  componentWillUnmount() {
    this.cancelRequest();
  }

  updateAutocompleteList = name => {
    this.cancelRequest();

    if (name.length < 2) {
      this.setState({ autocomplete: [] });
      return;
    }

    const url = encodeURI(
      `http://autocomplete.geocoder.api.here.com/6.2/suggest.json?app_id=${APP_ID}&app_code=${APP_CODE}&query=${name}`
    );
    axios
      .get(url, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        })
      })
      .then(result => {
        if (result.status === 200) {
          console.log(result);
          const places = result.data.suggestions.map(e => ({
            label: e.label,
            locationId: e.locationId,
            city: e.city
          }));

          this.setState({ autocomplete: places });
        }
      })
      .catch(err => {
        console.error("Error getting info for place ", name, "\nError: ", err);
        this.setState({ autocomplete: [] });
      });
  };

  handleChange = event => {
    this.setState({ name: event.target.value });
    this.updateAutocompleteList(event.target.value);
  };

  handleSelectedPlace = event => {
    const placeId = event.currentTarget.attributes.id.value;
    const userSelected = this.state.autocomplete.find(
      element => element.locationId === placeId
    );
    if (userSelected) {
      this.cancelRequest();

      this.setState({ name: userSelected.label, autocomplete: [] });
      this.props.onPlaceSelected(userSelected.label);
    } else {
      alert("Cannot find place ", placeId);
    }
  };
  handleKayDown = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      this.props.onPlaceSelected(this.state.name);

      console.log(event.key);
    } else if (event.key === "Esc") {
      console.log(event.key);
      event.preventDefault();
    }
  };

  render() {
    const divStyle = {
      width: "300px"
    };
    return (
      <div>
        <form autoComplete="off">
          <div className="autocomplete" style={divStyle}>
            <span>Type name of place</span>
            <input
              type="search"
              autoFocus={true}
              placeholder="Type name of your place"
              value={this.state.name}
              id="placePickerId"
              onChange={this.handleChange}
              onKeyDown={this.handleKayDown}
            />
            <div id={"autocomplete-list"} className="autocomplete-items">
              {this.state.autocomplete.map(element => (
                <div
                  onClick={this.handleSelectedPlace}
                  key={element.locationId}
                  id={element.locationId}
                >
                  {element.label}
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    );
  }
}
