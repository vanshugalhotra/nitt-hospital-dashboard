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

const staff = [
  { id: 1, name: "Anil Mehta", email: "anil@hc.edu", role: "Pharmacist", initials: "AM" },
  { id: 2, name: "Priya Sharma", email: "priya@hc.edu", role: "Assistant", initials: "PS" },
];

const ManagePharmacyStaff = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Admin" roleBadgeClass="badge-admin" userName="Dr. Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="page-header">Pharmacy Staff</h1>
          <Button onClick={() => setShowModal(true)}><Plus className="h-4 w-4 mr-2" /> Add Staff</Button>
        </div>
        <DataTable
          columns={[
            { header: "Photo", accessor: (row) => <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center"><span className="text-sm font-bold text-warning">{row.initials}</span></div> },
            { header: "Name", accessor: "name" },
            { header: "Email", accessor: "email" },
            { header: "Role", accessor: "role" },
          ]}
          data={staff}
          searchKey="name"
          actions={() => (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          )}
        />
        <DetailModal open={showModal} onClose={() => setShowModal(false)} title="Add Pharmacy Staff">
          <div className="space-y-4">
            {["Name", "Email", "Role"].map((f) => (
              <div key={f}><label className="text-sm font-medium text-foreground mb-1.5 block">{f}</label><input className="search-input w-full" placeholder={`Enter ${f.toLowerCase()}`} /></div>
            ))}
            <Button className="w-full">Add Staff</Button>
          </div>
        </DetailModal>
      </div>
    </DashboardLayout>
  );
};

export default ManagePharmacyStaff;






// "use client";

// import { useState } from "react";
// import DashboardLayout from "@/components/DashboardLayout";
// import DataTable from "@/components/DataTable";
// import DetailModal from "@/components/DetailModal";
// import {
//   LayoutDashboard,
//   Pill,
//   Plus,
//   Edit,
//   Trash2,
//   Loader2,
//   User,
//   Database,
//   FlaskConical,
//   Stethoscope,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { usePharmacy } from "@/hooks/usePharmacy";

// const sidebarItems = [
//   { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
//   { label: "Manage Doctors", icon: Stethoscope, path: "/admin/doctors" },
//   { label: "Pharmacy Staff", icon: Pill, path: "/admin/pharmacy-staff" },
//   { label: "Lab Staff", icon: FlaskConical, path: "/admin/lab-staff" },
//   { label: "Master Data", icon: Database, path: "/admin/master-data" },
// ];

// interface StaffMember {
//   id: string;
//   name: string;
//   email: string;
//   role: "PHARMACY";
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// const ManagePharmacyStaff = () => {
//   const { toast } = useToast();
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     role: "PHARMACY",
//   });

//   const { data: staffMembers, isLoading, create, remove } = usePharmacy();

//   const handleChange = (key: string, value: string) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const openDeleteConfirmation = (staffMember: StaffMember) => {
//     setStaffToDelete(staffMember);
//     setIsDeleteModalOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!staffToDelete) return;

//     setLoading(true);
//     try {
//       await remove(staffToDelete.id);
//       toast({
//         title: "Staff Removed",
//         description: "Record deleted successfully.",
//       });
//       setIsDeleteModalOpen(false);
//       setStaffToDelete(null);
//     } catch (error: any) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.message,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => setProfileImage(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   const isFilled = () => form.name && form.email && form.role;

//   const handleAddStaff = async () => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(form.email)) {
//       toast({
//         variant: "destructive",
//         title: "Invalid Email",
//         description: "Please enter a valid email address.",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       await create({
//         ...form,
//         password: "password123",
//         isActive: true,
//       } as any);

//       toast({
//         title: "Staff Added",
//         description: `${form.name} has been successfully registered.`,
//       });
//       setShowModal(false);

//       setForm({ name: "", email: "", role: "PHARMACY" });
//       setProfileImage(null);
//     } catch (error: any) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error.message || "Failed to create staff",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <DashboardLayout
//       sidebarItems={sidebarItems}
//       role="Admin"
//       roleBadgeClass="badge-admin"
//       userName="Dr. Admin"
//     >
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="page-header">Pharmacy Staff</h1>
//           <Button onClick={() => setShowModal(true)}>
//             <Plus className="h-4 w-4 mr-2" /> Add Staff
//           </Button>
//         </div>

