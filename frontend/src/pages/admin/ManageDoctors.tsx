import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import DetailModal from "@/components/DetailModal";
import { LayoutDashboard, Stethoscope, Pill, FlaskConical, Database, Plus, Edit, Trash2, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Manage Doctors", icon: Stethoscope, path: "/admin/doctors" },
  { label: "Pharmacy Staff", icon: Pill, path: "/admin/pharmacy-staff" },
  { label: "Lab Staff", icon: FlaskConical, path: "/admin/lab-staff" },
  { label: "Master Data", icon: Database, path: "/admin/master-data" },
];

// Mock data restored
const initialDoctors = [
  { id: 1, name: "Dr. Sharma", email: "sharma@hc.edu", qualification: "MD Medicine", experience: "10 years", specialization: "General Practitioner", initials: "DS" },
  { id: 2, name: "Dr. Patel", email: "patel@hc.edu", qualification: "MD Pediatrics", experience: "8 years", specialization: "Pediatrics", initials: "DP" },
  { id: 3, name: "Dr. Singh", email: "singh@hc.edu", qualification: "MBBS, DNB", experience: "5 years", specialization: "General Practitioner", initials: "RS" },
];

const specializations = ["General Practitioner", "Pediatrics", "Dermatology", "Orthopedics", "Cardiology", "Psychiatry", "Other"];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ManageDoctors = () => {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  const [form, setForm] = useState({
    name: "", email: "", qualification: "", experience: "", specialization: "", otherSpecialization: "", startTime: "", endTime: ""
  });

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  // --- Strict Enforcement Logic ---
  const isFilled = () => {
    const basicInfo = form.name && form.email && form.qualification && form.experience && form.specialization;
    
    // If Specialization is "Other", check if otherSpecialization is typed
    const otherCheck = form.specialization === "Other" ? !!form.otherSpecialization : true;
    
    // If NOT General Practitioner, check timings and days
    const scheduleCheck = form.specialization !== "General Practitioner" && form.specialization !== "" 
      ? (!!form.startTime && !!form.endTime && selectedDays.length > 0)
      : true;

    return basicInfo && otherCheck && scheduleCheck;
  };

  const handleAddDoctor = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(form.email)) {
      toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowModal(false);
      toast({ title: "Doctor Added", description: `${form.name} has been successfully registered.` });
      // Reset
      setForm({ name: "", email: "", qualification: "", experience: "", specialization: "", otherSpecialization: "", startTime: "", endTime: "" });
      setProfileImage(null);
      setSelectedDays([]);
    }, 1500);
  };

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
          data={initialDoctors}
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
          <div className="space-y-5 py-2">
            
            {/* Photo Upload */}
            <div className="flex justify-center">
              <label className="cursor-pointer group">
                <div className="h-24 w-24 rounded-full border-2 border-dashed border-border group-hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-muted">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <User className="h-8 w-8 mx-auto text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1 block">Upload</span>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                <input value={form.name} onChange={e => handleChange("name", e.target.value)} className="search-input w-full" placeholder="Dr. Sharma" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                <input value={form.email} onChange={e => handleChange("email", e.target.value)} className="search-input w-full" placeholder="sharma@hc.edu" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Qualification</label>
                <input value={form.qualification} onChange={e => handleChange("qualification", e.target.value)} className="search-input w-full" placeholder="MD Medicine" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Experience</label>
                <input value={form.experience} onChange={e => handleChange("experience", e.target.value)} className="search-input w-full" placeholder="10 years" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Specialization</label>
              <select value={form.specialization} onChange={e => handleChange("specialization", e.target.value)} className="search-input w-full">
                <option value="">Select Specialization</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {form.specialization === "Other" && (
              <div className="animate-in fade-in slide-in-from-top-1">
                <label className="text-sm font-medium text-foreground mb-1.5 block">Specify Specialization</label>
                <input value={form.otherSpecialization} onChange={e => handleChange("otherSpecialization", e.target.value)} className="search-input w-full" placeholder="Enter specialization name" />
              </div>
            )}

            {/* Availability Section - Seamless blending */}
            {form.specialization && form.specialization !== "General Practitioner" && (
              <>
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Start Time</label>
                    <input type="time" value={form.startTime} onChange={e => handleChange("startTime", e.target.value)} className="search-input w-full" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">End Time</label>
                    <input type="time" value={form.endTime} onChange={e => handleChange("endTime", e.target.value)} className="search-input w-full" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Days Available</label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                          selectedDays.includes(day) 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "bg-background border-border text-muted-foreground hover:border-primary"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Button 
              className="w-full mt-2" 
              onClick={handleAddDoctor} 
              disabled={!isFilled() || loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Add Doctor"}
            </Button>
          </div>
        </DetailModal>
      </div>
    </DashboardLayout>
  );
};

export default ManageDoctors;