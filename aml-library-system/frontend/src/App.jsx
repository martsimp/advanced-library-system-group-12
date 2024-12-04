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
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
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