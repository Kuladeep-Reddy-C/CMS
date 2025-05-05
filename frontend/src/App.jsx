import { Route, Routes } from 'react-router-dom';
import React from 'react';


import Auth  from './pages/auth/Auth'
import Navbar from './pages/navbar/Navbar';
import Home from './pages/home/Home';
import Group from './pages/Group/Group';
import GroupExpenseManager from './pages/Group/GroupExpenseManager';
import ProtectedRoute from './pages/protect-route/ProjectedRoute';
import Members from './pages/members/Members';
import PersonalDetailsForm from './pages/members/PersonalDetailsForm';
import UpdatePersonalDetailsForm from './pages/members/UpdatePersonalDetailsForm';
import Calender from './pages/Calender/Calender';
import About from './pages/about/About';

function App() {
  return (
    <>
    {/* <div>{isSignedIn?user.firstName:<div>User</div>}</div> */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Auth />} /> 
        <Route path="/home" element={<Home />} />
        <Route path='/group' element={<ProtectedRoute><Group /></ProtectedRoute>} />  
        <Route path='/group-form' element={<ProtectedRoute><GroupExpenseManager /></ProtectedRoute>} />
        <Route path='/calendar' element={<ProtectedRoute><Calender /></ProtectedRoute>} />
        <Route path='/members' element={<ProtectedRoute><Members /></ProtectedRoute>} />
        <Route path='/members/create-profile' element={<ProtectedRoute><PersonalDetailsForm /></ProtectedRoute>} />
        <Route path='/members/update-profile' element={<ProtectedRoute><UpdatePersonalDetailsForm /></ProtectedRoute>} />
        <Route path='/about' element={<About />} />
      </Routes>
    </>
  )
}

export default App
