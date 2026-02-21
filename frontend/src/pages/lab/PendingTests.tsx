import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import { LayoutDashboard, Clock, CheckCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/lab" },
  { label: "Pending Tests", icon: Clock, path: "/lab/pending-tests" },
  { label: "Completed Tests", icon: CheckCircle, path: "/lab/completed-tests" },
  { label: "Upload Report", icon: Upload, path: "/lab/upload-report" },
];

const pendingTests = [
  { id: 1, rollNo: "2024CSE045", studentName: "Rahul Kumar", testName: "Complete Blood Count", date: "Jan 15, 2026" },
  { id: 2, rollNo: "2024ECE012", studentName: "Priya Singh", testName: "Blood Sugar Fasting", date: "Jan 14, 2026" },
  { id: 3, rollNo: "2024ME033", studentName: "Amit Roy", testName: "Vitamin D Panel", date: "Jan 13, 2026" },
];

const PendingTests = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Lab" roleBadgeClass="badge-lab" userName="Suresh Reddy">
      <div className="space-y-6">
        <h1 className="page-header">Pending Tests</h1>
        <DataTable
          columns={[
            { header: "Roll No", accessor: "rollNo" },
            { header: "Student", accessor: "studentName" },
            { header: "Test Name", accessor: "testName" },
            { header: "Date", accessor: "date" },
          ]}
          data={pendingTests}
          searchKey="studentName"
          searchPlaceholder="Search by student..."
          actions={() => (
            <Button size="sm" onClick={() => navigate("/lab/upload-report")}>
              <Upload className="h-4 w-4 mr-1" /> Upload
            </Button>
          )}
        />
      </div>
    </DashboardLayout>
  );
};

export default PendingTests;
