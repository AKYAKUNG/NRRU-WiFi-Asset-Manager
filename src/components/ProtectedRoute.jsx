import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // 1. ถ้ายังไม่ได้ Login ให้เด้งไปหน้า /login ทันที
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. ถ้า Login แล้วแต่ Role ไม่ถึง ให้เด้งกลับหน้าหลัก หรือ Login
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้');
    return <Navigate to="/login" replace />;
  }

  // 3. ผ่านทุกเงื่อนไข ให้แสดงผลหน้าลูก (Manage.jsx)
  return <Outlet />;
}