//         <DataTable
//           columns={[
//             {
//               header: "Photo",
//               accessor: (row: StaffMember) => (
//                 <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
//                   <span className="text-sm font-bold text-primary">
//                     {row.name.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//               ),
//             },
//             { header: "Name", accessor: "name" },
//             { header: "Email", accessor: "email" },
//             { header: "Role", accessor: "role" },
//             {
//               header: "Status",
//               accessor: (row: StaffMember) => (
//                 <span
//                   className={row.isActive ? "text-green-600" : "text-red-600"}
//                 >
//                   {row.isActive ? "Active" : "Inactive"}
//                 </span>
//               ),
//             },
//             {
//               header: "Joined",
//               accessor: (row: StaffMember) =>
//                 new Date(row.createdAt).toLocaleDateString("en-IN"),
//             },
//           ]}
//           data={staffMembers}
//           searchKey="name"
//           searchPlaceholder="Search staff..."
//           actions={(row: StaffMember) => (
//             <div className="flex gap-1">
//               <Button variant="ghost" size="sm">
//                 <Edit className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="ghost"
//                 onClick={() => openDeleteConfirmation(row)}
//                 size="sm"
//                 className="text-destructive hover:text-destructive"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           )}
//         />

//         {/* Delete Modal */}
//         <DetailModal
//           open={isDeleteModalOpen}
//           onClose={() => setIsDeleteModalOpen(false)}
//           title="Confirm Deletion"
//         >
//           <div className="p-4 text-center">
//             <div className="mb-4 flex justify-center">
//               <div className="rounded-full bg-red-100 p-3">
//                 <Trash2 className="h-10 w-10 text-red-600" />
//               </div>
//             </div>
//             <h3 className="mb-2 text-lg font-bold text-gray-900">
//               Are you sure?
//             </h3>
//             <p className="mb-6 text-sm text-gray-500">
//               You are about to delete{" "}
//               <span className="font-semibold text-gray-700">
//                 {staffToDelete?.name}
//               </span>
//               . This action is permanent and cannot be undone.
//             </p>
//             <div className="flex justify-center gap-3">
//               <Button
//                 variant="outline"
//                 onClick={() => setIsDeleteModalOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="destructive"
//                 onClick={handleConfirmDelete}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                   "Yes, Delete Record"
//                 )}
//               </Button>
//             </div>
//           </div>
//         </DetailModal>

//         {/* Add Staff Modal */}
//         <DetailModal
//           open={showModal}
//           onClose={() => setShowModal(false)}
//           title="Add Pharmacy Staff"
//         >
//           <div className="space-y-5 py-2">
//             <div className="flex justify-center">
//               <label className="cursor-pointer group">
//                 <div className="h-24 w-24 rounded-full border-2 border-dashed border-border group-hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-muted">
//                   {profileImage ? (
//                     <img
//                       src={profileImage}
//                       alt="Profile"
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <div className="text-center">
//                       <User className="h-8 w-8 mx-auto text-muted-foreground" />
//                       <span className="text-xs text-muted-foreground mt-1 block">
//                         Upload
//                       </span>
//                     </div>
//                   )}
//                 </div>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                 />
//               </label>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-foreground mb-1.5 block">
//                   Full Name
//                 </label>
//                 <input
//                   value={form.name}
//                   onChange={(e) => handleChange("name", e.target.value)}
//                   className="search-input w-full"
//                   placeholder="John Doe"
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-foreground mb-1.5 block">
//                   Email Address
//                 </label>
//                 <input
//                   value={form.email}
//                   onChange={(e) => handleChange("email", e.target.value)}
//                   className="search-input w-full"
//                   placeholder="john@hc.edu"
//                 />
//               </div>
//             </div>

//             <Button
//               className="w-full mt-2"
//               onClick={handleAddStaff}
//               disabled={!isFilled() || loading}
//             >
//               {loading ? (
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//               ) : (
//                 "Add Staff"
//               )}
//             </Button>
//           </div>
//         </DetailModal>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default ManagePharmacyStaff;
