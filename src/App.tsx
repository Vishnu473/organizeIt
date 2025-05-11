import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Landing from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import AuthLayout from './Layouts/AuthLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/Signup'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './Context/AuthContext'
import TemplateManager from './pages/TemplateManager'

function App() {

  const { user } = useAuth();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000,
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
        }}
      />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={user ? <Navigate to="/dashboard" replace/> : <Login />} />
        <Route path='/signup' element={user ? <Navigate to="/dashboard" replace/> : <SignUp />} />
        <Route element=
          {
            <ProtectedRoute>
              <AuthLayout />
            </ProtectedRoute>
          }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/templates" element={<TemplateManager />} />
        <Route path="/templates/create" element={<TemplateManager />} />
        <Route path="/templates/edit" element={<TemplateManager />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
