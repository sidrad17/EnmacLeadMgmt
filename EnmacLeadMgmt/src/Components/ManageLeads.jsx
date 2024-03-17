import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageLeads = () => {
    const [leads, setLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3000/auth/leads')
            .then(result => {
                if (result.data.Status) {
                    setLeads(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3000/auth/deleteLead/${id}`)
            .then(result => {
                if (result.data.Status) {
                    window.location.reload();
                } else {
                    alert(result.data.Error);
                }
            });
    };

    const filteredLeads = leads.filter(lead =>
        lead.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.employee_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Manage Lead</h3>
            </div>
            <Link to="/dashboard/CreateLead">Create Lead</Link>
            <div className="mt-3">
                <input
                    type="text"
                    placeholder="Search by Project Name or Sales Person Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control mb-3"
                />
                {filteredLeads.length === 0 ? (
                <p>{searchTerm ? "There are no leads to display matching the query." : "There are no leads in the system."}</p>
                ) : (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Sales Person Name</th>
                            <th>Priority</th>
                            <th>Customer Name</th> 
                            <th>Expected Closure Date</th>
                            <th>Lead Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.map(lead => (
                            <tr key={lead.id}>
                                <td>{lead.project_name}</td>
                                <td>{lead.employee_name}</td>
                                <td>{lead.priority}</td>
                                <td>{lead.customer_name}</td>
                                <td>{lead.expected_closure_date ? new Date(lead.expected_closure_date).toISOString().split('T')[0] : ''}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>{lead.total_amount ? lead.total_amount : 'Lead items not entered yet.'}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>
                                    <Link to={`/dashboard/EditLead/${lead.id}`} className="btn btn-info btn-sm me-2">Edit</Link>
                                    <Link to={`/dashboard/LeadItems/${lead.id}`} className="btn btn-info btn-sm me-2">Add / Edit Items</Link>
                                    <button className="btn btn-warning btn-sm" onClick={() => handleDelete(lead.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    );
};

export default ManageLeads;
