// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AOLuaMandelbrotSet from "./components/AOLuaMandelbrotSet";
import JSMandelbrotSet from "./components/JSMandelbrotSet";

const App = () => {
 

  return (
    <Router>
          <Routes>
            <Route exact path="/" element={<AOLuaMandelbrotSet />} />
            <Route path="/js" element={<JSMandelbrotSet />} />
          </Routes>
    </Router>
  );
};

export default App;
