import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { LayoutDashboard, Users, Pill, FlaskConical, Stethoscope, FileText, Database } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Manage Doctors", icon: Stethoscope, path: "/admin/doctors" },
  { label: "Pharmacy Staff", icon: Pill, path: "/admin/pharmacy-staff" },
  { label: "Lab Staff", icon: FlaskConical, path: "/admin/lab-staff" },
  { label: "Master Data", icon: Database, path: "/admin/master-data" },
];

const AdminDashboard = () => (
  <DashboardLayout sidebarItems={sidebarItems}>
    <div className="space-y-6">
      <h1 className="page-header">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Students" value={1248} icon={Users} />
        <StatCard title="Total Doctors" value={8} icon={Stethoscope} iconClassName="bg-success/10 text-success" />
        <StatCard title="Pharmacy Staff" value={5} icon={Pill} iconClassName="bg-warning/10 text-warning" />
        <StatCard title="Lab Staff" value={4} icon={FlaskConical} iconClassName="bg-destructive/10 text-destructive" />
        <StatCard title="Today's Rx" value={23} icon={FileText} iconClassName="bg-primary/10 text-primary" trend="+5 from yesterday" trendUp />
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h2 className="text-lg font-bold font-display text-foreground mb-4">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Most Active Doctor", value: "Dr. Sharma", sub: "45 prescriptions this month" },
            { title: "Low Stock Alerts", value: "3 medicines", sub: "Paracetamol, Cetirizine, Bandages" },
            { title: "Pending Lab Reports", value: "12 reports", sub: "Expected by end of day" },
          ].map((item) => (
            <div key={item.title} className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground font-medium uppercase">{item.title}</p>
              <p className="text-lg font-bold text-foreground mt-1">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default AdminDashboard;
