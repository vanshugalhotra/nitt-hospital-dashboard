import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import { LayoutDashboard, Package, Upload, FileText, History, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/pharmacy" },
  { label: "Stock", icon: Package, path: "/pharmacy/stock" },
  { label: "Upload Stock", icon: Upload, path: "/pharmacy/upload-stock" },
  { label: "Active Rx", icon: FileText, path: "/pharmacy/active-prescriptions" },
  { label: "Dispensed History", icon: History, path: "/pharmacy/dispensed-history" },
];

const initialPrescriptions = [
  { id: 1, rollNo: "2024CSE045", studentName: "Rahul Kumar", medicines: "Paracetamol x2, Cetirizine x1", status: "Pending" },
  { id: 2, rollNo: "2024ECE012", studentName: "Priya Singh", medicines: "Amoxicillin x3", status: "Pending" },
  { id: 3, rollNo: "2024ME033", studentName: "Amit Roy", medicines: "Ibuprofen x2, Antacid x1", status: "Pending" },
];

const ActivePrescriptions = () => {
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);

  const handleDispense = (id: number) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status: "Dispensed" } : p));
    toast({ title: "Dispensed", description: "Medicines dispensed and stock updated." });
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Pharmacy" roleBadgeClass="badge-pharmacy" userName="Anil Mehta">
      <div className="space-y-6">
        <h1 className="page-header">Active Prescriptions</h1>
        <DataTable
          columns={[
            { header: "Roll No", accessor: "rollNo" },
            { header: "Student", accessor: "studentName" },
            { header: "Medicines", accessor: "medicines" },
            { header: "Status", accessor: (row) => (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                row.status === "Dispensed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}>{row.status}</span>
            )},
          ]}
          data={prescriptions}
          searchKey="rollNo"
          searchPlaceholder="Search by roll number..."
          actions={(row) => (
            <Button size="sm" disabled={row.status === "Dispensed"} onClick={(e) => { e.stopPropagation(); handleDispense(row.id); }}>
              <CheckCircle className="h-4 w-4 mr-1" /> Dispense
            </Button>
          )}
        />
      </div>
    </DashboardLayout>
  );
};

export default ActivePrescriptions;
