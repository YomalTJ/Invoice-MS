import React from 'react';
import { useState } from 'react';
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
const PaymentReport = () => {
    const [startDate, setStartDate] = useState(new Date());
  return (
    <Container className="my-5">
        {/* Back Button */}
        <a href="/" className="text-dark position-absolute" style={{ top: '10px', left: '10px' }}>
          <i className="bi bi-arrow-left-circle" style={{ fontSize: '2rem' }}></i>
        </a>
      <h2 className="text-center mb-4">PAYMENT REPORT</h2>
      {/* Top Boxes Section */}
      <Row className="text-center">
        <Col md={3}>
          <div className="p-3 bg-primary text-white rounded">
            <h6>Today Registration</h6>
            <h1>10</h1>
          </div>
        </Col>
        <Col md={3}>
          <div className="p-3 bg-primary text-white rounded">
            <h6>Today Income</h6>
            <h1>Lkr 100000</h1>
          </div>
        </Col>
        <Col md={3}>
          <div className="p-3 bg-primary text-white rounded">
            <h6>Weekly Income</h6>
            <h1>Lkr 500000</h1>
          </div>
        </Col>
        <Col md={3}>
          <div className="p-3 bg-primary text-white rounded">
            <h6>Monthly Income</h6>
            <h1>Lkr 500000</h1>
          </div>
        </Col>
      </Row>
      {/* NIC Section */}
      <Row className="my-4 align-items-center">
        <Col md={6} className="d-flex">
          <Form.Control type="text" placeholder="Enter NIC No" className="me-2 border border-primary" />
          <Button variant="primary">Search</Button>
        </Col>
        <Col md={{ span: 4, offset: 2 }} className="text-end">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy/MM/dd"
            className="form-control border border-primary"
          />
        </Col>
      </Row>
      {/* Income Table */}
      <Row>
        <Col>
          <h6>Today Income</h6>
          <Table striped bordered hover>
            <thead>
                <tr className="p-3 bg-primary text-white rounded">
                    <th></th>
                    <th>Name</th>
                    <th>Mobile No</th>
                    <th>Registered/Paid</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
              {Array.from({ length: 12 }).map((_, index) => (
                <tr key={index}>
                  <td><i class="bi bi-person-circle"></i></td>
                  <td>Name</td>
                  <td>Mobile No</td>
                  <td>Registered/Paid</td>
                  <td>Amount</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      {/* Print Report Button */}
      <Row className="text-end">
        <Col>
          <Button variant="primary" className='me-4'><i class="bi bi-printer-fill"></i> Print Report</Button>
        </Col>
      </Row>
    </Container>
  );
};
export default PaymentReport;