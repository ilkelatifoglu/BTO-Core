import React, { useState, useEffect } from "react";

function App() {
  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
      });
  }, []);

  return (
    <div>
      {typeof backendData.users === "undefined"
        ? "Loading..."
        : backendData.users.map((user) => <p>{user}</p>)}
    </div>
  );
}

export default App;
