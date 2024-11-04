import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  // <BrowserRouter
  //   // basename={process.env.NODE_ENV === "development" ? "/perfdb" : "/perfdb"}
  // >
  <App />,
  // </BrowserRouter>
);
