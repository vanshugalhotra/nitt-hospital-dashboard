import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, LogOut, ChevronLeft } from "lucide-react";
import { apiRoutes } from "@/lib/apiRoutes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export interface SidebarItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  role: string;
  roleBadgeClass: string;
  userName: string;
  userAvatar?: string;
}



const DashboardLayout = ({
  children,
  sidebarItems,
  role,
  roleBadgeClass,
  userName,
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

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
  try {
    await fetchWithAuth(apiRoutes.staffAuth.logout, {
      method: "POST",
    });

    toast({
      title: "Logout Successful",
      description: `You have been logged out of the ${role} portal.`,
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-300 lg:relative",
          sidebarOpen 
            ? "w-64 translate-x-0" 
            : "-translate-x-full lg:translate-x-0 lg:w-16"
        )}
      >
        {/* Title Section */}
        <div className={cn(
          "flex items-center h-16 border-b border-sidebar-border px-4",
          !sidebarOpen && "lg:justify-center lg:px-0"
        )}>
          {
          sidebarOpen &&
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-sidebar-foreground truncate">
                NIT Trichy Hospital
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            }
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                   // Close sidebar on mobile after navigation
                   if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !sidebarOpen && "lg:justify-center lg:px-0"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section - Fixed the sticking out issue */}
        <div className="p-2 border-t border-sidebar-border overflow-hidden">
          <button
            onClick={() => handleLogout()}
            className={cn(
              "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-logout-foreground hover:bg-sidebar-logout-accent hover:text-sidebar-logout-accent-foreground transition-colors",
              !sidebarOpen && "lg:justify-center lg:px-0"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="truncate">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay - Only shows when sidebar is open on small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top navbar */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle Sidebar"
          >
            {/* Logic: On mobile, always show Menu if closed. On desktop, show Chevron toggle. */}
            <div className="lg:block hidden">
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </div>
            <div className="lg:hidden block">
              <Menu className="h-5 w-5" />
            </div>
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:flex items-center gap-2">
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", roleBadgeClass)}>
                {role}
              </span>
              <p className="text-sm font-semibold text-foreground whitespace-nowrap">{userName}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-border">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary">
                  {userName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
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