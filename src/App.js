import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Visamf from './Visamf';
import FlyPage from './FlyPage';
import Layout from './Layout'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Visamf />} />
          <Route path='/home' element={<Visamf />} />
          <Route path="/fly" element={<FlyPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

