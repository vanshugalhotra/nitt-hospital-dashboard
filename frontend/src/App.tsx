import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/protectedRoutes";

// Student
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentPrescriptions from "./pages/student/StudentPrescriptions";
import StudentLabReports from "./pages/student/StudentLabReports";
import SpecialDoctors from "./pages/student/SpecialDoctors";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDoctors from "./pages/admin/ManageDoctors";
import ManagePharmacyStaff from "./pages/admin/ManagePharmacyStaff";
import ManageLabStaff from "./pages/admin/ManageLabStaff";
import MasterData from "./pages/admin/MasterData";

// Doctor
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import SearchPatient from "./pages/doctor/SearchPatient";
import NewPrescription from "./pages/doctor/NewPrescription";
import PastPrescriptions from "./pages/doctor/PastPrescriptions";

// Pharmacy
import PharmacyDashboard from "./pages/pharmacy/PharmacyDashboard";
import PharmacyStock from "./pages/pharmacy/PharmacyStock";
import UploadStock from "./pages/pharmacy/UploadStock";
import ActivePrescriptions from "./pages/pharmacy/ActivePrescriptions";
import DispensedHistory from "./pages/pharmacy/DispensedHistory";

// Lab
import LabDashboard from "./pages/lab/LabDashboard";
import PendingTests from "./pages/lab/PendingTests";
import CompletedTests from "./pages/lab/CompletedTests";
import UploadReport from "./pages/lab/UploadReport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/prescriptions" element={<StudentPrescriptions />} />
          <Route path="/student/lab-reports" element={<StudentLabReports />} />
          <Route path="/student/special-doctors" element={<SpecialDoctors />} />

          {/* Admin */}
          <Route path="/admin" element={
           <AdminDashboard />
          } />
          <Route path="/admin/doctors" element={
           <ManageDoctors />
          } />
          <Route path="/admin/pharmacy-staff" element={
          <ManagePharmacyStaff />
          } />
          <Route path="/admin/lab-staff" element={
            <ManageLabStaff />
          } />
          <Route path="/admin/master-data" element={
            <MasterData />
          } />

          {/* Doctor */}
          <Route path="/doctor" element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor/profile" element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorProfile />
            </ProtectedRoute>
          } />
          <Route path="/doctor/search-patient" element={
            <ProtectedRoute allowedRole="doctor">
              <SearchPatient />
            </ProtectedRoute>
          } />
          <Route path="/doctor/new-prescription" element={
            <ProtectedRoute allowedRole="doctor">
              <NewPrescription />
            </ProtectedRoute>
          } />
          <Route path="/doctor/past-prescriptions" element={
            <ProtectedRoute allowedRole="doctor">
              <PastPrescriptions />
            </ProtectedRoute>
          } />

          {/* Pharmacy */}
          <Route path="/pharmacy" element={
            <ProtectedRoute allowedRole="pharmacy">
              <PharmacyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/pharmacy/stock" element={
            <ProtectedRoute allowedRole="pharmacy">
              <PharmacyStock />
            </ProtectedRoute>
          } />
          <Route path="/pharmacy/upload-stock" element={
            <ProtectedRoute allowedRole="pharmacy">
              <UploadStock />
            </ProtectedRoute>
          } />
          <Route path="/pharmacy/active-prescriptions" element={
            <ProtectedRoute allowedRole="pharmacy">
              <ActivePrescriptions />
            </ProtectedRoute>
          } />
          <Route path="/pharmacy/dispensed-history" element={
            <ProtectedRoute allowedRole="pharmacy">
              <DispensedHistory />
            </ProtectedRoute>
          } />

          {/* Lab */}
          <Route path="/lab" element={
            <ProtectedRoute allowedRole="lab">
              <LabDashboard />
            </ProtectedRoute>
          } />
          <Route path="/lab/pending-tests" element={
            <ProtectedRoute allowedRole="lab">
              <PendingTests />
            </ProtectedRoute>
          } />
          <Route path="/lab/completed-tests" element={
            <ProtectedRoute allowedRole="lab">
              <CompletedTests />
            </ProtectedRoute>
          } />
          <Route path="/lab/upload-report" element={
            <ProtectedRoute allowedRole="lab">
              <UploadReport />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
