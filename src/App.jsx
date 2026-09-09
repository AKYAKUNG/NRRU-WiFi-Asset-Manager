import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login';
import Manage from './pages/manage'; // 1. Import Component Manage ให้ถูกต้อง
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    // 2. ใช้ <Routes> เพียงตัวเดียวครอบทุก Route
    <Routes>
      {/* หน้าทั่วไป */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* หน้าที่ต้องผ่านการตรวจสอบสิทธิ์ก่อนเข้าถึง */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={['Officer', 'Super Admin', 'Admin', 'Network Engineer']}
          />
        }
      >
        <Route path="/manage" element={<Manage />} />
      </Route>
    </Routes> // 3. ปิด Tag </Routes> ให้เรียบร้อย
  );
}

export default App;