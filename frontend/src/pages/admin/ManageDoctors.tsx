import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import DetailModal from "@/components/DetailModal";
import { LayoutDashboard, Stethoscope, Pill, FlaskConical, Database, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Manage Doctors", icon: Stethoscope, path: "/admin/doctors" },
  { label: "Pharmacy Staff", icon: Pill, path: "/admin/pharmacy-staff" },
  { label: "Lab Staff", icon: FlaskConical, path: "/admin/lab-staff" },
  { label: "Master Data", icon: Database, path: "/admin/master-data" },
];

const doctors = [
  { id: 1, name: "Dr. Sharma", email: "sharma@hc.edu", qualification: "MD Medicine", experience: "10 years", specialization: "General", initials: "DS" },
  { id: 2, name: "Dr. Patel", email: "patel@hc.edu", qualification: "MD Pediatrics", experience: "8 years", specialization: "Pediatrics", initials: "DP" },
  { id: 3, name: "Dr. Singh", email: "singh@hc.edu", qualification: "MBBS, DNB", experience: "5 years", specialization: "General", initials: "RS" },
];

const ManageDoctors = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Admin" roleBadgeClass="badge-admin" userName="Dr. Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="page-header">Manage Doctors</h1>
          <Button onClick={() => setShowModal(true)}><Plus className="h-4 w-4 mr-2" /> Add Doctor</Button>
        </div>

        <DataTable
          columns={[
            { header: "Photo", accessor: (row) => (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{row.initials}</span>
              </div>
            )},
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            { header: "Qualification", accessor: "qualification" },
            { header: "Experience", accessor: "experience" },
            { header: "Specialization", accessor: "specialization" },
          ]}
          data={doctors}
          searchKey="name"
          searchPlaceholder="Search doctors..."
          actions={() => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          )}
        />

        <DetailModal open={showModal} onClose={() => setShowModal(false)} title="Add New Doctor">
          <div className="space-y-4">
            {["Name", "Email", "Qualification", "Experience", "Specialization"].map((field) => (
              <div key={field}>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{field}</label>
                <input className="search-input w-full" placeholder={`Enter ${field.toLowerCase()}`} />
              </div>
            ))}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Photo</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <p className="text-sm text-muted-foreground">Click to upload photo</p>
              </div>
            </div>
            <Button className="w-full">Add Doctor</Button>
          </div>
        </DetailModal>
      </div>
    </DashboardLayout>
  );
};

export default ManageDoctors;
