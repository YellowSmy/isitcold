import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Compare from './pages/Compare'

import './styles/App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/test' element={<Compare/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
