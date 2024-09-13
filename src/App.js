import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import RegistrationForm from './components/RegistrationForm';
import PayForm from './components/PayForm';
import IncomeReport from './components/IncomeReport';
import RegistrationsReport from './components/RegistrationReport';
import PaymentReport from './components/PaymentReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route path="/register" element={<RegistrationForm/>} />
        <Route path="/payments" element={<PayForm/>} />
        <Route path="/income_report" element={<IncomeReport />} />
        <Route path="/reg_report" element={<RegistrationsReport />} />
        <Route path="/pay_report" element={<PaymentReport />} />

      </Routes>
    </Router>
  );
}

export default App;
