import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutDashboard, Package, Upload, FileText, History, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/pharmacy" },
  { label: "Stock", icon: Package, path: "/pharmacy/stock" },
  { label: "Upload Stock", icon: Upload, path: "/pharmacy/upload-stock" },
  { label: "Active Rx", icon: FileText, path: "/pharmacy/active-prescriptions" },
  { label: "Dispensed History", icon: History, path: "/pharmacy/dispensed-history" },
];

const UploadStock = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Pharmacy" roleBadgeClass="badge-pharmacy" userName="Anil Mehta">
      <div className="space-y-6 max-w-2xl">
        <h1 className="page-header">Upload Stock</h1>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <CloudUpload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="font-medium text-foreground">Drag & drop CSV file here</p>
          <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
          <input id="file-upload" type="file" accept=".csv" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
        </div>

        {file && (
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <p className="text-sm font-medium text-foreground">📄 {file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        )}

        <a href="#" className="text-sm text-primary hover:underline">📥 Download sample CSV format</a>

        <Button className="w-full" disabled={!file}>Confirm Upload</Button>
      </div>
    </DashboardLayout>
  );
};

export default UploadStock;
