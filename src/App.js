import React, {useState} from 'react';
import Login from './Login';
// import axios from 'axios';
import Dashboard from './Dashboard';
import PortfolioList from "./PortfolioList";

import './App.css';
// import * as xios from "browserslist";

function App() {
  
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // useEffect(() => {
  //   if (token) {
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //     localStorage.setItem('token', token);
  //   } else {
  //     delete axios.defaults.headers.common['Authorization'];
  //     localStorage.removeItem('token');
  //   }
  // }, [token]);
  
  const handleLogout = () => {
    setToken(null);
  };
  
  if(!token) {
    return <Login onLogin={setToken} />;
  }
  
  return (
    <div className="App">
      {/*<header className="flex justify-between items-center mb-4">*/}
      {/*  <h1 className="text-xl font-bold">StockWise Dashboard</h1>*/}
      {/*  <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>*/}
      {/*</header>*/}
      <PortfolioList />
    </div>
  );
}

export default App;
