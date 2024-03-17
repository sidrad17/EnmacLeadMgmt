import React, { useState } from 'react'
import './style.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [values, setValues] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()
    axios.defaults.withCredentials = true
    const [error, setError] = useState()

    const handleSubmit = (event) => {
        event.preventDefault()
        axios.post('http://localhost:3000/auth/adminlogin', values)
        .then(result => {
            if (result.data.loginStatus){
                navigate('/dashboard')
            } else{
                setError(result.data.Error)
            }
        } )
        .catch(err => console.log(err))
    }
    // const [error, setError] = useState(null)
    // const navigate = useNavigate()
    // axios.defaults.withCredentials = true;
    // const handleSubmit = (event) => {
    //     event.preventDefault()
    //     axios.post('http://localhost:3000/auth/adminlogin', values)
    //     .then(result => {
    //         if(result.data.loginStatus) {
    //             localStorage.setItem("valid", true)
    //             navigate('/dashboard')
    //         } else {
    //             setError(result.data.Error)
    //         }
    //     })
    //     .catch(err => console.log(err))
    // }
    return (
        <div className='login-container'>
          <div className='login-wrapper'>
            <div className='text-warning'>
              {error && error}
            </div>
            <h2 className="text-center">Login Page</h2>
            <form onSubmit={handleSubmit} className='row g-3 '>
              <div className='col-md-6 d-flex align-items-center justify-content-end'>
                <label htmlFor="email" className="form-label"><strong>Email</strong></label>
              </div>
              <div className='col-md-6'>
                <input type="email" name='email' autoComplete='off' placeholder='Enter Email' 
                  onChange={(e) => setValues({ ...values, email: e.target.value })} className='form-control rounded-0 w-1'   style={{ width: '20ch' }}/>
              </div>
              <div className='col-md-6 d-flex align-items-center justify-content-end'>
                <label htmlFor="password" className="form-label"><strong>Password</strong></label>
              </div>
              <div className='col-md-6'>
                <input type="password" name='password' placeholder='Enter Password'
                  onChange={(e) => setValues({ ...values, password: e.target.value })} className='form-control rounded-0'    style={{ width: '20ch' }}/>
              </div>
              <div className='col-12 text-center'>
                <button className='btn btn-success rounded-0'>Log in</button>
              </div>
            </form>
          </div>
        </div>
      )
      
      
      
      
     
}

export default Login