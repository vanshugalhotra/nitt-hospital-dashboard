import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, LogOut, ChevronLeft } from "lucide-react";
import { apiRoutes } from "@/lib/apiRoutes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { useAuth } from "@/hooks/use-auth";

export interface SidebarItem {
  label: string;
  icon: React.ElementType;
  path: string;
}
interface AuthUser {
  id: string;
  name: string;
  role: "ADMIN" | "HOSPITAL_ADMIN" | "DOCTOR" | "PHARMACY" | "LAB";
  email: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  role?: string;
  roleBadgeClass?: string;
  userName?: string;
  userAvatar?: string;
}

const DashboardLayout = ({
  children,
  sidebarItems,
  role: fallbackRole,
  roleBadgeClass: fallbackBadgeClass,
  userName: fallbackName,
  userAvatar,
}: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return false;
  });

  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: user, isLoading } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await fetchWithAuth(apiRoutes.staffAuth.logout, {
        method: "POST",
      });

      toast({
        title: "Logout Successful",
        description: "You have been logged out safely.",
      });

      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Something went wrong while logging out.",
      });
    }
  };

  // Derive values from controller data or fallbacks
  const displayName = user?.name || fallbackName || "User";
  const displayRole = user?.role || fallbackRole || "Admin";

  const getBadgeClass = (role: string) => {
    const r = role?.toUpperCase();
    if (r === "ADMIN" || r === "HOSPITAL_ADMIN") return "badge-admin";
    if (r === "DOCTOR") return "bg-blue-100 text-blue-700";
    if (r === "PHARMACY") return "bg-green-100 text-green-700";
    if (r === "LAB") return "bg-purple-100 text-purple-700";
    return fallbackBadgeClass || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-300 lg:relative",
          sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"
        )}
      >
        <div className={cn("flex items-center h-16 border-b border-sidebar-border px-4", !sidebarOpen && "lg:justify-center lg:px-0")}>
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-sidebar-foreground truncate">NIT Trichy Hospital</span>
              <button onClick={() => setSidebarOpen(false)} className="text-sidebar-foreground/60 lg:hidden">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !sidebarOpen && "lg:justify-center lg:px-0"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-sidebar-border overflow-hidden">
          <button onClick={handleLogout} className={cn("flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-logout-foreground hover:bg-sidebar-logout-accent hover:text-sidebar-logout-accent-foreground transition-colors", !sidebarOpen && "lg:justify-center lg:px-0")}>
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 text-muted-foreground transition-colors">
            <div className="lg:block hidden">{sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</div>
            <div className="lg:hidden block"><Menu className="h-5 w-5" /></div>
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:flex flex-col items-end">
              <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-0.5", getBadgeClass(displayRole))}>
                {displayRole}
              </span>
              <p className="text-sm font-semibold text-foreground whitespace-nowrap">{displayName}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
              {userAvatar ? (
                <img src={userAvatar} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-background/50">
          <div className="mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;