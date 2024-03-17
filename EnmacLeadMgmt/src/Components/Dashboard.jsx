import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate()
  axios.defaults.withCredentials = true
  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem("valid")
          navigate('/')
        }
      })
  }
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Sidebar */}
      <div style={{ width: '25%', background: '#333', color: 'white', padding: '20px' }}>
        <Link
          to="/dashboard"
          className="d-flex text-whit align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-decoration-none">
          <span className="fs-5 text-white fw-bolder d-none d-sm-inline">
            Lead Management
          </span>
        </Link>
        <ul id="menu" className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start text-white">
          <li className="w-100">
            <Link
              to="/dashboard">
              <i className="fs-4 bi-speedometer2 ms-2 text-white"></i>
              <span className="ms-2 d-none text-white d-sm-inline">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/ManageLeads">
              <i className="fs-4 bi-columns ms-2 text-white"></i>
              <span className="ms-2  text-white d-none d-sm-inline">Manage Lead</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/CreateLead">
              <i className="fs-4 bi-people ms-2 text-white"></i>
              <span className="ms-2 text-white  d-none d-sm-inline">
                Create Lead
              </span>
            </Link>
          </li>
          <li className="w-100" onClick={handleLogout}>
            <Link>
              <i className="fs-4 bi-power ms-2 text-white"></i>
              <span className="ms-2  text-white d-none d-sm-inline">Logout</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        {/* Page Title */}
        <div style={{ marginBottom: '20px' }}>
          <h2>Lead Management System</h2>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;