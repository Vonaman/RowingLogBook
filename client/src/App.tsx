import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getToken } from './services/authService'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import StaffPage from './pages/StaffPage'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return getToken() ? <>{children}</> : <Navigate to="/login" replace />
}

function StaffRoute({ children }: { children: React.ReactNode }) {
  const token = getToken()
  if (!token) {
    return <Navigate to="/login" replace />
  }

  const rawUser = localStorage.getItem('user')
  const role = rawUser ? (JSON.parse(rawUser) as { role?: string }).role : undefined

  return role === 'STAFF' ? <>{children}</> : <Navigate to="/admin/dashboard" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <StaffRoute>
              <StaffPage />
            </StaffRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
