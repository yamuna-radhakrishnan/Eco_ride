import { useState, useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
// import L from "leaflet";
// import { MapContainer, TileLayer } from "react-leaflet";
// import PropTypes from "prop-types";
import MapComponent from "../BookRide/Map";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

const Sample = () => {
  const [leaving, setLeaving] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [leavingFromLatitude, setLeavingFromLatitude] = useState(null);
  const [leavingFromLongitude, setLeavingFromLongitude] = useState(null);
  const [placeId, setPlaceId] = useState("");

  console.log(leavingFromLatitude);
  console.log(leavingFromLongitude);

  useEffect(() => {
    if (leaving !== "") {
      fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${leaving}&format=json&apiKey=7150d3d1879642babb4e29c827ae645b`
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          const newSuggestions = result.results.map((item) => ({
            label: `${item.address_line1} ${item.address_line2}`,
            value: item,
          }));
          setSuggestions(newSuggestions);
        })
        .catch((error) => console.log("error", error));
    }
  }, [leaving]);

  useEffect(() => {
    fetch(
      `https://api.geoapify.com/v2/place-details?id=${placeId}&apiKey=7150d3d1879642babb4e29c827ae645b`
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }, [placeId]);

  return (
    <div>
      <Autocomplete
        options={suggestions}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Leaving From"
            variant="outlined"
            onChange={(e) => setLeaving(e.target.value)}
          />
        )}
        onChange={(event, newValue) => {
          if (newValue) {
            setLeaving(newValue.label);
            setLeavingFromLatitude(newValue.value.lat);
            setLeavingFromLongitude(newValue.value.lon);
          } else {
            setLeaving("");
            setLeavingFromLatitude(null);
            setLeavingFromLongitude(null);
          }
        }}
      />
      {leavingFromLatitude !== null && leavingFromLongitude !== null && (
        <MapComponent
          latitude={leavingFromLatitude}
          longitude={leavingFromLongitude}
        />
      )}
    </div>
  );
};

export default Sample;
