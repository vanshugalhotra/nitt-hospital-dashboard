import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Users,
  Stethoscope,
  Pill,
  FlaskConical,
  UserRoundCog,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRoutes } from "@/lib/apiRoutes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import medicalIllustration from "@/assets/medical-illustration.png";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginId || !password) {
      toast({
        variant: "destructive",
        title: "Missing Credentials",
        description: "Please enter both login ID and password.",
      });
      return;
    }

    if (role === "student") {
      const studentEmailRegex = /^\d+@nitt\.edu$/;
      if (!studentEmailRegex.test(loginId)) {
        toast({
          variant: "destructive",
          title: "Invalid Roll Number",
          description:
            "Student email must start with your <roll-number>@nitt.edu",
        });
        return;
      }
    }

    const otherEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!otherEmailRegex.test(loginId)) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid email format.",
      });
      return;
    }
    try {
      setLoading(true);

      const response = await fetchWithAuth(apiRoutes.staffAuth.login, {
        method: "POST",
        body: JSON.stringify({
          email: loginId,
          password: password,
        }),
      });
      console.log("Login response:", response);
      console.log("Role:", role);
      toast({
        title: "Login Successful",
        description: `Welcome back to the ${role} portal.`,
      });
      navigate(`/${role}`);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Login Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      });
      setLoading(false);
    }
    return;
  };

  const roles = [
    { id: "student", label: "Student", icon: Users },
    { id: "doctor", label: "Doctor", icon: Stethoscope },
    { id: "pharmacy", label: "Pharmacy", icon: Pill },
    { id: "lab", label: "Lab Staff", icon: FlaskConical },
    { id: "admin", label: "Admin", icon: UserRoundCog },
  ];

  // Extracted the buttons so we can render them in both mobile and desktop positions
  const RoleButtons = () => (
    <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
      {roles.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setRole(item.id);
              setLoginId("");
            }}
            className="flex flex-col items-center group transition-all"
          >
            <div
              className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center mb-2 transition-all border ${
                role === item.id
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-card text-muted-foreground border-border group-hover:border-primary/50"
              }`}
            >
              <Icon size={24} />
            </div>
            <span
              className={`text-[10px] uppercase tracking-wider font-bold ${
                role === item.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left - Illustration & Role Selection (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img
            src={medicalIllustration}
            alt="Medical"
            className="w-80 h-80 mx-auto mb-8 object-contain"
          />
          <h2 className="text-2xl font-bold font-display text-foreground mb-3">
            NIT Trichy Hospital
          </h2>
          <p className="text-muted-foreground mb-8">
            Access your medical records, prescriptions, and lab reports
            securely.
          </p>
          <RoleButtons />
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Mobile-only Header and Role Selector */}
        <div className="lg:hidden w-full max-w-md mb-8 text-center">
          <h2 className="text-2xl font-bold font-display text-foreground mb-6">
            NIT Trichy Hospital
          </h2>
          <p className="text-muted-foreground mb-8">
            Access your medical records, prescriptions, and lab reports
            securely.
          </p>
          <RoleButtons />
        </div>

        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <h1 className="text-2xl font-bold font-display text-foreground mb-2 capitalize">
              {role} Login
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              Sign in to your {role} portal
            </p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Role-specific Email Inputs */}
              <div>
                <label className="text-sm font-light px-2 text-foreground block mb-1.5">
                  {role === "student"
                    ? "NITT Email"
                    : role === "doctor"
                      ? "Doctor Email"
                      : role === "pharmacy"
                        ? "Staff Email"
                        : role === "lab"
                          ? "Lab Tech Email"
                          : "Admin Email"}
                </label>
                <input
                  type="email"
                  required
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder={
                    role === "student" ? "1101xxx@nitt.edu" : `${role}@nitt.edu`
                  }
                  className="search-input w-full"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-light px-2 text-foreground block mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="search-input w-full"
                />
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium px-2 text-primary hover:underline block mb-1.5"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!loginId || !password || loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {role === "student" && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                New student?{" "}
                <Link
                  to="/register"
                  className="text-primary font-medium hover:underline"
                >
                  Register now
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
