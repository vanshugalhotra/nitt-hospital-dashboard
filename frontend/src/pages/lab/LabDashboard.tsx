import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { LayoutDashboard, Clock, CheckCircle, Upload, FlaskConical, AlertCircle } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/lab" },
  { label: "Pending Tests", icon: Clock, path: "/lab/pending-tests" },
  { label: "Completed Tests", icon: CheckCircle, path: "/lab/completed-tests" },
  { label: "Upload Report", icon: Upload, path: "/lab/upload-report" },
];

const LabDashboard = () => (
  <DashboardLayout sidebarItems={sidebarItems} role="Lab" roleBadgeClass="badge-lab" userName="Suresh Reddy">
    <div className="space-y-6">
      <h1 className="page-header">Lab Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Tests" value={12} icon={Clock} iconClassName="bg-warning/10 text-warning" />
        <StatCard title="Completed Today" value={8} icon={CheckCircle} iconClassName="bg-success/10 text-success" />
        <StatCard title="Total This Month" value={87} icon={FlaskConical} />
        <StatCard title="Urgent" value={2} icon={AlertCircle} iconClassName="bg-destructive/10 text-destructive" />
      </div>
    </div>
  </DashboardLayout>
);

export default LabDashboard;
