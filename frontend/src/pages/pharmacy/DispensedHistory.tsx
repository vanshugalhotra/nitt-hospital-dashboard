import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import { LayoutDashboard, Package, Upload, FileText, History } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/pharmacy" },
  { label: "Stock", icon: Package, path: "/pharmacy/stock" },
  { label: "Upload Stock", icon: Upload, path: "/pharmacy/upload-stock" },
  { label: "Active Rx", icon: FileText, path: "/pharmacy/active-prescriptions" },
  { label: "Dispensed History", icon: History, path: "/pharmacy/dispensed-history" },
];

const history = [
  { id: 1, date: "Jan 15, 2026", rollNo: "2024CSE045", student: "Rahul Kumar", medicines: "Paracetamol x2", dispensedBy: "Anil Mehta" },
  { id: 2, date: "Jan 14, 2026", rollNo: "2024ECE012", student: "Priya Singh", medicines: "Amoxicillin x3", dispensedBy: "Priya Sharma" },
  { id: 3, date: "Jan 13, 2026", rollNo: "2024ME033", student: "Amit Roy", medicines: "Ibuprofen x2", dispensedBy: "Anil Mehta" },
];

const DispensedHistory = () => (
  <DashboardLayout sidebarItems={sidebarItems} role="Pharmacy" roleBadgeClass="badge-pharmacy" userName="Anil Mehta">
    <div className="space-y-6">
      <h1 className="page-header">Dispensed History</h1>
      <DataTable
        columns={[
          { header: "Date", accessor: "date" },
          { header: "Roll No", accessor: "rollNo" },
          { header: "Student", accessor: "student" },
          { header: "Medicines", accessor: "medicines" },
          { header: "Dispensed By", accessor: "dispensedBy" },
        ]}
        data={history}
        searchKey="student"
        searchPlaceholder="Search by student..."
      />
    </div>
  </DashboardLayout>
);

export default DispensedHistory;
