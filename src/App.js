import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Query1 from './components/Query1';
import Query2 from './components/Query2';
import Query3 from './components/Query3';
import Query4 from './components/Query4';
import Query5 from './components/Query5';
import Query6 from './components/Query6';
import './App.css'; // Import your CSS file
const App = () => {
  return (
    <div >
    <Router>
    
    <div>
        <nav className="table-nav">
          <ul>
            <li>
              <Link to="/query1">REAL ESTATE VS CRIME DATA</Link>
            </li>
            <li>
              <Link to="/query2">SALES RATIOS FOR DIFFERENT PROPERTY TYPES OVER THE YEARS</Link>
            </li>
            <li>
              <Link to="/query3">REAL ESTATE SALES VS HOME LOAN INTEREST RATES</Link>
            </li>
            <li>
              <Link to="/query4">REAL ESTATE MARKET IN VARIOUS SEASONS</Link>
            </li>
            <li>
              <Link to="/query5">IMPACT OF THE GREAT RECESSION AND COVID 19 ON THE REAL ESTATE MARKET</Link>
            </li>
            <li>
              <Link to="/query6">PREFERRED RESIDENTIAL PROPERTY TYPE</Link>
            </li>
          </ul>
        </nav>
 
        <hr />
        
     <Routes>
        <Route path="/query1" element={<Query1/>} />
        <Route path="/query2" element={<Query2/>} />
        <Route path="/query3" element={<Query3/>} />
        <Route path="/query4" element={<Query4/>} />
        <Route path="/query5" element={<Query5/>} />
        <Route path="/query6" element={<Query6/>} />
        </Routes>
      </div>
     
    </Router>
    </div>
  );
};

export default App;
