import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { LayoutDashboard, Package, Upload, FileText, History, Pill, AlertTriangle } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/pharmacy" },
  { label: "Stock", icon: Package, path: "/pharmacy/stock" },
  { label: "Upload Stock", icon: Upload, path: "/pharmacy/upload-stock" },
  { label: "Active Rx", icon: FileText, path: "/pharmacy/active-prescriptions" },
  { label: "Dispensed History", icon: History, path: "/pharmacy/dispensed-history" },
];

const PharmacyDashboard = () => (
  <DashboardLayout sidebarItems={sidebarItems} role="Pharmacy" roleBadgeClass="badge-pharmacy" userName="Anil Mehta">
    <div className="space-y-6">
      <h1 className="page-header">Pharmacy Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Medicines" value={48} icon={Pill} />
        <StatCard title="Low Stock" value={3} icon={AlertTriangle} iconClassName="bg-destructive/10 text-destructive" />
        <StatCard title="Active Prescriptions" value={12} icon={FileText} iconClassName="bg-warning/10 text-warning" />
        <StatCard title="Dispensed Today" value={18} icon={History} iconClassName="bg-success/10 text-success" trend="+5 from yesterday" trendUp />
      </div>
    </div>
  </DashboardLayout>
);

export default PharmacyDashboard;
