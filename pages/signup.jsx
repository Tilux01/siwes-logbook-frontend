import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [personalEmail, setPersonalEmail] = useState("");
  const [institutionEmail, setInstitutionEmail] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const signUp = (e) => {
    e.preventDefault();
    if (!personalEmail || !institutionEmail || !contactAddress || !password || !otpCode) {
      return alert("Please fill in all parameters including OTP code");
    }
    if (!isOtpVerified) {
      return alert("Please verify your email address with the OTP code first.");
    }

    setLoading(true);
    axios
      .post("http://localhost:5687/user/student/signup", {
        email_address: personalEmail,
        Instituition_Mail: institutionEmail,
        Contact_Adress: contactAddress,
        password: password,
        Profile_Img: null,
        otp_code: otpCode
      })
      .then(() => {
        alert("Student profile activated successfully! You can now sign in.");
        navigate("/SignIn");
      })
      .catch((err) => {
        alert(err?.response?.data?.message || "Activation failed. Please check that your email address was pre-registered by your institution.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSendOtp = () => {
    if (!personalEmail) {
      return alert("Please enter your personal email address first.");
    }
    setOtpLoading(true);
    axios.post("http://localhost:5687/auth/otp/send", { email_address: personalEmail })
      .then(() => {
        alert("OTP sent to your email!");
        setIsOtpSent(true);
      })
      .catch((err) => {
        alert(err?.response?.data?.message || "Failed to send OTP.");
      })
      .finally(() => {
        setOtpLoading(false);
      });
  };

  const handleVerifyOtp = () => {
    if (!otpCode) {
      return alert("Please enter the OTP code.");
    }
    setOtpLoading(true);
    axios.post("http://localhost:5687/auth/otp/verify", { email_address: personalEmail, otp_code: otpCode })
      .then(() => {
        alert("Email verified successfully!");
        setIsOtpVerified(true);
      })
      .catch((err) => {
        alert(err?.response?.data?.message || "Invalid OTP code.");
      })
      .finally(() => {
        setOtpLoading(false);
      });
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-lg">school</span>
          </div>
          <span className="text-xl font-bold text-primary">
            SIWES Management Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/SignIn">
            <button className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-all">
              Already Activated? Sign In
            </button>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center pt-16 px-4 mt-8">
        <div className="w-full max-w-[900px] grid md:grid-cols-2 bg-white rounded-2xl overflow-hidden border border-outline-variant shadow-xl">
          {/* Left Column Hero */}
          <div className="relative hidden md:flex flex-col justify-end p-8 bg-primary text-white overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-3xl">how_to_reg</span>
              </div>
              <h2 className="text-2xl font-bold">Student Account Activation</h2>
              <p className="text-sm opacity-90">
                Activate your pre-registered student profile to start recording daily work logs, request company placements, and submit assessments.
              </p>
            </div>
          </div>

          {/* Right Column Form */}
          <div className="p-8 flex flex-col justify-center">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-sm">verified</span>
                Student Activation
              </span>
              <h1 className="text-2xl font-extrabold text-primary">Activate Student Account</h1>
              <p className="text-sm text-on-surface-variant mt-0.5">
                Provide pre-registered emails to set up your password.
              </p>
            </div>

            <form className="space-y-4" onSubmit={signUp}>
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Pre-registered Personal Email Address *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">mail</span>
                  <input
                    className="w-full h-11 pl-10 pr-24 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm disabled:opacity-60"
                    placeholder="name@personal.com"
                    type="email"
                    required
                    disabled={isOtpVerified}
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                  />
                  {!isOtpVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading || !personalEmail}
                      className="absolute right-1 top-1 h-9 px-3 bg-primary/10 text-primary hover:bg-primary/20 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isOtpSent ? "Resend OTP" : "Get OTP"}
                    </button>
                  )}
                  {isOtpVerified && (
                    <span className="absolute right-3 top-3 material-symbols-outlined text-green-500 text-lg">check_circle</span>
                  )}
                </div>
              </div>

              {isOtpSent && !isOtpVerified && (
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1">Enter Verification Code *</label>
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">pin</span>
                      <input
                        className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm tracking-widest font-bold"
                        placeholder="123456"
                        type="text"
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpLoading || !otpCode}
                      className="h-11 px-6 bg-primary text-white font-bold text-sm rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Pre-registered Institutional Email *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">school</span>
                  <input
                    className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                    placeholder="student@institution.edu.ng"
                    type="email"
                    required
                    value={institutionEmail}
                    onChange={(e) => setInstitutionEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Contact Home / Residential Address *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">home</span>
                  <input
                    className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                    placeholder="Enter full physical residential address..."
                    type="text"
                    required
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-1">Create Account Password *</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">lock</span>
                  <input
                    className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm"
                    placeholder="••••••••"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="w-full h-11 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md mt-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading || !isOtpVerified}
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                {loading ? "Activating..." : "Activate Account"}
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-on-surface-variant">
                  Already activated?{' '}
                  <Link to="/SignIn" className="text-primary font-bold hover:underline">
                    Sign In Here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
