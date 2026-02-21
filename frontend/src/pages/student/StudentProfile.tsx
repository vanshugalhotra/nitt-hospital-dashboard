import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, User, FileText, FlaskConical, Stethoscope, Mail, CheckCircle2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student" },
  { label: "My Profile", icon: User, path: "/student/profile" },
  { label: "Prescriptions", icon: FileText, path: "/student/prescriptions" },
  { label: "Lab Reports", icon: FlaskConical, path: "/student/lab-reports" },
  { label: "Special Doctors", icon: Stethoscope, path: "/student/special-doctors" },
];

const StudentProfile = () => (
  <DashboardLayout sidebarItems={sidebarItems} role="Student" roleBadgeClass="badge-student" userName="Rahul Kumar">
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="page-header">My Profile</h1>

      <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">RK</span>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold font-display text-foreground">Rahul Kumar</h2>
            <p className="text-muted-foreground text-sm">Roll No: 2024CSE045</p>
            <div className="flex items-center gap-1 mt-1 text-success text-sm">
              <CheckCircle2 className="h-4 w-4" />
              <span>Verified Student</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Full Name", value: "Rahul Kumar" },
            { label: "Roll Number", value: "2024CSE045" },
            { label: "Department", value: "Computer Science" },
            { label: "Hostel", value: "Hostel B" },
            { label: "Room Number", value: "B-302" },
            { label: "Webmail ID", value: "rahul.kumar@campus.edu", icon: true },
          ].map((item) => (
            <div key={item.label}>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</label>
              <p className="mt-1 text-sm font-medium text-foreground flex items-center gap-1.5">
                {item.value}
                {item.icon && <CheckCircle2 className="h-4 w-4 text-success" />}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <Button variant="outline"><Edit className="h-4 w-4 mr-2" /> Edit Profile</Button>
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default StudentProfile;
