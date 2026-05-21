import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './layouts/header/Header'
import Navbar from './layouts/navbar/Navbar'
import Dashboard from './features/dashboard/pages/Dashboard'

const App=() =>{
 

  return (
    <BrowserRouter>
      <Header />
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
