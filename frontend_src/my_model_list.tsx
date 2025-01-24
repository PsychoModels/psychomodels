import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import MyModelListApp from "./MyModelListApp.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MyModelListApp />
  </React.StrictMode>,
);
