import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './context/AuthContext'

function ModalSwitch(){
  const location = useLocation()
  // `background` is the location we were at when a modal link was clicked
  const background = location.state && location.state.background

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<Landing/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        {/* keep login/signup so direct visits still work */}
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
      </Routes>

      {/* Show modals when a background location is set */}
      {background && (
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      )}
    </>
  )
}

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <ModalSwitch />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
