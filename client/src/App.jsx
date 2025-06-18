import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  return (
      <Router>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/login' element={<Login/>}/>
          </Routes>
           <ToastContainer position="top-right" autoClose={3000} />
      </Router>
  )
}

export default App;
