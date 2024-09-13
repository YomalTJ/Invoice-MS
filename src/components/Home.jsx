import React from 'react';
import { Link } from 'react-router-dom';
import bg from '../assests/na_feb_37.jpg';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap's JS
function Home() {
  return (
    <div
      className='bg-image'
      style={{
        backgroundImage: `url(${bg})`,
        height: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='d-flex justify-content-center align-items-center' style={{ height: '20vh' }}>
        <div className='fs-1'>HOME</div>
      </div>
      <div className="container d-flex justify-content-center align-items-center h-75">
        <div className="row w-100 h-100">
          <div className="col-md-4 col-8 p-2">
            <Link to="/register">
              <button type="button" className="btn btn-primary w-100 fs-5 p-3">Application Registration</button>
            </Link>
          </div>
          <div className="col-md-4 col-8 p-2">
            <Link to="/payments">
              <button type="button" className="btn btn-primary w-100 fs-5 p-3">Payments</button>
            </Link>
          </div>
          <div className="col-md-4 col-8 p-2">
            <Link to="/income_report">
              <button type="button" className="btn btn-primary w-100 fs-5 p-3">Reports</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;