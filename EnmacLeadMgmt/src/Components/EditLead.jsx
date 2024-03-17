import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Select from 'react-select'





const EditLead = () => {
    const { id } = useParams()

    const [users, setUsers] = useState([])

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

        axios.get('http://localhost:3000/auth/lead/' + id)
            .then(result => {
                if (result.data.Status) {
                    setLead({
                        ...lead,
                        projectName: result.data.Result[0].project_name,
                        salesPersonId: result.data.Result[0].sales_person_id,
                        priority: result.data.Result[0].priority,
                        customerName:result.data.Result[0].customer_name,
                        expectedClosureDate:result.data.Result[0].expected_closure_date,
                        deliveryDate: result.data.Result[0].delivery_date,
                        stage:result.data.Result[0].stage,
                        source:result.data.Result[0].source
                    })
                } else {
                    alert(result.data.Error)
                }
            }).catch(err => console.log(err))
    }, [])

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.put('http://localhost:3000/auth/editLead/' + id, lead)
            .then(result => {
                if (result.data.Status) {
                    navigate('/dashboard/ManageLeads')
                } else {
                    alert(result.data.Error)
                }
            }).catch(err => console.log(err))
    }

    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState([]);

    // Function to fetch options based on user input
    const loadOptions = (inputValue) => {
        // Make an API call to fetch options based on inputValue
        // For demonstration, returning static options
        const fetchedOptions = [
            { value: 1, label: 'Item 1' },
            { value: 2, label: 'Item 2' },
            { value: 3, label: 'Item 3' },
            // Additional options...
        ];

        const filteredOptions = fetchedOptions.filter(option =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
        setOptions(filteredOptions);
    };


    return (
        <div>
            <div>
            <div className='d-flex justify-content-center'>
                <h3>Edit Lead</h3>
                </div>

                <form className='row g-3' onSubmit={handleSubmit} >
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
                                        value={lead.projectName}
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
                                        value={lead.salesPersonId}
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
                                        value={lead.customerName}
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
                                        value={lead.expectedClosureDate ? new Date(lead.expectedClosureDate).toISOString().split('T')[0] : ''}
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
                                        value={lead.deliveryDate ? new Date(lead.deliveryDate).toISOString().split('T')[0] : ''}
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
                                        value={lead.source}
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
                                    <button className='btn btn-success w-20 rounded-0 mb-2'>Edit Lead</button>
                                </div>
                            </td>
                        </tr></tbody>
                    </table>
                </form>
            </div>
        </div>




    )
}

export default EditLead