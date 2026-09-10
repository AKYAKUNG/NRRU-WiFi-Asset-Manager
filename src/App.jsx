// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login';
import Manage from './pages/manage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* หน้าทั่วไป (Public Routes) */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* หน้าเฉพาะผู้ดูแลระบบ (Protected Routes) */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={['Officer', 'Super Admin', 'Admin', 'Network Engineer']}
          />
        }
      >
        <Route path="/manage" element={<Manage />} />
      </Route>

      {/* เส้นทางที่ไม่พบ (Fallback / Redirection) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;