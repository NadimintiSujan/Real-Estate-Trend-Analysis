// AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Query1 from './components/Query1';
import Query2 from './components/Query2';
import Query3 from './components/Query3';
import Query4 from './components/Query4';
import Query5 from './components/Query5';
import Query6 from './components/Query6';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/query1" element={Query1} />
        <Route path="/query2" element={Query2} />
        <Route path="/query3" element={Query3} />
        <Route path="/query4" element={Query4} />
        <Route path="/query5" element={Query5} />
        <Route path="/query6" element={Query6} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
