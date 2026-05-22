import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Verify from './pages/Verify'
import Success from './pages/Success'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  )
}
