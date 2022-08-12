import * as React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Birthday from "./pages/Birthday";
import CreateContract from "./pages/CreateContract";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<CreateContract />} />
        <Route path='/birthdays/:address' element={<Birthday />} />
      </Routes>
    </div>
  );
}
export default App;
