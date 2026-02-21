import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Stethoscope, Pill, FlaskConical } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Added Toast
import medicalIllustration from "@/assets/medical-illustration.png";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize toast
  const [loginId, setLoginId] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Strict Enforcement for Student Role
    if (role === "student") {
      const studentEmailRegex = /^\d+@nitt\.edu$/;
      if (!studentEmailRegex.test(loginId)) {
        toast({
          variant: "destructive",
          title: "Invalid Roll Number",
          description: "Student email must start with your  roll number (@nitt.edu).",
        });
        return;
      }
    }

    // General enforcement for all @nitt.edu domains
    if (!loginId.endsWith("@nitt.edu")) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only official @nitt.edu email addresses are permitted.",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Login Successful",
        description: `Welcome back to the ${role} portal.`,
      });
      navigate("/student"); // Logic for future navigation
    }, 1500);
  };

  const roles = [
    { id: "student", label: "Student", icon: Users },
    { id: "doctor", label: "Doctor", icon: Stethoscope },
    { id: "pharmacy", label: "Pharmacy", icon: Pill },
    { id: "lab", label: "Lab Staff", icon: FlaskConical },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left - Illustration & Role Selection */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img src={medicalIllustration} alt="Medical" className="w-80 h-80 mx-auto mb-8 object-contain" />
          <h2 className="text-2xl font-bold font-display text-foreground mb-3">
            NIT Trichy Hospital
          </h2>
          <p className="text-muted-foreground mb-8">
            Access your medical records, prescriptions, and lab reports securely.
          </p>

          <div className="flex justify-center gap-6">
            {roles.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setRole(item.id);
                    setLoginId(""); // Clear input when switching roles
                  }}
                  className="flex flex-col items-center group transition-all"
                >
                  <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center mb-2 transition-all border ${
                    role === item.id
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card text-muted-foreground border-border group-hover:border-primary/50"
                  }`}>
                    <Icon size={24} />
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${
                    role === item.id ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            
            {/* Dynamic Header */}
            <h1 className="text-2xl font-bold font-display text-foreground mb-2 capitalize">
              {role} Login
            </h1>
            <p className="text-muted-foreground text-sm mb-6">Sign in to your {role} portal</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Conditional Form Fields based on Role */}
              {role === "student" && (
                <div>
                  <label className="text-sm font-light px-2 text-foreground block mb-1.5">NITT Email</label>
                  <input
                    type="email"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="1101xxx@nitt.edu"
                    className="search-input w-full"
                  />
                </div>
              )}

              {role === "doctor" && (
                <div>
                  <label className="text-sm font-light px-2 text-foreground block mb-1.5">Doctor Email</label>
                  <input
                    type="email"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="doctor@nitt.edu"
                    className="search-input w-full"
                  />
                </div>
              )}

              {role === "pharmacy" && (
                <div>
                  <label className="text-sm font-light px-2 text-foreground block mb-1.5">Staff Email</label>
                  <input
                    type="email"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="pharmacy@nitt.edu"
                    className="search-input w-full"
                  />
                </div>
              )}

              {role === "lab" && (
                <div>
                  <label className="text-sm font-light px-2 text-foreground block mb-1.5">Lab Tech Email</label>
                  <input
                    type="email"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="lab@nitt.edu"
                    className="search-input w-full"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label className="text-sm font-light px-2 text-foreground block mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  className="search-input w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={!loginId || loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>

            {role === "student" && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                New student?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">
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