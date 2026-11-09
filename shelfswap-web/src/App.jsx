import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RequireRole from './components/RequireRole';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import ListingForm from './pages/ListingForm';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import MyListings from './pages/dashboard/MyListings';
import MyReservations from './pages/dashboard/MyReservations';
import IncomingRequests from './pages/dashboard/IncomingRequests';
import Profile from './pages/dashboard/Profile';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    // AuthProvider ครอบทั้งแอป ทุกหน้าเรียก useAuth() ได้ / ToastProvider ให้ทุกหน้าเรียก useToast() ได้
    <AuthProvider>
      <ToastProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Guest เข้าได้ */}
              <Route path="/" element={<Home />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ต้อง login */}
              <Route path="/listings/new" element={<ProtectedRoute><ListingForm /></ProtectedRoute>} />
              <Route path="/listings/:id/edit" element={<ProtectedRoute><ListingForm /></ProtectedRoute>} />
              <Route path="/me" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<MyListings />} />
                <Route path="requests" element={<IncomingRequests />} />
                <Route path="reservations" element={<MyReservations />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* หลังบ้าน: ครอบทั้งกิ่งด้วย RequireRole ครั้งเดียว */}
              <Route path="/admin" element={<RequireRole role="admin"><AdminLayout /></RequireRole>}>
                <Route index element={<AdminDashboard />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
