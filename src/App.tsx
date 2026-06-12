import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './layouts/header/Header'
import Navbar from './layouts/navbar/Navbar'
import Dashboard from './features/dashboard/pages/Dashboard'
import CollectionPage from './features/collection/page/CollectionPage'
import CustomerApprovalPage from './features/customerApproval/page/CustomerApprovalPage'
import ReceivingPage from './features/receiving/page/ReceivingPage'
import VisualInspectionPage from './features/visualInspection/page/VisualInspectionPage'
import NailInspectionPage from './features/nailInspection/page/NailInspectionPage'
import ShearographyPage from './features/shearography/page/ShearographyPage'
import { CementingPage } from './features/cementing/page/CementingPage'

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
           <Route path='/receiving' element={<ReceivingPage/>}/>
           <Route path='/visualinspection' element={<VisualInspectionPage/>}/>
           <Route path='/nailInspection' element={<NailInspectionPage/>}/>
           <Route path='/shearography' element={<ShearographyPage/>}/>
           <Route path='/cementing' element={<CementingPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
