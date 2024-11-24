import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CatalogPage from './pages/CatalogPage';
import MyBorrowingsPage from './pages/MyBorrowingsPage';
import MyReservationsPage from './pages/MyReservationsPage';
import TransferPage from './pages/TransferPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/catalog" 
            element={
              <PrivateRoute>
                <CatalogPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/my-borrowings" 
            element={
              <PrivateRoute>
                <MyBorrowingsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/my-reservations" 
            element={
              <PrivateRoute>
                <MyReservationsPage />
              </PrivateRoute>
            } 
          />
           <Route 
            path="/transfer" 
            element={
              <PrivateRoute>
                <TransferPage />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 