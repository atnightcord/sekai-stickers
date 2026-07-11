import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import App from "./views/App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
