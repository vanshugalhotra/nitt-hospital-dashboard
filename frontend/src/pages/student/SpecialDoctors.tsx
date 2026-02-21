import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, User, FileText, FlaskConical, Stethoscope, Calendar } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/student" },
  { label: "My Profile", icon: User, path: "/student/profile" },
  { label: "Prescriptions", icon: FileText, path: "/student/prescriptions" },
  { label: "Lab Reports", icon: FlaskConical, path: "/student/lab-reports" },
  { label: "Special Doctors", icon: Stethoscope, path: "/student/special-doctors" },
];

const doctors = [
  { name: "Dr. Anita Desai", specialization: "Dermatologist", qualification: "MD Dermatology", experience: "12 years", days: "Mon, Wed, Fri", photo: "AD" },
  { name: "Dr. Rajesh Gupta", specialization: "Orthopedic", qualification: "MS Orthopedics", experience: "15 years", days: "Tue, Thu", photo: "RG" },
  { name: "Dr. Meera Joshi", specialization: "Psychiatrist", qualification: "MD Psychiatry", experience: "8 years", days: "Mon, Thu, Sat", photo: "MJ" },
  { name: "Dr. Vikram Rao", specialization: "Ophthalmologist", qualification: "MS Ophthalmology", experience: "10 years", days: "Wed, Fri", photo: "VR" },
  { name: "Dr. Priya Nair", specialization: "Gynecologist", qualification: "MD Gynecology", experience: "14 years", days: "Tue, Sat", photo: "PN" },
  { name: "Dr. Amit Verma", specialization: "ENT Specialist", qualification: "MS ENT", experience: "9 years", days: "Mon, Wed", photo: "AV" },
];

const SpecialDoctors = () => (
  <DashboardLayout sidebarItems={sidebarItems} role="Student" roleBadgeClass="badge-student" userName="Rahul Kumar">
    <div className="space-y-6">
      <h1 className="page-header">Special Doctors</h1>
      <p className="text-muted-foreground">Visiting specialists available at the health center.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doc) => (
          <div key={doc.name} className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{doc.photo}</span>
              </div>
              <div>
                <h3 className="font-bold font-display text-foreground">{doc.name}</h3>
                <p className="text-sm text-primary font-medium">{doc.specialization}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Qualification</span>
                <span className="font-medium text-foreground">{doc.qualification}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium text-foreground">{doc.experience}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{doc.days}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default SpecialDoctors;
