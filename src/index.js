import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SidebarProvider } from "./contexts/SidebarContext";
import { BrowserRouter } from "react-router-dom";
import { HashConnect } from "hashconnect";
import { registerServiceWorker } from "./serviceWorker";
import HashconnectProvider from "./contexts/HashconnectProvider";
import UserAuthContextProvider from "./contexts/UserAuthContextProvider";
import MessagesContextProvider from "./contexts/MessagesContextProvider";

const hashConnect = new HashConnect(true);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SidebarProvider>
      <HashconnectProvider hashConnect={hashConnect} debug>
        <UserAuthContextProvider>
          <MessagesContextProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </MessagesContextProvider>
        </UserAuthContextProvider>
      </HashconnectProvider>
    </SidebarProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
registerServiceWorker();
