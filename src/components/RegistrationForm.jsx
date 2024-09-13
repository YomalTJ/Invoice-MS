import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const RegistrationForm = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [fullname, setFullname] = useState('');
  const [nicOrpp, setNicOrPp] = useState('');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/payment/registration/default-country');
        const data = await response.json();
        setCountries(data.countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: fullname,
      description: 'Registration payment',
      nicOrPp: nicOrpp,
      mobile: mobile,
      country: selectedCountry,
      amount: amount,
    };
    try {
      const response = await fetch('http://localhost:5000/api/payment/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Registration payment created successfully');
        generateAndDisplayPDF(result.payment);
      } else {
        setMessage('Error creating registration payment: ' + result.message);
      }
    } catch (error) {
      setMessage('Error creating registration payment: ' + error.message);
    }
  };
  const generateAndDisplayPDF = (payment) => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text("GLOBAL LANGUAGE ACADEMY (PVT) LTD", 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text("Jana Jaya City Complex, # 801, Level 8, Nawala Road, Rajagiriya.", 105, 28, null, null, "center");
    // Reference number and date
    doc.text("No: ", 170, 40);
    doc.setFontSize(14);
    doc.text("PAYMENT VOUCHER", 105, 50, null, null, "center");
    doc.setFontSize(11);
    // Display the date of payment
    const formattedDate = new Date(payment.date).toLocaleDateString();
    doc.text("DATE  :--  " + formattedDate, 20, 60);
    // doc.line(40, 61, 105, 61);
    doc.text("NIC NO:", 20, 70);
    doc.line(45, 71, 105, 71);
    doc.text("PASSPORT NO:", 110, 70);
    doc.line(150, 71, 190, 71);
    doc.text("FULL NAME:", 20, 80);
    doc.line(45, 81, 105, 81);
    doc.text("REF NO  :--  " + payment.referenceNumber, 110, 80);
    // doc.line(150, 81, 190, 81);
    doc.rect(20, 90, 170, 60);
    doc.line(20, 100, 190, 100);
    doc.line(150, 90, 150, 150);
    doc.text("DESCRIPTION", 85, 97, null, null, "center");
    doc.text("AMOUNT PAID", 170, 97, null, null, "center");
    doc.text("TOTAL AMOUNT", 22, 158);
    doc.line(20, 160, 190, 160);
    doc.text("RECEIPT NO:", 20, 170);
    doc.line(55, 171, 105, 171);
    doc.text("ACCEPTED BY:", 110, 170);
    doc.line(150, 171, 190, 171);
    doc.text("SIGNATURE", 150, 180);
    doc.line(150, 188, 190, 188);
    // Fill in the data from the backend
    doc.setFontSize(12);
    doc.text(payment.nicOrPp, 46, 69);
    doc.text(payment.name, 51, 79);
    doc.text("Registration payment", 25, 110);
    doc.text(payment.amount.toString(), 175, 110, { align: "right" });
    doc.text(payment.amount.toString(), 175, 158, { align: "right" });
    // Open PDF in a new tab
    window.open(URL.createObjectURL(doc.output('blob')), '_blank');
    // Trigger download
    doc.save('PaymentVoucher.pdf');
  };
  return (
    <div className="container py-5">
      <div className="card border-0 shadow-sm p-4 position-relative">
        <a href="/" className="text-dark position-absolute" style={{ top: '10px', left: '10px' }}>
          <i className="bi bi-arrow-left-circle" style={{ fontSize: '2rem' }}></i>
        </a>
        <h2 className="mb-4 text-center fw-bold">Applicant Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name:</label>
            <input
              type="text"
              className="form-control border-1 border-danger"
              id="fullName"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nicNo" className="form-label">NIC or Passport No:</label>
            <input
              type="text"
              className="form-control border-1 border-danger"
              id="nicNo"
              value={nicOrpp}
              onChange={(e) => setNicOrPp(e.target.value)}
              required
            />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="mobileNo" className="form-label">Mobile No:</label>
              <input
                type="text"
                className="form-control border-1 border-danger"
                id="mobileNo"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="country" className="form-label">Country:</label>
              <select
                className="form-select border-1 border-danger"
                id="country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                required
              >
                <option value="">Select a country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount:</label>
            <input
              type="number"
              className="form-control border-1 border-danger"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Print Bill</button>
        </form>
        {message && <p className="text-center mt-3">{message}</p>}
      </div>
    </div>
  );
};
export default RegistrationForm;