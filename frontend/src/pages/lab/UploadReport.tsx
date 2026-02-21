import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DetailModal from "@/components/DetailModal";
import { LayoutDashboard, Clock, CheckCircle, Upload, CloudUpload, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/lab" },
  { label: "Pending Tests", icon: Clock, path: "/lab/pending-tests" },
  { label: "Completed Tests", icon: CheckCircle, path: "/lab/completed-tests" },
  { label: "Upload Report", icon: Upload, path: "/lab/upload-report" },
];

const UploadReport = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleSend = () => {
    setShowConfirm(false);
    setFile(null);
    toast({ title: "Report Sent", description: "Lab report has been sent to the student." });
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} role="Lab" roleBadgeClass="badge-lab" userName="Suresh Reddy">
      <div className="space-y-6 max-w-2xl">
        <h1 className="page-header">Upload Report</h1>

        {/* Student Info */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">RK</span>
          </div>
          <div>
            <p className="font-medium text-foreground">Rahul Kumar</p>
            <p className="text-sm text-muted-foreground">2024CSE045 • Complete Blood Count</p>
          </div>
        </div>

        {/* Upload area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); }}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
            dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
          onClick={() => document.getElementById("pdf-upload")?.click()}
        >
          <CloudUpload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="font-medium text-foreground">Upload PDF Report</p>
          <p className="text-sm text-muted-foreground mt-1">Drag & drop or click to browse</p>
          <input id="pdf-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} />
        </div>

        {file && (
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        )}

        <Button className="w-full" disabled={!file} onClick={() => setShowConfirm(true)}>
          <Send className="h-4 w-4 mr-2" /> Send to Student
        </Button>

        <DetailModal open={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Send">
          <div className="space-y-4">
            <p className="text-sm text-foreground">Are you sure you want to send this report to <strong>Rahul Kumar (2024CSE045)</strong>?</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSend}>Confirm & Send</Button>
            </div>
          </div>
        </DetailModal>
      </div>
    </DashboardLayout>
  );
};

export default UploadReport;
