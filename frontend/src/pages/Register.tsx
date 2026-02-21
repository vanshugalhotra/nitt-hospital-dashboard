import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Upload, User } from "lucide-react";
import medicalIllustration from "@/assets/medical-illustration.png";

const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Chemical", "Biotechnology", "Mathematics", "Physics", "Chemistry"];
const hostels = ["Hostel A", "Hostel B", "Hostel C", "Hostel D", "Hostel E", "Girls Hostel 1", "Girls Hostel 2"];

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", rollNumber: "", webmail: "", department: "", hostel: "", roomNumber: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const handleChange = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSendOtp = () => {
    if (!form.webmail) return;
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
    if (otp.length < 4) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpVerified(true);
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

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1500);
  };

  const isFormValid = form.name && form.rollNumber && form.webmail && form.department && form.hostel && form.roomNumber && otpVerified;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left - Illustration */}
      <div className="hidden lg:flex lg:w-5/12 bg-primary/5 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img src={medicalIllustration} alt="Medical" className="w-72 h-72 mx-auto mb-8 object-contain" />
          <h2 className="text-2xl font-bold font-display text-foreground mb-3">Join Health Center</h2>
          <p className="text-muted-foreground">Register once and access your campus health services digitally.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg py-8">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <h1 className="text-2xl font-bold font-display text-foreground mb-2">Student Registration</h1>
            <p className="text-muted-foreground text-sm mb-8">Create your health center account</p>

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
                  <input value={form.name} onChange={e => handleChange("name", e.target.value)} className="search-input w-full" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Roll Number</label>
                  <input value={form.rollNumber} onChange={e => handleChange("rollNumber", e.target.value)} className="search-input w-full" placeholder="2024CSE001" />
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
                    placeholder="john@campus.edu"
                    disabled={otpVerified}
                  />
                  {!otpVerified && (
                    <Button variant="outline" onClick={handleSendOtp} disabled={!form.webmail || loading || otpSent}>
                      {otpSent ? `Resend ${countdown > 0 ? `(${countdown}s)` : ""}` : "Verify"}
                    </Button>
                  )}
                  {otpVerified && (
                    <div className="flex items-center gap-1 text-success px-3">
                      <CheckCircle2 className="h-5 w-5" />
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

              {/* Department & Hostel */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Department</label>
                  <select value={form.department} onChange={e => handleChange("department", e.target.value)} className="search-input w-full">
                    <option value="">Select</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Hostel</label>
                  <select value={form.hostel} onChange={e => handleChange("hostel", e.target.value)} className="search-input w-full">
                    <option value="">Select</option>
                    {hostels.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>

              {/* Room Number */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Room Number</label>
                <input value={form.roomNumber} onChange={e => handleChange("roomNumber", e.target.value)} className="search-input w-full" placeholder="A-204" />
              </div>

              {/* Submit */}
              <Button className="w-full" onClick={handleRegister} disabled={!isFormValid || loading}>
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
