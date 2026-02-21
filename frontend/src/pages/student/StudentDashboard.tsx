import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { LayoutDashboard, User, FileText, FlaskConical, Stethoscope } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student" },
  { label: "My Profile", icon: User, path: "/student/profile" },
  { label: "Prescriptions", icon: FileText, path: "/student/prescriptions" },
  { label: "Lab Reports", icon: FlaskConical, path: "/student/lab-reports" },
  { label: "Special Doctors", icon: Stethoscope, path: "/student/special-doctors" },
];

const StudentDashboard = () => (
  <DashboardLayout sidebarItems={sidebarItems} role="Student" roleBadgeClass="badge-student" userName="Rahul Kumar">
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Welcome back, Rahul!</h1>
        <p className="text-muted-foreground mt-1">Here's a quick overview of your nitt hospital activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Prescriptions" value={12} icon={FileText} trend="+2 this month" trendUp />
        <StatCard title="Pending Lab Tests" value={2} icon={FlaskConical} iconClassName="bg-warning/10 text-warning" />
        <StatCard title="Last Visit" value="Jan 15" icon={Stethoscope} iconClassName="bg-success/10 text-success" />
        <StatCard title="Reports Ready" value={3} icon={FileText} iconClassName="bg-primary/10 text-primary" trend="1 new" trendUp />
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h2 className="text-lg font-bold font-display text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { date: "Jan 15, 2026", desc: "Visited Dr. Sharma - General Checkup", status: "Completed" },
            { date: "Jan 10, 2026", desc: "Lab report uploaded - Blood Test", status: "Available" },
            { date: "Jan 5, 2026", desc: "Prescription by Dr. Patel", status: "Dispensed" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.desc}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-success/10 text-success">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default StudentDashboard;
