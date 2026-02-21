import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import DetailModal from "@/components/DetailModal";
import { LayoutDashboard, User, Search, FilePlus, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/doctor" },
  { label: "My Profile", icon: User, path: "/doctor/profile" },
  { label: "Search Patient", icon: Search, path: "/doctor/search-patient" },
  { label: "New Prescription", icon: FilePlus, path: "/doctor/new-prescription" },
  { label: "Past Prescriptions", icon: FileText, path: "/doctor/past-prescriptions" },
];

const prescriptions = [
  { id: 1, date: "Jan 15, 2026", studentName: "Rahul Kumar", rollNo: "2024CSE045", medicines: "Paracetamol, Cetirizine", tests: "CBC", notes: "Rest for 2 days" },
  { id: 2, date: "Jan 14, 2026", studentName: "Priya Singh", rollNo: "2024ECE012", medicines: "Amoxicillin", tests: "None", notes: "Full course" },
  { id: 3, date: "Jan 13, 2026", studentName: "Amit Roy", rollNo: "2024ME033", medicines: "Ibuprofen", tests: "Blood Sugar", notes: "Follow up in 1 week" },
];

const PastPrescriptions = () => {
  const [selected, setSelected] = useState<typeof prescriptions[0] | null>(null);

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Doctor" roleBadgeClass="badge-doctor" userName="Dr. Sharma">
      <div className="space-y-6">
        <h1 className="page-header">Past Prescriptions</h1>
        <DataTable
          columns={[
            { header: "Date", accessor: "date" },
            { header: "Student", accessor: "studentName" },
            { header: "Roll No", accessor: "rollNo" },
          ]}
          data={prescriptions}
          searchKey="studentName"
          searchPlaceholder="Search by student name..."
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
                <div><label className="text-xs text-muted-foreground uppercase">Student</label><p className="text-sm font-medium">{selected.studentName}</p></div>
                <div><label className="text-xs text-muted-foreground uppercase">Roll No</label><p className="text-sm font-medium">{selected.rollNo}</p></div>
              </div>
              <div><label className="text-xs text-muted-foreground uppercase">Medicines</label><p className="text-sm font-medium">{selected.medicines}</p></div>
              <div><label className="text-xs text-muted-foreground uppercase">Lab Tests</label><p className="text-sm font-medium">{selected.tests}</p></div>
              <div><label className="text-xs text-muted-foreground uppercase">Notes</label><p className="text-sm bg-muted p-3 rounded-lg">{selected.notes}</p></div>
            </div>
          )}
        </DetailModal>
      </div>
    </DashboardLayout>
  );
};

export default PastPrescriptions;
