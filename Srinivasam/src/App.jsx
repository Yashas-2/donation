import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedLayout, PublicOnlyLayout, AdminLayout, OrphanageLayout, VolunteerLayout } from './components/layout/ProtectedLayout';
import { AdminLogin } from './pages/AdminLogin';
import { ForgotPassword } from './pages/ForgotPassword';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { ExploreCauses } from './pages/ExploreCauses';
import { CauseDetail } from './pages/CauseDetail';
import { MyDonations } from './pages/MyDonations';
import { RecurringDonations } from './pages/RecurringDonations';
import { MyOccasions } from './pages/MyOccasions';
import { ProfilePage } from './pages/ProfilePage';
import { HowItWorks } from './pages/HowItWorks';
import { OrphanageRegister } from './pages/OrphanageRegister';
import { OrphanageDashboard } from './pages/OrphanageDashboard';
import { Volunteer } from './pages/Volunteer';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/causes" element={<ExploreCauses />} />
              <Route path="/causes/:id" element={<CauseDetail />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/orphanage/register" element={<OrphanageRegister />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Public Only Auth Routes (Redirect to /dashboard if logged in) */}
              <Route element={<PublicOnlyLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>

              {/* Orphanage Routes */}
              <Route element={<OrphanageLayout />}>
                <Route path="/orphanage/dashboard" element={<OrphanageDashboard />} />
              </Route>

              {/* Volunteer Routes */}
              <Route element={<VolunteerLayout />}>
                <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
              </Route>

              {/* Protected Donor Routes */}
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/donations" element={<MyDonations />} />
                <Route path="/donations/recurring" element={<RecurringDonations />} />
                <Route path="/occasions" element={<MyOccasions />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;




