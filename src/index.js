import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app/App.js";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./app/store";
import { ThemeProvider } from "@mui/material";
import { theme } from "./app/theme";
import { APIProvider } from "@vis.gl/react-google-maps";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(

  <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API}>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </APIProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
