import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./github-markdown.css";
import AccountApp from "./AccountApp.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AccountApp />
  </React.StrictMode>,
);
