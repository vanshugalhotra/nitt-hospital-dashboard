import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // Added Toast
import medicalIllustration from "@/assets/medical-illustration.png";

const departments = [
  "Architecture", "Chemical Engineering", "Civil Engineering", 
  "Computer Science and Engineering", "Electrical and Electronics Engineering",
  "Electronics and Communication Engineering", "Instrumentation and Control Engineering",
  "Mechanical Engineering", "Metallurgical and Materials Engineering",
  "Production Engineering", "Chemistry", "Computer Applications",
  "Humanities and Social Sciences", "Management Studies", "Mathematics", "Physics"
];

const hostels = [
  "Agate", "Amber A", "Amber B", "Amethyst", "Aquamarine A", "Aquamarine B",
  "Beryl", "Coral", "Diamond", "Emerald", "Garnet A", "Garnet B", "Garnet C",
  "Jade", "Jasper", "Lapis", "Opal A", "Opal B", "Opal C", "Opal D", "Opal E",
  "Opal F", "Pearl", "Ruby", "Sapphire", "Topaz", "Zircon A", "Zircon B", "Zircon C"
];

const types = ["student", "faculty","other"];

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", rollNumber: "", webmail: "", gender: "",department:"", userType: "", hostel: "", roomNumber: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // --- Strict Enforcement Logic ---
  const handleChange = (key: string, value: string) => {
    let sanitized = value;
    if (key === "name") sanitized = value.replace(/[^a-zA-Z\s]/g, ""); // No numbers in name
    if (key === "rollNumber") sanitized = value.replace(/\D/g, "").slice(0, 9); // Only digits, max 9
    
    setForm(prev => ({ ...prev, [key]: sanitized }));
  };

  const handleSendOtp = () => {
    // Webmail regex check
    const nittRegex = /^[a-zA-Z0-9._%+-]+@nitt\.edu$/;
    if (!nittRegex.test(form.webmail)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid webmail address ending in @nitt.edu",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 6) {
      toast({ variant: "destructive", title: "Invalid OTP", description: "OTP must be 6 digits." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpVerified(true);
      toast({ title: "Verified", description: "Email verification successful." });
    }, 1500);
  };

  const handleRegister = () => {
    // Final check for all fields
    if (!form.name || form.name.length < 2) {
      toast({ variant: "destructive", title: "Name Error", description: "Please enter a valid name." });
      return;
    }
    if (!form.gender || !form.userType || !form.hostel || !form.roomNumber  || !form.department) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Please fill in all details including Gender." });
      return;
    }
    if (!otpVerified) {
      toast({ variant: "destructive", title: "Verification Required", description: "Please verify your email before registering." });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left - Illustration */}
      <div className="hidden lg:flex lg:w-5/12 bg-primary/5 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img src={medicalIllustration} alt="Medical" className="w-72 h-72 mx-auto mb-8 object-contain" />
          <h2 className="text-2xl font-bold font-display text-foreground mb-3">Create Account</h2>
          <p className="text-muted-foreground">Register once and access your campus health services digitally.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <h1 className="text-2xl font-bold font-display text-foreground mb-2">Student Registration</h1>
            <p className="text-muted-foreground text-sm mb-8">Create your nitt hospital account</p>

            <div className="space-y-5">
              {/* Profile image */}
              <div className="flex justify-center">
                <label className="cursor-pointer group">
                  <div className="h-24 w-24 rounded-full border-2 border-dashed border-border group-hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-muted">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <User className="h-8 w-8 mx-auto text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1 block">Upload</span>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Name & Roll */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                  <input value={form.name} onChange={e => handleChange("name", e.target.value)} className="search-input w-full" placeholder="Ashok Kumar" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Roll Number</label>
                  <input type="text" value={form.rollNumber} onChange={e => handleChange("rollNumber", e.target.value)} className="search-input w-full" placeholder="1101xxxxx" />
                </div>
              </div>

              {/* Webmail + OTP */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Webmail ID</label>
                <div className="flex gap-2">
                  <input
                    value={form.webmail}
                    onChange={e => handleChange("webmail", e.target.value)}
                    className="search-input flex-1"
                    placeholder="1101xxxxx@nitt.edu"
                    disabled={otpVerified}
                  />
                  {!otpVerified && (
                    <Button variant="outline" onClick={handleSendOtp} disabled={!form.webmail || loading || otpSent}>
                      {otpSent ? `Resend ${countdown > 0 ? `(${countdown}s)` : ""}` : "Verify"}
                    </Button>
                  )}
                  {otpVerified && (
                    <div className="flex items-center gap-1 text-success px-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                </div>
              </div>

              {otpSent && !otpVerified && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Enter OTP</label>
                  <div className="flex gap-2">
                    <input
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="search-input flex-1 text-center tracking-widest text-lg"
                      placeholder="000000"
                      maxLength={6}
                    />
                    <Button onClick={handleVerifyOtp} disabled={otp.length < 4 || loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                    </Button>
                  </div>
                  {countdown > 0 && <p className="text-xs text-muted-foreground mt-1">OTP expires in {countdown}s</p>}
                </div>
              )}

              {/* Gender & Department */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Gender</label>
                  <select value={form.gender} onChange={e => handleChange("gender", e.target.value)} className="search-input w-full">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Department</label>
                  <select value={form.department} onChange={e => handleChange("department", e.target.value)} className="search-input w-full">
                    <option value="">Select</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                 <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">User Type</label>
                  <select value={form.userType} onChange={e => handleChange("userType", e.target.value)} className="search-input w-full">
                    <option value="">Select</option>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Hostel & Room Number */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Hostel</label>
                  <select value={form.hostel} onChange={e => handleChange("hostel", e.target.value)} className="search-input w-full">
                    <option value="">Select</option>
                    {hostels.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Room Number</label>
                  <input value={form.roomNumber} onChange={e => handleChange("roomNumber", e.target.value)} className="search-input w-full" placeholder="43" />
                </div>
              </div>

              {/* Submit */}
              <Button className="w-full" onClick={handleRegister} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register"}
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already registered?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;