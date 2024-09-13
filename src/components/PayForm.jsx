import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format, parseISO } from 'date-fns';
const PayForm = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [nicOrPp, setNicOrPp] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [date, setDate] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create payment and get reference number and date from the backend
      const response = await axios.post('http://localhost:5000/api/payment/normal', {
        name,
        mobile,
        nicOrPp,
        amount,
        description,
      });
      const { referenceNumber, date } = response.data.payment;
      // Log the date to check its format
      console.log('Date:', date);
      // Parse and format date
      const formattedDate = date ? format(parseISO(date), 'dd MMM yyyy') : 'N/A';
      setDate(formattedDate);
      // After payment is successful, generate the PDF
      generatePDF({
        name,
        nicOrPp,
        referenceNumber,
        amount,
        date: formattedDate,  // Ensure date is formatted
      });
    } catch (error) {
      console.error('Error creating payment', error.response?.data || error);
    }
  };
  const generatePDF = (payment) => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.text("GLOBAL LANGUAGE ACADEMY (PVT) LTD", 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text("Jana Jaya City Complex, # 801, Level 8, Nawala Road, Rajagiriya.", 105, 28, null, null, "center");
    doc.setFontSize(14);
    doc.text("PAYMENT VOUCHER", 105, 50, null, null, "center");
    doc.setFontSize(11);
    // Display the date of payment
    doc.text("DATE  :--  " + payment.date, 20, 60);
    doc.text("NIC NO:", 20, 70);
    doc.line(45, 71, 105, 71);
    doc.text("PASSPORT NO:", 110, 70);
    doc.line(150, 71, 190, 71);
    doc.text("FULL NAME:", 20, 80);
    doc.line(45, 81, 105, 81);
    doc.text("REF NO  :--  " + payment.referenceNumber, 110, 80);
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
        {/* Back Button */}
        <a href="/" className="text-dark position-absolute" style={{ top: '10px', left: '10px' }}>
          <i className="bi bi-arrow-left-circle" style={{ fontSize: '2rem' }}></i>
        </a>
        {/* Heading */}
        <h2 className="mb-4 text-center">Pay</h2>
        {/* Form */}
        <form>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name:</label>
            <input
              type="text"
              className="form-control border-1 border-danger"
              id="fullName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="mobileNo" className="form-label">Mobile No:</label>
            <input
              type="text"
              className="form-control border-1 border-danger"
              id="mobileNo"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nicNo" className="form-label">NIC No:</label>
            <input
              type="text"
              className="form-control border-1 border-danger"
              id="nicNo"
              value={nicOrPp}
              onChange={(e) => setNicOrPp(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">Amount:</label>
            <input
              type="text"
              className="form-control border-1 border-danger"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="form-label">Description:</label>
            <textarea
              className="form-control border-1 border-danger"
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <button type="submit" onClick={handleSubmit} className="btn btn-primary w-100">Print Bill</button>
        </form>
      </div>
    </div>
  );
};
export default PayForm;