import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import medicalIllustration from "@/assets/medical-illustration.png";

const Login = () => {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [role, setRole] = useState<string>("student");

  const handleSendOtp = () => {
    if (!loginId) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1500);
  };

  const handleVerify = () => {
    if (otp.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      setTimeout(() => {
        const routes: Record<string, string> = {
          student: "/student",
          admin: "/admin",
          doctor: "/doctor",
          pharmacy: "/pharmacy",
          lab: "/lab",
        };
        navigate(routes[role] || "/student");
      }, 800);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img src={medicalIllustration} alt="Medical" className="w-80 h-80 mx-auto mb-8 object-contain" />
          <h2 className="text-2xl font-bold font-display text-foreground mb-3">
            Student Health Center
          </h2>
          <p className="text-muted-foreground">
            Access your medical records, prescriptions, and lab reports securely from your campus health center.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-6">
              <span className="text-lg font-bold text-primary-foreground">HC</span>
            </div>

            <h1 className="text-2xl font-bold font-display text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground text-sm mb-8">Sign in to your health center account</p>

            {/* Role selector */}
            <div className="mb-6">
              <label className="text-sm font-medium text-foreground mb-2 block">Login as</label>
              <div className="grid grid-cols-5 gap-1 bg-muted p-1 rounded-lg">
                {["student", "admin", "doctor", "pharmacy", "lab"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                      role === r
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Login ID */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {role === "student" ? "Roll Number or Webmail ID" : "Email Address"}
                </label>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder={role === "student" ? "e.g., 2024CSE001 or john@campus.edu" : "admin@healthcenter.edu"}
                  className="search-input w-full"
                  disabled={otpSent}
                />
              </div>

              {!otpSent ? (
                <Button className="w-full" onClick={handleSendOtp} disabled={!loginId || loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                </Button>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="search-input w-full tracking-widest text-center text-lg"
                      maxLength={6}
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">OTP sent to your registered email</p>
                  </div>

                  <Button className="w-full" onClick={handleVerify} disabled={otp.length < 4 || loading || verified}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : verified ? (
                      <><CheckCircle2 className="h-4 w-4" /> Verified! Redirecting...</>
                    ) : (
                      <><ArrowRight className="h-4 w-4" /> Verify & Login</>
                    )}
                  </Button>
                </>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              New student?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
