import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ContactFormApp from "./ContactFormApp.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContactFormApp />
  </React.StrictMode>,
);
