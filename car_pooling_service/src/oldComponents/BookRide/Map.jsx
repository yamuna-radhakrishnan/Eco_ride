import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import "./Map.css"; // Import the CSS file

const MapComponent = ({ latitude, longitude }) => {
  useEffect(() => {
    const map = L.map("my-map").setView([latitude, longitude], 10);
    L.tileLayer(
      "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=7150d3d1879642babb4e29c827ae645b"
      // {
      //   attribution:
      //     'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
      //   maxZoom: 20,
      //   id: "osm-bright",
      // }
    ).addTo(map);

    // Create a custom icon for the marker
    const customIcon = L.icon({
      iconUrl: `https://api.geoapify.com/v1/icon/?type=material&color=red&size=x-large&icon=taxi&iconType=awesome&scaleFactor=2&apiKey=7150d3d1879642babb4e29c827ae645b
`,
      iconSize: [31, 46], // size of the icon
      iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -45], // point from which the popup should open relative to the iconAnchor
    });

    // Add a marker with the custom icon to the map
    L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

    // Cleanup function to remove the map instance
    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  MapComponent.propTypes = {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  };

  return <div id="my-map" style={{ height: "400px", width: "100%" }}></div>;
};

export default MapComponent;
