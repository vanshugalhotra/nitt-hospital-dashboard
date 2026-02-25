import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DataTable from "@/components/DataTable";
import DetailModal from "@/components/DetailModal";
import {
  LayoutDashboard,
  Stethoscope,
  Pill,
  FlaskConical,
  Database,
  Plus,
  Edit,
  Trash2,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDoctors } from "@/hooks/useDoctors";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Manage Doctors", icon: Stethoscope, path: "/admin/doctors" },
  { label: "Pharmacy Staff", icon: Pill, path: "/admin/pharmacy-staff" },
  { label: "Lab Staff", icon: FlaskConical, path: "/admin/lab-staff" },
  { label: "Master Data", icon: Database, path: "/admin/master-data" },
];

const specializations = [
  "General Practitioner",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Cardiology",
  "Psychiatry",
  "Other",
];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface StaffMember {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role: "ADMIN" | "HOSPITAL_ADMIN" | "DOCTOR" | "PHARMACY" | "LAB";
  qualification?: string;
  experience?: string;
  specialization?: string;
  otherSpecialization?: string;
  availableDays?: string[];
  startTime?: string;
  endTime?: string;
}

const ManageDoctors = () => {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<StaffMember | null>(null);

  const [selectedDoctor, setSelectedDoctor] = useState<StaffMember | null>(null);
  const [isActive, setIsActive] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    qualification: "",
    experience: "",
    specialization: "",
    otherSpecialization: "",
    startTime: "",
    endTime: "",
  });

  const { data: staffMembers, create, remove, update } = useDoctors();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      qualification: "",
      experience: "",
      specialization: "",
      otherSpecialization: "",
      startTime: "",
      endTime: "",
    });
    setProfileImage(null);
    setSelectedDays([]);
    setSelectedDoctor(null);
    setIsActive(true);
  };

  const openEditModal = (doctor: StaffMember) => {
    setSelectedDoctor(doctor);
    setIsActive(doctor.isActive);
    
    // Map existing data to form state so "old values" aren't pushed
    setForm({
      name: doctor.name || "",
      email: doctor.email || "",
      qualification: doctor.qualification || "",
      experience: doctor.experience || "",
      specialization: doctor.specialization || "",
      otherSpecialization: doctor.otherSpecialization || "",
      startTime: doctor.startTime || "",
      endTime: doctor.endTime || "",
    });
    setSelectedDays(doctor.availableDays || []);
    setShowModal(true);
  };

  const openDeleteConfirmation = (row: StaffMember) => {
    setDoctorToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!doctorToDelete) return;
    setLoading(true);
    try {
      await remove(doctorToDelete.id);
      toast({ title: "Doctor Removed", description: "Record deleted successfully." });
      setIsDeleteModalOpen(false);
      setDoctorToDelete(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
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
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const isFilled = () => {
    const basicInfo = form.name && form.email && form.qualification && form.experience && form.specialization;
    const otherCheck = form.specialization === "Other" ? !!form.otherSpecialization : true;
    const scheduleCheck = (form.specialization !== "General Practitioner" && form.specialization !== "")
        ? !!form.startTime && !!form.endTime && selectedDays.length > 0
        : true;

    return basicInfo && otherCheck && scheduleCheck;
  };

  const handleUpdateDoctor = async () => {
    if (!selectedDoctor) return;
    setLoading(true);
    try {
      await update({ 
        id: selectedDoctor.id, 
        data: {
          name: form.name,
          email: form.email,
          password: "password123",
          isActive: isActive,
        } 
      } as any);
      toast({ title: "Doctor Updated", description: `${form.name} updated successfully.` });
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to update" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email)) {
      toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    try {
      await create({
        ...form,
        availableDays: selectedDays,
        password: "password123",
        role: "DOCTOR",
        isActive: true,
      } as any);

      toast({ title: "Doctor Added", description: `${form.name} registered successfully.` });
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to create" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Admin" roleBadgeClass="badge-admin" userName="Dr. Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="page-header">Manage Doctors</h1>
          <Button onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Doctor
          </Button>
        </div>

        <DataTable
          columns={[
            {
              header: "Photo",
              accessor: (row: StaffMember) => (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{row.name.charAt(0).toUpperCase()}</span>
                </div>
              ),
            },
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            { header: "Role", accessor: "role" },
            {
              header: "Status",
              accessor: (row: StaffMember) => (
                <span className={row.isActive ? "text-green-600" : "text-red-600"}>{row.isActive ? "Active" : "Inactive"}</span>
              ),
            },
            {
              header: "Joined",
              accessor: (row: StaffMember) => new Date(row.createdAt).toLocaleDateString("en-IN"),
            },
          ]}
          data={staffMembers}
          searchKey="name"
          searchPlaceholder="Search staff..."
          actions={(row: StaffMember) => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => openEditModal(row)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={() => openDeleteConfirmation(row)} size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        />

        {/* Delete Confirmation Modal */}
        <DetailModal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
          <div className="p-4 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-3"><Trash2 className="h-10 w-10 text-red-600" /></div>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">Are you sure?</h3>
            <p className="mb-6 text-sm text-gray-500">
              Delete <span className="font-semibold text-gray-700">{doctorToDelete?.name}</span>? This is permanent.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleConfirmDelete} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Yes, Delete Record"}
              </Button>
            </div>
          </div>
        </DetailModal>

        {/* Main Form Modal */}
        <DetailModal open={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={selectedDoctor ? "Edit Doctor" : "Add New Doctor"}>
          <div className="space-y-5 py-2">
            <div className="flex justify-center">
              <label className="cursor-pointer group">
                <div className="h-24 w-24 rounded-full border-2 border-dashed border-border group-hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-muted">
                  {profileImage ? <img src={profileImage} alt="Profile" className="h-full w-full object-cover" /> : <div className="text-center"><User className="h-8 w-8 mx-auto text-muted-foreground" /><span className="text-xs text-muted-foreground mt-1 block">Upload</span></div>}
                </div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {selectedDoctor && (
              <div className="flex items-center gap-2 px-1">
                <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary" />
                <label htmlFor="isActive" className="text-sm font-medium">Account Active</label>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="search-input w-full" placeholder="Dr. Sharma" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                <input value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="search-input w-full" placeholder="sharma@hc.edu" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Qualification</label>
                <input value={form.qualification} onChange={(e) => handleChange("qualification", e.target.value)} className="search-input w-full" placeholder="MD Medicine" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Experience</label>
                <input value={form.experience} onChange={(e) => handleChange("experience", e.target.value)} className="search-input w-full" placeholder="10 years" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Specialization</label>
              <select value={form.specialization} onChange={(e) => handleChange("specialization", e.target.value)} className="search-input w-full">
                <option value="">Select Specialization</option>
                {specializations.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>

            {form.specialization === "Other" && (
              <div className="animate-in fade-in slide-in-from-top-1">
                <label className="text-sm font-medium mb-1.5 block">Specify Specialization</label>
                <input value={form.otherSpecialization} onChange={(e) => handleChange("otherSpecialization", e.target.value)} className="search-input w-full" />
              </div>
            )}

            {form.specialization && form.specialization !== "General Practitioner" && (
              <>
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Start Time</label>
                    <input type="time" value={form.startTime} onChange={(e) => handleChange("startTime", e.target.value)} className="search-input w-full" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">End Time</label>
                    <input type="time" value={form.endTime} onChange={(e) => handleChange("endTime", e.target.value)} className="search-input w-full" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Days Available</label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button key={day} onClick={() => toggleDay(day)} className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${selectedDays.includes(day) ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground"}`}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Button className="w-full mt-2" onClick={selectedDoctor ? handleUpdateDoctor : handleAddDoctor} disabled={!isFilled() || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : selectedDoctor ? "Update Doctor" : "Add Doctor"}
            </Button>
          </div>
        </DetailModal>
      </div>
    </DashboardLayout>
  );
};

export default ManageDoctors;