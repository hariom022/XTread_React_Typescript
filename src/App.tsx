import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './layouts/header/Header'
import Navbar from './layouts/navbar/Navbar'
import Dashboard from './features/dashboard/pages/Dashboard'
import CollectionPage from './features/collection/page/CollectionPage'
import CustomerApprovalPage from './features/customerApproval/page/CustomerApprovalPage'

const App=() =>{
 

  return (
    <BrowserRouter>
      <Header />
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />}/>
          <Route path="/collection" element={<CollectionPage />}/>
           <Route path="/customerApproval" element={<CustomerApprovalPage />}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
