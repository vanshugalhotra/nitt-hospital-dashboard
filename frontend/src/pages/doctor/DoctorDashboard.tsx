import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { LayoutDashboard, User, Search, FilePlus, FileText, Stethoscope, Users, Clock } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/doctor" },
  { label: "My Profile", icon: User, path: "/doctor/profile" },
  { label: "Search Patient", icon: Search, path: "/doctor/search-patient" },
  { label: "New Prescription", icon: FilePlus, path: "/doctor/new-prescription" },
  { label: "Past Prescriptions", icon: FileText, path: "/doctor/past-prescriptions" },
];

const DoctorDashboard = () => (
  <DashboardLayout sidebarItems={sidebarItems} role="Doctor" roleBadgeClass="badge-doctor" userName="Dr. Sharma">
    <div className="space-y-6">
      <h1 className="page-header">Doctor Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Patients" value={8} icon={Users} />
        <StatCard title="Total Prescriptions" value={156} icon={FileText} iconClassName="bg-success/10 text-success" />
        <StatCard title="Pending Follow-ups" value={3} icon={Clock} iconClassName="bg-warning/10 text-warning" />
        <StatCard title="This Month" value={42} icon={Stethoscope} iconClassName="bg-primary/10 text-primary" trend="+12%" trendUp />
      </div>
    </div>
  </DashboardLayout>
);

export default DoctorDashboard;
