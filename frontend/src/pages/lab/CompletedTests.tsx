import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import { LayoutDashboard, Clock, CheckCircle, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/lab" },
  { label: "Pending Tests", icon: Clock, path: "/lab/pending-tests" },
  { label: "Completed Tests", icon: CheckCircle, path: "/lab/completed-tests" },
  { label: "Upload Report", icon: Upload, path: "/lab/upload-report" },
];

const completedTests = [
  { id: 1, rollNo: "2024CSE045", studentName: "Rahul Kumar", testName: "CBC", date: "Jan 12, 2026", sentAt: "Jan 12, 2026 3:00 PM" },
  { id: 2, rollNo: "2024ECE012", studentName: "Priya Singh", testName: "Blood Sugar", date: "Jan 10, 2026", sentAt: "Jan 11, 2026 10:00 AM" },
];

const CompletedTests = () => (
  <DashboardLayout sidebarItems={sidebarItems} role="Lab" roleBadgeClass="badge-lab" userName="Suresh Reddy">
    <div className="space-y-6">
      <h1 className="page-header">Completed Tests</h1>
      <DataTable
        columns={[
          { header: "Roll No", accessor: "rollNo" },
          { header: "Student", accessor: "studentName" },
          { header: "Test", accessor: "testName" },
          { header: "Date", accessor: "date" },
          { header: "Sent At", accessor: "sentAt" },
        ]}
        data={completedTests}
        searchKey="studentName"
        searchPlaceholder="Search by student..."
        actions={() => (
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Download</Button>
        )}
      />
    </div>
  </DashboardLayout>
);

export default CompletedTests;
