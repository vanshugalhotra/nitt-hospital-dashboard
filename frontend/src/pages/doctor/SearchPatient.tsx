import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, User, Search as SearchIcon, FilePlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/doctor" },
  { label: "My Profile", icon: User, path: "/doctor/profile" },
  { label: "Search Patient", icon: SearchIcon, path: "/doctor/search-patient" },
  { label: "New Prescription", icon: FilePlus, path: "/doctor/new-prescription" },
  { label: "Past Prescriptions", icon: FileText, path: "/doctor/past-prescriptions" },
];

const SearchPatient = () => {
  const [rollNo, setRollNo] = useState("");
  const [searched, setSearched] = useState(false);

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Doctor" roleBadgeClass="badge-doctor" userName="Dr. Sharma">
      <div className="space-y-6">
        <h1 className="page-header">Search Patient</h1>

        <div className="flex gap-3 max-w-md">
          <input value={rollNo} onChange={(e) => setRollNo(e.target.value)} className="search-input flex-1" placeholder="Enter Roll Number" />
          <Button onClick={() => setSearched(true)} disabled={!rollNo}><SearchIcon className="h-4 w-4 mr-2" /> Search</Button>
        </div>

        {searched && (
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm max-w-md animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">RK</span>
              </div>
              <div>
                <h3 className="font-bold font-display text-foreground">Rahul Kumar</h3>
                <p className="text-sm text-muted-foreground">Roll No: {rollNo}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground">Department</span><p className="font-medium">Computer Science</p></div>
              <div><span className="text-muted-foreground">Hostel</span><p className="font-medium">Hostel B</p></div>
              <div><span className="text-muted-foreground">Room</span><p className="font-medium">B-302</p></div>
              <div><span className="text-muted-foreground">Past Prescriptions</span><p className="font-medium text-primary">12</p></div>
            </div>
            <Button className="w-full mt-4" onClick={() => window.location.href = "/doctor/new-prescription"}>
              <FilePlus className="h-4 w-4 mr-2" /> Write Prescription
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SearchPatient;
