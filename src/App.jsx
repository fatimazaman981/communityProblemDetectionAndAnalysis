import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'
import Login from './pages/Login'
import DashboardLayout from './pages/Dashboard'
import Overview from './pages/Overview'
import Complaints from './pages/Complaints'
import ComplaintDetail from './pages/ComplaintDetail'
import Analytics from './pages/Analytics'
import UrgentAlerts from './pages/Alerts'
import Sentiment from './pages/Sentiment'
import FakeDetection from './pages/FakeDetection'
import Users from './pages/Users'
import Reports from './pages/Reports'
import LaborManagement from './pages/LaborManagement'

function Placeholder({ title }) {
  const { colors: C } = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: 'Outfit' }}>{title}</h1>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="complaints/:id" element={<ComplaintDetail />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="alerts" element={<UrgentAlerts />} />
            <Route path="sentiment" element={<Sentiment />} />
            <Route path="fake-detection" element={<FakeDetection />} />
            <Route path="duplicates" element={<Placeholder title="Duplicate Detection" />} />
            <Route path="users" element={<Users />} />
            <Route path="reports" element={<Reports />} />
            <Route path="labor" element={<LaborManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
