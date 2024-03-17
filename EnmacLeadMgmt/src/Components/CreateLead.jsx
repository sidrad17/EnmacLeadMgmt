import React, { useEffect, useState } from 'react'
import axios from "axios";
import './style.css'
import { useNavigate } from 'react-router-dom';


const CreateLead = () => {

    const [users, setUsers] = useState([])
    const [priority, setPriority] = useState(["Cold", "Warm", "Hot"]);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/users')
            .then(result => {
                console.log(result.data)
                if (result.data.Status) {
                    setUsers(result.data.Result)
                } else {
                    alert(result.data.Error)
                }
            }).catch(err => console.log(err))
    }, [])

    const [lead, setLead] = useState({
        projectName: '',
        salesPersonId: '2',
        priority: '',
        customerName: '',
        expectedClosureDate: '',
        deliveryDate:'',
        stage:'',
        source:''
    }
    )

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3000/auth/createLead', lead)
            .then(result => {
                if (result.data.Status) {
                    navigate('/dashboard/ManageLeads')
                } else {
                    alert(result.data.Error)
                }
            }).catch(err => console.log(err))
    }

    return (
        <div>
            <div>
                <div className='d-flex justify-content-center'>
                    <h3>Create Lead</h3>
                </div>

                <form onSubmit={handleSubmit} className='row g-3'>
                    {/* Project Name row */}
                    <table cellPadding={2} ><tbody>
                        <tr>
                            <td width="20%" align='right' nowrap="true">
                                <div className='text-black'>
                                    <label htmlFor="projectName" className="form-label"><strong>Project Name</strong></label>
                                </div>
                            </td>
                            <td width="30%" align="left">
                                <div >
                                    <input
                                        type="text"
                                        name='projectName'
                                        autoComplete='off'
                                        placeholder="Project Name"
                                        onChange={(e) => setLead({ ...lead, projectName: e.target.value })}
                                        className='form-control rounded-0 w-1'
                                        style={{ width: '20ch' }}
                                    />
                                </div>
                            </td>
                            <td width="20%" align='right' nowrap="true">
                                {/* Sales Person row */}
                                <div className='text-black'>
                                    <label htmlFor="salesPersonName" className="form-label"><strong>Sales Person Name</strong></label>
                                </div>
                            </td>
                            <td width="30%">
                                <div >
                                    <select
                                        name="salesPersonName"
                                        id="salesPersonName"
                                        style={{ width: '20ch' }}
                                        className='form-select rounded-0'
                                        onChange={(e) => setLead({ ...lead, salesPersonId: e.target.value })}
                                    >
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>{user.employee_name}</option>
                                        ))}
                                    </select>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td width="20%" align='right' nowrap="true">
                                {/* Priority row */}
                                <div className='text-black'>
                                    <label htmlFor="priority" className="form-label"><strong>Priority</strong></label>
                                </div>
                            </td>
                            <td width="30%">
                                <div className='col-md-6'>
                                    <select
                                        name='priority'
                                        value={lead.priority}
                                        onChange={(e) => setLead({ ...lead, priority: e.target.value })}
                                        className='form-control rounded-0 w-1'
                                        style={{ width: '20ch' }}
                                    >
                                        <option value=''>Select Priority</option>
                                        <option value='Cold'>Cold</option>
                                        <option value='Warm'>Warm</option>
                                        <option value='Hot'>Hot</option>
                                    </select>
                                </div>
                            </td>
                            <td width="20%" align='right' nowrap="true">
                                <div className='text-black'>
                                    <label htmlFor="customerName" className="form-label"><strong>Customer Name</strong></label>
                                </div>
                            </td>
                            <td width="30%" align="left">
                                <div >
                                    <input
                                        type="text"
                                        name='customerName'
                                        autoComplete='off'
                                        placeholder="Customer Name"
                                        onChange={(e) => setLead({ ...lead, customerName: e.target.value })}
                                        className='form-control rounded-0 w-1'
                                        style={{ width: '20ch' }}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td width="20%" align='right' nowrap="true">
                                {/* Priority row */}
                                <div className='text-black'>
                                    <label htmlFor="expectedClosureDate" className="form-label"><strong>Expected Closure Date</strong></label>
                                </div>
                            </td>
                            <td width="30%">
                                <div className='col-md-6'>
                                    <input
                                        type="date"
                                        name="expectedClosureDate"
                                        placeholder="Expected Closure Date"
                                        onChange={(e) => setLead({ ...lead, expectedClosureDate: e.target.value })}
                                        className="form-control rounded-0 w-1"
                                        style={{ width: '20ch' }}
                                    />

                                </div>
                            </td>
                            <td width="20%" align='right' nowrap="true">
                                <div className='text-black'>
                                    <label htmlFor="deliveryDate" className="form-label"><strong>Delivery Date</strong></label>
                                </div>
                            </td>
                            <td width="30%" align="left">
                                <div >
                                <input
                                        type="date"
                                        name="deliveryDate"
                                        placeholder="Delivery Date"
                                        onChange={(e) => setLead({ ...lead, deliveryDate: e.target.value })}
                                        className="form-control rounded-0 w-1"
                                        style={{ width: '20ch' }}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td width="20%" align='right' nowrap="true">
                                {/* Priority row */}
                                <div className='text-black'>
                                    <label htmlFor="stage" className="form-label"><strong>Stage</strong></label>
                                </div>
                            </td>
                            <td width="30%">
                                <div className='col-md-6'>
                                    <select
                                        name='stage'
                                        value={lead.stage}
                                        onChange={(e) => setLead({ ...lead, stage: e.target.value })}
                                        className='form-control rounded-0 w-1'
                                        style={{ width: '20ch' }}
                                    >
                                        <option value=''>Select Stage</option>
                                        <option value='25'>25</option>
                                        <option value='50'>50</option>
                                        <option value='75'>75</option>
                                        <option value='100'>100</option>
                                    </select>
                                </div>
                            </td>
                            <td width="20%" align='right' nowrap="true">
                                <div className='text-black'>
                                    <label htmlFor="source" className="form-label"><strong>Source</strong></label>
                                </div>
                            </td>
                            <td width="30%" align="left">
                                <div >
                                    <input
                                        type="text"
                                        name='source'
                                        autoComplete='off'
                                        placeholder="Source"
                                        onChange={(e) => setLead({ ...lead, source: e.target.value })}
                                        className='form-control rounded-0 w-1'
                                        style={{ width: '20ch' }}
                                    />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4} align='center'>
                                <div >
                                    <button className='btn btn-success w-20 rounded-0 mb-2'>Create Lead</button>
                                </div>
                            </td>
                        </tr></tbody>
                    </table>
                </form>
            </div>
        </div>




    )
}

export default CreateLead