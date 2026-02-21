import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import DetailModal from "@/components/DetailModal";
import { LayoutDashboard, User, FileText, FlaskConical, Stethoscope, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student" },
  { label: "My Profile", icon: User, path: "/student/profile" },
  { label: "Prescriptions", icon: FileText, path: "/student/prescriptions" },
  { label: "Lab Reports", icon: FlaskConical, path: "/student/lab-reports" },
  { label: "Special Doctors", icon: Stethoscope, path: "/student/special-doctors" },
];

const prescriptions = [
  { id: 1, date: "Jan 15, 2026", doctor: "Dr. Sharma", medicines: "Paracetamol, Cetirizine", labTests: "CBC", status: "Dispensed", notes: "Take after meals. Rest for 2 days." },
  { id: 2, date: "Jan 10, 2026", doctor: "Dr. Patel", medicines: "Amoxicillin", labTests: "None", status: "Completed", notes: "Complete the full course." },
  { id: 3, date: "Dec 28, 2025", doctor: "Dr. Singh", medicines: "Ibuprofen, Antacid", labTests: "Blood Sugar", status: "Pending", notes: "Follow up in 1 week." },
  { id: 4, date: "Dec 15, 2025", doctor: "Dr. Sharma", medicines: "Vitamin D3", labTests: "Vitamin Panel", status: "Completed", notes: "Continue supplements." },
];

const StudentPrescriptions = () => {
  const [selected, setSelected] = useState<typeof prescriptions[0] | null>(null);

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Student" roleBadgeClass="badge-student" userName="Rahul Kumar">
      <div className="space-y-6">
        <h1 className="page-header">My Prescriptions</h1>

        <DataTable
          columns={[
            { header: "Date", accessor: "date" },
            { header: "Doctor", accessor: "doctor" },
            { header: "Medicines", accessor: "medicines" },
            { header: "Lab Tests", accessor: "labTests" },
            { header: "Status", accessor: (row) => (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                row.status === "Dispensed" ? "bg-success/10 text-success" :
                row.status === "Pending" ? "bg-warning/10 text-warning" :
                "bg-primary/10 text-primary"
              }`}>{row.status}</span>
            )},
          ]}
          data={prescriptions}
          searchKey="doctor"
          searchPlaceholder="Search by doctor..."
          actions={(row) => (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(row); }}>
              <Eye className="h-4 w-4 mr-1" /> View
            </Button>
          )}
        />

        <DetailModal open={!!selected} onClose={() => setSelected(null)} title="Prescription Details">
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-muted-foreground uppercase">Date</label><p className="text-sm font-medium">{selected.date}</p></div>
                <div><label className="text-xs text-muted-foreground uppercase">Doctor</label><p className="text-sm font-medium">{selected.doctor}</p></div>
              </div>
              <div><label className="text-xs text-muted-foreground uppercase">Medicines</label><p className="text-sm font-medium">{selected.medicines}</p></div>
              <div><label className="text-xs text-muted-foreground uppercase">Lab Tests</label><p className="text-sm font-medium">{selected.labTests}</p></div>
              <div><label className="text-xs text-muted-foreground uppercase">Doctor Notes</label><p className="text-sm text-foreground bg-muted p-3 rounded-lg">{selected.notes}</p></div>
              <div><label className="text-xs text-muted-foreground uppercase">Status</label>
                <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                  selected.status === "Dispensed" ? "bg-success/10 text-success" :
                  selected.status === "Pending" ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"
                }`}>{selected.status}</span>
              </div>
            </div>
          )}
        </DetailModal>
      </div>
    </DashboardLayout>
  );
};

export default StudentPrescriptions;
