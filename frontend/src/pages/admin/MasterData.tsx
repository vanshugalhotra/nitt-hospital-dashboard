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

const medicines = [
  { id: 1, name: "Paracetamol 500mg", category: "Analgesic" },
  { id: 2, name: "Cetirizine 10mg", category: "Antihistamine" },
  { id: 3, name: "Amoxicillin 500mg", category: "Antibiotic" },
  { id: 4, name: "Ibuprofen 400mg", category: "NSAID" },
  { id: 5, name: "Vitamin D3 60K", category: "Supplement" },
];

const labTests = [
  { id: 1, name: "Complete Blood Count (CBC)", category: "Hematology" },
  { id: 2, name: "Blood Sugar Fasting", category: "Biochemistry" },
  { id: 3, name: "Liver Function Test", category: "Biochemistry" },
  { id: 4, name: "Vitamin D Panel", category: "Immunology" },
  { id: 5, name: "Urine Routine", category: "Pathology" },
];

const MasterData = () => {
  const [tab, setTab] = useState<"medicines" | "tests" | "schedule">("medicines");
  const [showModal, setShowModal] = useState(false);

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Admin" roleBadgeClass="badge-admin" userName="Dr. Admin">
      <div className="space-y-6">
        <h1 className="page-header">Master Data</h1>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          {[
            { key: "medicines", label: "Medicine List" },
            { key: "tests", label: "Lab Test List" },
            { key: "schedule", label: "Doctor Schedule" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === t.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setShowModal(true)}><Plus className="h-4 w-4 mr-2" /> Add New</Button>
        </div>

        {tab === "medicines" && (
          <DataTable
            columns={[
              { header: "Medicine Name", accessor: "name" },
              { header: "Category", accessor: "category" },
            ]}
            data={medicines}
            searchKey="name"
            searchPlaceholder="Search medicines..."
            actions={() => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            )}
          />
        )}

        {tab === "tests" && (
          <DataTable
            columns={[
              { header: "Test Name", accessor: "name" },
              { header: "Category", accessor: "category" },
            ]}
            data={labTests}
            searchKey="name"
            searchPlaceholder="Search tests..."
            actions={() => (
              <div className="flex gap-1">
                <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            )}
          />
        )}

        {tab === "schedule" && (
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="space-y-4">
              {[
                { doctor: "Dr. Sharma", days: "Mon-Fri", time: "9:00 AM - 1:00 PM" },
                { doctor: "Dr. Patel", days: "Mon, Wed, Fri", time: "2:00 PM - 5:00 PM" },
                { doctor: "Dr. Singh", days: "Tue, Thu, Sat", time: "9:00 AM - 12:00 PM" },
              ].map((s) => (
                <div key={s.doctor} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{s.doctor}</p>
                    <p className="text-sm text-muted-foreground">{s.days} • {s.time}</p>
                  </div>
                  <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <DetailModal open={showModal} onClose={() => setShowModal(false)} title={`Add ${tab === "medicines" ? "Medicine" : tab === "tests" ? "Lab Test" : "Schedule"}`}>
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-foreground mb-1.5 block">Name</label><input className="search-input w-full" /></div>
            <div><label className="text-sm font-medium text-foreground mb-1.5 block">Category</label><input className="search-input w-full" /></div>
            <Button className="w-full">Add</Button>
          </div>
        </DetailModal>
      </div>
    </DashboardLayout>
  );
};

export default MasterData;
