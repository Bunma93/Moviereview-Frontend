import './App.scss';
import React, { useState } from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import PrivateRoutes from './private-routes/PrivateRoutes';
import localStorageService from './services/localStorageService';


function App() {
  const [role, setRole] = useState(localStorageService.getRole());
  
  return (
    <div className="App">
        <Router>
          <PrivateRoutes role={role} setRole={setRole}/>
        </Router>
    </div>
  );
}

export default App;
