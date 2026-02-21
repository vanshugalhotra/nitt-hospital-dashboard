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

const stock = [
  { id: 1, name: "Paracetamol 500mg", quantity: 250, low: false },
  { id: 2, name: "Cetirizine 10mg", quantity: 8, low: true },
  { id: 3, name: "Amoxicillin 500mg", quantity: 120, low: false },
  { id: 4, name: "Ibuprofen 400mg", quantity: 5, low: true },
  { id: 5, name: "Vitamin D3 60K", quantity: 80, low: false },
  { id: 6, name: "Bandages", quantity: 3, low: true },
  { id: 7, name: "Omeprazole 20mg", quantity: 200, low: false },
];

const PharmacyStock = () => (
  <DashboardLayout sidebarItems={sidebarItems} role="Pharmacy" roleBadgeClass="badge-pharmacy" userName="Anil Mehta">
    <div className="space-y-6">
      <h1 className="page-header">Stock Management</h1>
      <DataTable
        columns={[
          { header: "Medicine Name", accessor: "name" },
          { header: "Quantity", accessor: (row) => (
            <span className={row.low ? "font-bold text-destructive" : ""}>{row.quantity}</span>
          )},
          { header: "Status", accessor: (row) => (
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              row.low ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
            }`}>{row.low ? "Low Stock" : "In Stock"}</span>
          )},
        ]}
        data={stock}
        searchKey="name"
        searchPlaceholder="Search medicines..."
      />
    </div>
  </DashboardLayout>
);

export default PharmacyStock;
