import React from "react";
import ReactDOM from "react-dom/client";
import App from "./containers/App";
import {ChatProvider} from "./containers/hooks/useChat";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/antd.css";

var tmp = document.getElementById("root")
if (tmp !== null) {
  const root = ReactDOM.createRoot(tmp);
  root.render(
    <React.StrictMode>
      <ChatProvider >
        <App />
      </ChatProvider>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
