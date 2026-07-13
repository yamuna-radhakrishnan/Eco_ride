import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import App from "./oldComponents/App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./components/Store/store.jsx";
// import MapComponent from "./oldComponents/BookRide/Map.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <MapComponent /> */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
