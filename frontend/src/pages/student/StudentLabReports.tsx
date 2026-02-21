import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import { LayoutDashboard, User, FileText, FlaskConical, Stethoscope, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student" },
  { label: "My Profile", icon: User, path: "/student/profile" },
  { label: "Prescriptions", icon: FileText, path: "/student/prescriptions" },
  { label: "Lab Reports", icon: FlaskConical, path: "/student/lab-reports" },
  { label: "Special Doctors", icon: Stethoscope, path: "/student/special-doctors" },
];

const reports = [
  { id: 1, testName: "Complete Blood Count", date: "Jan 12, 2026", status: "Sent" },
  { id: 2, testName: "Blood Sugar Fasting", date: "Jan 5, 2026", status: "Sent" },
  { id: 3, testName: "Vitamin D Panel", date: "Dec 20, 2025", status: "Pending" },
  { id: 4, testName: "Liver Function Test", date: "Dec 10, 2025", status: "Sent" },
];

const StudentLabReports = () => (
  <DashboardLayout sidebarItems={sidebarItems} role="Student" roleBadgeClass="badge-student" userName="Rahul Kumar">
    <div className="space-y-6">
      <h1 className="page-header">Lab Reports</h1>

      <DataTable
        columns={[
          { header: "Test Name", accessor: "testName" },
          { header: "Date", accessor: "date" },
          { header: "Status", accessor: (row) => (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              row.status === "Sent" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
            }`}>{row.status}</span>
          )},
        ]}
        data={reports}
        searchKey="testName"
        searchPlaceholder="Search tests..."
        actions={(row) => (
          <Button variant="outline" size="sm" disabled={row.status === "Pending"}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        )}
      />
    </div>
  </DashboardLayout>
);

export default StudentLabReports;
