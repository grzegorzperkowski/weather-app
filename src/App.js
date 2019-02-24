import React, { useState } from "react";

import "./App.css";
import PlacePicker from "./components/PlacePicker";
import Weather from "./components/Weather";

export default function App() {
  const [places, setPlace] = useState([]);

  function handlePlaceSelected(selectedPlace) {
    setPlace([...places, selectedPlace]);
  }

  return (
    <div>
      <header />
      <PlacePicker onPlaceSelected={handlePlaceSelected} />
      {places.map(place => (
        <Weather place={place} key={place} />
      ))}
      {/* <Weather place={place} /> */}
    </div>
  );
}
