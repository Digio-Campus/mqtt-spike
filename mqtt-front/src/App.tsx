import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
const mqtt = require("mqtt/dist/mqtt");

function App() {
  const [data, setData] = useState<string[]>();

  React.useEffect(() => {
    // Recibimos los datos de la ruta del back por http, podría ser por websocket
    fetch("http://localhost:8080/mqttConnect")
      .then((response) => response.json())
      .then((response) => {
        setData(response.mensajes);
        console.log(response.mensajes);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {data?.map((each) => (
          <h1>{each}</h1>
        ))}
      </header>
    </div>
  );
}

export default App;
