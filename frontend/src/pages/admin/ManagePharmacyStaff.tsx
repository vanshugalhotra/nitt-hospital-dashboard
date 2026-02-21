import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import { LayoutDashboard, Stethoscope, Pill, FlaskConical, Database, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import DetailModal from "@/components/DetailModal";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Manage Doctors", icon: Stethoscope, path: "/admin/doctors" },
  { label: "Pharmacy Staff", icon: Pill, path: "/admin/pharmacy-staff" },
  { label: "Lab Staff", icon: FlaskConical, path: "/admin/lab-staff" },
  { label: "Master Data", icon: Database, path: "/admin/master-data" },
];

const staff = [
  { id: 1, name: "Anil Mehta", email: "anil@hc.edu", role: "Pharmacist", initials: "AM" },
  { id: 2, name: "Priya Sharma", email: "priya@hc.edu", role: "Assistant", initials: "PS" },
];

const ManagePharmacyStaff = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Admin" roleBadgeClass="badge-admin" userName="Dr. Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="page-header">Pharmacy Staff</h1>
          <Button onClick={() => setShowModal(true)}><Plus className="h-4 w-4 mr-2" /> Add Staff</Button>
        </div>
        <DataTable
          columns={[
            { header: "Photo", accessor: (row) => <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center"><span className="text-sm font-bold text-warning">{row.initials}</span></div> },
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            { header: "Role", accessor: "role" },
          ]}
          data={staff}
          searchKey="name"
          actions={() => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          )}
        />
        <DetailModal open={showModal} onClose={() => setShowModal(false)} title="Add Pharmacy Staff">
          <div className="space-y-4">
            {["Name", "Email", "Role"].map((f) => (
              <div key={f}><label className="text-sm font-medium text-foreground mb-1.5 block">{f}</label><input className="search-input w-full" placeholder={`Enter ${f.toLowerCase()}`} /></div>
            ))}
            <Button className="w-full">Add Staff</Button>
          </div>
        </DetailModal>
      </div>
    </DashboardLayout>
  );
};

export default ManagePharmacyStaff;
