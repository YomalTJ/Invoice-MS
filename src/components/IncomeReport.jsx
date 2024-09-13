import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useReactToPrint } from 'react-to-print';

const IncomeReport = () => {
    const [todayDate, setTodayDate] = useState(new Date());
    const [dailyIncome, setDailyIncome] = useState({ registrationPayments: [], normalPayments: [] });
    const [weeklyIncome, setWeeklyIncome] = useState({ registrationIncome: 0, normalIncome: 0 });
    const [monthlyIncome, setMonthlyIncome] = useState({ registrationIncome: 0, normalIncome: 0 });
    const [error, setError] = useState(null);
    const [nicInput, setNicInput] = useState('');
    const [filteredDailyIncome, setFilteredDailyIncome] = useState({ registrationPayments: [], normalPayments: [] });

    const normalPaymentsRef = useRef();
    const registrationPaymentsRef = useRef();
    const allPaymentsRef = useRef();

    useEffect(() => {
        const fetchIncomeData = async () => {
            const formattedDate = todayDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

            try {
                // Fetch daily income
                const dailyResponse = await axios.get('http://localhost:5000/api/payment/payments/by-date', {
                    params: { date: formattedDate }
                });
                setDailyIncome(dailyResponse.data);

                // Fetch weekly income
                const weeklyResponse = await axios.get('http://localhost:5000/api/payment/income/weekly');
                setWeeklyIncome({
                    registrationIncome: weeklyResponse.data.weeklyRegistrationIncome || 0,
                    normalIncome: weeklyResponse.data.weeklyNormalIncome || 0
                });

                // Fetch monthly income
                const monthlyResponse = await axios.get('http://localhost:5000/api/payment/income/monthly');
                setMonthlyIncome({
                    registrationIncome: monthlyResponse.data.monthlyRegistrationIncome || 0,
                    normalIncome: monthlyResponse.data.monthlyNormalIncome || 0
                });

            } catch (error) {
                console.error('Error fetching income data:', error);
                setError('Error fetching data. Please try again later.');
            }
        };

        fetchIncomeData();
    }, [todayDate]);

    useEffect(() => {
        // Filter daily income data based on NIC input
        const filterByNIC = (payments) => {
            return payments.filter(payment => payment.nicOrPp.toLowerCase().includes(nicInput.toLowerCase()));
        };

        setFilteredDailyIncome({
            registrationPayments: filterByNIC(dailyIncome.registrationPayments),
            normalPayments: filterByNIC(dailyIncome.normalPayments)
        });
    }, [nicInput, dailyIncome]);

    const handlePrintNormalPayments = useReactToPrint({
        content: () => normalPaymentsRef.current,
        documentTitle: 'Normal_Payments_Report',
        onAfterPrint: () => console.log('Normal Payments Report printed!'),
    });

    const handlePrintRegistrationPayments = useReactToPrint({
        content: () => registrationPaymentsRef.current,
        documentTitle: 'Registration_Payments_Report',
        onAfterPrint: () => console.log('Registration Payments Report printed!'),
    });

    const handlePrintAllPayments = useReactToPrint({
        content: () => allPaymentsRef.current,
        documentTitle: 'Income_Report',
        onAfterPrint: () => console.log('Income Report printed!'),
    });

    const NormalPaymentsReport = React.forwardRef((props, ref) => (
      <div ref={ref} style={{ padding: '20px' }}>
          <div className="d-flex justify-content-between align-items-start mb-4" style={{ marginBottom: '30px' }}>
              <div className="text-right">
                  {new Date().toLocaleDateString()}
              </div>
              <div className="text-center" style={{ flex: 1 }}>
                  <h3 className="company-name" style={{ margin: 0, paddingBottom: '5px', fontWeight: 'bold', letterSpacing: '1px' }}>
                      GLOBAL LANGUAGE ACADEMY (PVT) LTD
                  </h3>
                  <p className="company-address" style={{ margin: 0, fontSize: '14px', color: '#555', paddingBottom: '10px' }}>
                      Jana Jaya City Complex, # 801, Level 8, Navala Road Rajagiriya
                  </p>
              </div>
          </div>
          <h2 className="text-center mb-4" style={{ marginBottom: '20px' }}>Normal Payments Report</h2>
          <h4 className="text-center mb-3" style={{ marginBottom: '15px' }}>Total Count: {dailyIncome.normalPayments.length}</h4>
          <Table striped bordered hover>
              <thead>
                  <tr className="p-3 bg-info text-white rounded">
                      <th>Name</th>
                      <th>Mobile No</th>
                      <th>NIC/PP</th>
                      <th>Registered/Paid</th>
                      <th>Amount</th>
                  </tr>
              </thead>
              <tbody>
                  {dailyIncome.normalPayments.map((payment, index) => (
                      <tr key={index}>
                          <td>{payment.name}</td>
                          <td>{payment.mobile}</td>
                          <td>{payment.nicOrPp}</td>
                          <td>{payment.paymentType}</td>
                          <td>Lkr {payment.amount}</td>
                      </tr>
                  ))}
              </tbody>
          </Table>
      </div>
  ));
  
  const RegistrationPaymentsReport = React.forwardRef((props, ref) => (
      <div ref={ref} style={{ padding: '20px' }}>
          <div className="d-flex justify-content-between align-items-start mb-4" style={{ marginBottom: '30px' }}>
              <div className="text-right">
                  {new Date().toLocaleDateString()}
              </div>
              <div className="text-center" style={{ flex: 1 }}>
                  <h3 className="company-name" style={{ margin: 0, paddingBottom: '5px', fontWeight: 'bold', letterSpacing: '1px' }}>
                      GLOBAL LANGUAGE ACADEMY (PVT) LTD
                  </h3>
                  <p className="company-address" style={{ margin: 0, fontSize: '14px', color: '#555', paddingBottom: '10px' }}>
                      Jana Jaya City Complex, # 801, Level 8, Navala Road Rajagiriya
                  </p>
              </div>
          </div>
          <h2 className="text-center mb-4" style={{ marginBottom: '20px' }}>Registration Payments Report</h2>
          <h4 className="text-center mb-3" style={{ marginBottom: '15px' }}>Total Count: {dailyIncome.registrationPayments.length}</h4>
          <Table striped bordered hover>
              <thead>
                  <tr className="p-3 bg-primary text-white rounded">
                      <th>Name</th>
                      <th>Mobile No</th>
                      <th>NIC/PP</th>
                      <th>Registered/Paid</th>
                      <th>Amount</th>
                  </tr>
              </thead>
              <tbody>
                  {dailyIncome.registrationPayments.map((payment, index) => (
                      <tr key={index}>
                          <td>{payment.name}</td>
                          <td>{payment.mobile}</td>
                          <td>{payment.nicOrPp}</td>
                          <td>{payment.paymentType}</td>
                          <td>Lkr {payment.amount}</td>
                      </tr>
                  ))}
              </tbody>
          </Table>
      </div>
  ));
  
  const AllPaymentsReport = React.forwardRef((props, ref) => (
    <div ref={ref} style={{ padding: '20px' }}>
        <div className="d-flex justify-content-between align-items-start mb-4" style={{ marginBottom: '30px' }}>
            <div className="text-right">
                {new Date().toLocaleDateString()}
            </div>
            <div className="text-center" style={{ flex: 1 }}>
                <h3 className="company-name" style={{ margin: 0, paddingBottom: '5px', fontWeight: 'bold', letterSpacing: '1px' }}>
                    GLOBAL LANGUAGE ACADEMY (PVT) LTD
                </h3>
                <p className="company-address" style={{ margin: 0, fontSize: '14px', color: '#555', paddingBottom: '10px' }}>
                    Jana Jaya City Complex, # 801, Level 8, Navala Road Rajagiriya
                </p>
            </div>
        </div>

        <h2 className="text-center mb-4" style={{ marginBottom: '20px' }}>Income Report</h2>

        {/* Grid layout for the financial boxes */}
        <div className="income-box-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px', 
            marginBottom: '30px' 
        }}>
            <div className="p-3 bg-info text-dark rounded">
                <h6>Today Normal Payments</h6>
                <h1>{dailyIncome.normalPayments.length}</h1>
            </div>
            <div className="p-3 bg-primary text-white rounded">
                <h6>Today Registrations</h6>
                <h1>{dailyIncome.registrationPayments.length}</h1>
            </div>
            <div className="p-3 bg-info text-dark rounded">
                <h6>Today Normal Income</h6>
                <h1>LKR {dailyIncome.normalPayments.reduce((sum, payment) => sum + payment.amount, 0)}</h1>
            </div>
            <div className="p-3 bg-primary text-white rounded">
                <h6>Today Registration Income</h6>
                <h1>LKR {dailyIncome.registrationPayments.reduce((sum, payment) => sum + payment.amount, 0)}</h1>
            </div>
            <div className="p-3 bg-info text-dark rounded">
                <h6>Weekly Normal Payment Income</h6>
                <h1>LKR {weeklyIncome.normalIncome}</h1>
            </div>
            <div className="p-3 bg-primary text-white rounded">
                <h6>Weekly Registration Payment Income</h6>
                <h1>LKR {weeklyIncome.registrationIncome}</h1>
            </div>
            <div className="p-3 bg-info text-dark rounded">
                <h6>Monthly Normal Income</h6>
                <h1>LKR {monthlyIncome.normalIncome}</h1>
            </div>
            <div className="p-3 bg-primary text-white rounded">
                <h6>Monthly Registration Income</h6>
                <h1>LKR {monthlyIncome.registrationIncome}</h1>
            </div>
            <div className="p-3 bg-danger text-white rounded">
                <h6>Today Total Income</h6>
                <h1>
                    LKR {dailyIncome.registrationPayments.reduce((sum, payment) => sum + payment.amount, 0) + 
                        dailyIncome.normalPayments.reduce((sum, payment) => sum + payment.amount, 0)}
                </h1>
            </div>
            <div className="p-3 bg-danger text-white rounded">
                <h6>Weekly Total Income</h6>
                <h1>LKR {weeklyIncome.registrationIncome + weeklyIncome.normalIncome}</h1>
            </div>
            <div className="p-3 bg-danger text-white rounded">
                <h6>Monthly Total Income</h6>
                <h1>LKR {monthlyIncome.registrationIncome + monthlyIncome.normalIncome}</h1>
            </div>
        </div>

        {/* Table for all payments */}
        <Table striped bordered hover>
            <thead>
                <tr className="p-3 bg-primary text-white rounded">
                    <th>Name</th>
                    <th>Mobile No</th>
                    <th>NIC/PP</th>
                    <th>Payment Type</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {[...dailyIncome.registrationPayments, ...dailyIncome.normalPayments].map((payment, index) => (
                    <tr key={index}>
                        <td>{payment.name}</td>
                        <td>{payment.mobile}</td>
                        <td>{payment.nicOrPp}</td>
                        <td>{payment.paymentType}</td>
                        <td>Lkr {payment.amount}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    </div>
));

    return (
        <Container className="my-5">
            {/* Back Button */}
            <a href="/" className="text-dark position-absolute" style={{ top: '10px', left: '10px' }}>
                <i className="bi bi-arrow-left-circle" style={{ fontSize: '2rem' }}></i>
            </a>
            <h2 className="text-center mb-4">REPORTS</h2>
            {/* Top Boxes Section */}
            <Row className="text-center">
                <Col md={3}>
                    <div className="p-3 bg-info text-dark rounded">
                        <h6>Today Normal Payments</h6>
                        <h1>{dailyIncome.normalPayments.length}</h1>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="p-3 bg-primary text-white rounded">
                        <h6>Today Registrations</h6>
                        <h1>{dailyIncome.registrationPayments.length}</h1>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="p-3 bg-info text-dark rounded">
                        <h6>Today Normal Income</h6>
                        <h1>LKR {dailyIncome.normalPayments.reduce((sum, payment) => sum + payment.amount, 0)}</h1>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="p-3 bg-primary text-white rounded">
                        <h6>Today Registration Income</h6>
                        <h1>LKR {dailyIncome.registrationPayments.reduce((sum, payment) => sum + payment.amount, 0)}</h1>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="p-3 bg-info text-dark rounded mt-3">
                        <h6>Weekly Normal Payment Income</h6>
                        <h1>LKR {weeklyIncome.normalIncome}</h1>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="p-3 bg-primary text-white rounded mt-3">
                        <h6>Weekly Registration Payment Income</h6>
                        <h1>LKR {weeklyIncome.registrationIncome}</h1>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="p-3 bg-info text-dark rounded mt-3">
                        <h6>Monthly Normal Income</h6>
                        <h1>LKR {monthlyIncome.normalIncome}</h1>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="p-3 bg-primary text-white rounded mt-3">
                        <h6>Monthly Registration Income</h6>
                        <h1>LKR {monthlyIncome.registrationIncome}</h1>
                    </div>
                </Col>
                <Col md={3}>
                  <div className="p-3 bg-danger text-white rounded mt-3">
                      <h6>Today Total Income</h6>
                      <h1>
                          LKR {dailyIncome.registrationPayments.reduce((sum, payment) => sum + payment.amount, 0) + 
                              dailyIncome.normalPayments.reduce((sum, payment) => sum + payment.amount, 0)}
                      </h1>
                  </div>
                </Col>
                <Col md={3}>
                    <div className="p-3 bg-danger text-white rounded mt-3">
                        <h6>Weekly Total Income</h6>
                        <h1>LKR {weeklyIncome.registrationIncome +  weeklyIncome.normalIncome}</h1>
                    </div>
                </Col>
                <Col md={3}>
                    <div className="p-3 bg-danger text-white rounded mt-3">
                        <h6>Monthly Total Income</h6>
                        <h1>LKR {monthlyIncome.registrationIncome +  monthlyIncome.normalIncome}</h1>
                    </div>
                </Col>
            </Row>
            {/* Legend Section */}
            <Row className="text-center mb-4 mt-4" style={{ backgroundColor: '#E9E9E9FF' , padding: '20px' , borderRadius: '10px'}}>
                <Col md={4}>
                    <div className="d-flex justify-content-center align-items-center">
                        <span className="rounded-circle bg-primary me-2" style={{ width: '20px', height: '20px', display: 'inline-block' }}></span>
                        <span><strong>Registration Info</strong></span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="d-flex justify-content-center align-items-center">
                        <span className="rounded-circle bg-info me-2" style={{ width: '20px', height: '20px', display: 'inline-block' }}></span>
                        <span><strong>Normal Payment Info</strong></span>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="d-flex justify-content-center align-items-center">
                        <span className="rounded-circle bg-danger me-2" style={{ width: '20px', height: '20px', display: 'inline-block' }}></span>
                        <span><strong>Total Income</strong></span>
                    </div>
                </Col>
            </Row>
            {/* NIC Section */}
            <Row className="my-4 align-items-center">
                <Col md={6} className="d-flex">
                    <Form.Control 
                        type="text" 
                        placeholder="Enter NIC No" 
                        className="me-2 border border-primary" 
                        value={nicInput}
                        onChange={(e) => setNicInput(e.target.value)}
                    />
                </Col>
                <Col md={{ span: 4, offset: 2 }} className="text-end">
                    <DatePicker
                        selected={todayDate}
                        onChange={(date) => setTodayDate(date)}
                        dateFormat="yyyy/MM/dd"
                        className="form-control border border-primary"
                    />
                </Col>
              </Row>
            {/* Print Report Button */}
            <Row md={{ span: 4, offset: 2 }} className="text-end">
              <Col>
                <Button variant="success" className='me-4' style={{padding: '10px'}} onClick={handlePrintNormalPayments}>
                    <i className="bi bi-printer-fill"></i> Print Normal Payments Report
                </Button>
                <Button variant="success" className='me-4' style={{padding: '10px'}} onClick={handlePrintRegistrationPayments}>
                    <i className="bi bi-printer-fill"></i> Print Registrations Income Report
                </Button>
                <Button variant="success" className='me-4' style={{padding: '10px'}} onClick={handlePrintAllPayments}>
                    <i className="bi bi-printer-fill"></i> Print Income Report
                </Button>
              </Col>
            </Row>
            {/* Error Message */}
            {error && (
                <Row>
                    <Col>
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    </Col>
                </Row>
            )}
            {/* Registrations Table */}
            <Row>
                <Col>
                    <h6 style={{padding:'15px' , borderRadius: '10px' , color: 'white'}} className='bg-primary mt-3'>Today Registration Payments</h6>
                    <Table striped bordered hover>
                        <thead>
                            <tr className="p-3 bg-primary text-white rounded">
                                <th></th>
                                <th>Name</th>
                                <th>Mobile No</th>
                                <th>NIC/PP</th>
                                <th>Registered/Paid</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDailyIncome.registrationPayments.map((payment, index) => (
                                <tr key={index}>
                                    <td><i className="bi bi-person-circle"></i></td>
                                    <td>{payment.name}</td>
                                    <td>{payment.mobile}</td>
                                    <td>{payment.nicOrPp}</td>
                                    <td>{payment.paymentType}</td>
                                    <td>Lkr {payment.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            {/* Normal Payments Table */}
            <Row>
                <Col>
                    <h6 style={{padding:'15px' , borderRadius: '10px' , color: 'white'}} className='bg-primary mt-3'>Today Normal Payments</h6>
                    <Table striped bordered hover>
                        <thead>
                            <tr className="p-3 bg-info text-white rounded">
                                <th></th>
                                <th>Name</th>
                                <th>Mobile No</th>
                                <th>NIC/PP</th>
                                <th>Registered/Paid</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDailyIncome.normalPayments.map((payment, index) => (
                                <tr key={index}>
                                    <td><i className="bi bi-person-circle"></i></td>
                                    <td>{payment.name}</td>
                                    <td>{payment.mobile}</td>
                                    <td>{payment.nicOrPp}</td>
                                    <td>{payment.paymentType}</td>
                                    <td>Lkr {payment.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Hidden components for printing */}
            <div style={{ display: 'none' }}>
                <NormalPaymentsReport ref={normalPaymentsRef} />
                <RegistrationPaymentsReport ref={registrationPaymentsRef} />
                <AllPaymentsReport ref={allPaymentsRef} />
            </div>
        </Container>
    );
};

export default IncomeReport;