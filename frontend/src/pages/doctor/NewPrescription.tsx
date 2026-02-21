import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, User, Search, FilePlus, FileText, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/doctor" },
  { label: "My Profile", icon: User, path: "/doctor/profile" },
  { label: "Search Patient", icon: Search, path: "/doctor/search-patient" },
  { label: "New Prescription", icon: FilePlus, path: "/doctor/new-prescription" },
  { label: "Past Prescriptions", icon: FileText, path: "/doctor/past-prescriptions" },
];

const availableMedicines = ["Paracetamol 500mg", "Cetirizine 10mg", "Amoxicillin 500mg", "Ibuprofen 400mg", "Vitamin D3 60K", "Azithromycin 500mg", "Omeprazole 20mg", "Metformin 500mg"];
const availableTests = ["Complete Blood Count", "Blood Sugar Fasting", "Liver Function Test", "Vitamin D Panel", "Urine Routine", "Thyroid Profile", "Lipid Profile"];

const NewPrescription = () => {
  const { toast } = useToast();
  const [medicines, setMedicines] = useState<string[]>([]);
  const [medSearch, setMedSearch] = useState("");
  const [tests, setTests] = useState<string[]>([]);
  const [testSearch, setTestSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [showMedDropdown, setShowMedDropdown] = useState(false);
  const [showTestDropdown, setShowTestDropdown] = useState(false);

  const filteredMeds = availableMedicines.filter(m => m.toLowerCase().includes(medSearch.toLowerCase()) && !medicines.includes(m));
  const filteredTests = availableTests.filter(t => t.toLowerCase().includes(testSearch.toLowerCase()) && !tests.includes(t));

  const handleSubmit = () => {
    toast({ title: "Prescription Submitted", description: "Prescription has been sent to pharmacy." });
    setMedicines([]); setTests([]); setNotes("");
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Doctor" roleBadgeClass="badge-doctor" userName="Dr. Sharma">
      <div className="space-y-6">
        <h1 className="page-header">New Prescription</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-bold font-display text-foreground mb-4">Patient Info</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">RK</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Rahul Kumar</p>
                <p className="text-sm text-muted-foreground">2024CSE045</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span className="font-medium">CSE</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Hostel</span><span className="font-medium">B-302</span></div>
            </div>
          </div>

          {/* Prescription Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Medicines */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="font-bold font-display text-foreground mb-4">Medicines</h3>
              <div className="relative">
                <input
                  value={medSearch}
                  onChange={(e) => { setMedSearch(e.target.value); setShowMedDropdown(true); }}
                  onFocus={() => setShowMedDropdown(true)}
                  className="search-input w-full"
                  placeholder="Search medicine..."
                />
                {showMedDropdown && filteredMeds.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredMeds.map(m => (
                      <button key={m} onClick={() => { setMedicines([...medicines, m]); setMedSearch(""); setShowMedDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">{m}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {medicines.map(m => (
                  <span key={m} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                    {m} <button onClick={() => setMedicines(medicines.filter(x => x !== m))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Lab Tests */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="font-bold font-display text-foreground mb-4">Lab Tests</h3>
              <div className="relative">
                <input
                  value={testSearch}
                  onChange={(e) => { setTestSearch(e.target.value); setShowTestDropdown(true); }}
                  onFocus={() => setShowTestDropdown(true)}
                  className="search-input w-full"
                  placeholder="Search lab test..."
                />
                {showTestDropdown && filteredTests.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredTests.map(t => (
                      <button key={t} onClick={() => { setTests([...tests, t]); setTestSearch(""); setShowTestDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors">{t}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {tests.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 bg-warning/10 text-warning text-sm px-3 py-1 rounded-full">
                    {t} <button onClick={() => setTests(tests.filter(x => x !== t))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="font-bold font-display text-foreground mb-4">Doctor Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="search-input w-full min-h-[120px] resize-y"
                placeholder="Enter notes for the patient..."
              />
            </div>

            <Button className="w-full h-12 text-base font-semibold" onClick={handleSubmit} disabled={medicines.length === 0}>
              Submit Prescription
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewPrescription;
