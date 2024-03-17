import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './Components/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import Home from './Components/Home'
import CreateLead from './Components/CreateLead'
import EditLead from './Components/EditLead'
import LeadItems from './Components/LeadItems'
import ManageLeads from './Components/ManageLeads'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/adminlogin' element={<Login/>}></Route>
      <Route path='/dashboard' element={<Dashboard/>}>
        <Route path='' element={<Home/>}></Route>
        <Route path='CreateLead' element={<CreateLead/>}></Route>
        <Route path='ManageLeads' element={<ManageLeads/>}></Route>
        <Route path='EditLead/:id' element={<EditLead />}></Route>
        <Route path='LeadItems/:id' element={<LeadItems />}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
