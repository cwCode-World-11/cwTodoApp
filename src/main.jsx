import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import GlobalDataContext from "./Hooks/GlobalDataContext.jsx";
import { BrowserRouter } from "react-router-dom";
import TanstackQueryProvider from "./lib/tanstackQuery/QueryProvider.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TanstackQueryProvider>
        <GlobalDataContext>
          <App />
        </GlobalDataContext>
      </TanstackQueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
