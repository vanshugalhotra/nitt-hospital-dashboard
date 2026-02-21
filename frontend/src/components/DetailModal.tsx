import { createPortal } from "react-dom"; // 1. Import this
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const DetailModal = ({ open, onClose, title, children }: DetailModalProps) => {
  if (!open) return null;

  // 2. Wrap the return in createPortal
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="bg-card rounded-xl shadow-xl border border-border w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-lg font-bold font-display text-foreground">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body // 3. This tells React to render it at the root of the body
  );
};

export default DetailModal;