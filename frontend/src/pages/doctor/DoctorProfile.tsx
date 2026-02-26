import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, User, Search, FilePlus, FileText, CheckCircle2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/doctor" },
  { label: "My Profile", icon: User, path: "/doctor/profile" },
  { label: "Search Patient", icon: Search, path: "/doctor/search-patient" },
  { label: "New Prescription", icon: FilePlus, path: "/doctor/new-prescription" },
  { label: "Past Prescriptions", icon: FileText, path: "/doctor/past-prescriptions" },
];

const DoctorProfile = () => {
      const { data: user,isLoading } = useAuth();
      if (isLoading) return <div>Loading profile...</div>;
      if (!user) return null; // ProtectedRoute already handles redirect

      const profileData = [
    { label: "Full Name", value: user.name },
    { label: "Email", value: user.email },
    { label: "Qualification", value: "MD Medicine" }, // dummy
    { label: "Experience", value: "10 years" }, // dummy
    { label: "Specialization", value: "General Medicine" }, // dummy
    { label: "Employee ID", value: user.id }, // dummy
  ];

  
  
  return(
  <DashboardLayout sidebarItems={sidebarItems} role="Doctor" roleBadgeClass="badge-doctor" userName={user.name}>
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="page-header">My Profile</h1>
      <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="h-24 w-24 rounded-full bg-success/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-success">DS</span>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold font-display text-foreground">{user.name}</h2>
            <p className="text-muted-foreground text-sm">General Medicine</p>
            <div className="flex items-center gap-1 mt-1 text-success text-sm"><CheckCircle2 className="h-4 w-4" /><span>Verified Doctor</span></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {profileData.map((item) => (
            <div key={item.label}>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.label}</label>
              <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <Button variant="outline"><Edit className="h-4 w-4 mr-2" /> Edit Profile</Button>
        </div>
      </div>
    </div>
  </DashboardLayout>
);
}

export default DoctorProfile;
