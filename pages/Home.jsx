import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  ChevronDown, 
  FileText, 
  Activity, 
  BarChart3, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Cloud, 
  Globe, 
  Mail,
  UserPlus,
  History,
  CheckSquare,
  Building2,
  Factory,
  Microscope,
  Cpu,
  Verified
} from "lucide-react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const faqs = [
    { q: "How do digital signatures work?", a: "Students log their daily activities through their dashboard. Once submitted, the organization supervisor is notified to review and sign off digitally. No physical signatures required." },
    { q: "Can an organization reject a placement request?", a: "Yes, organizations have full control over who they accept. They can review a student's profile, CGPA, and preferences before deciding to approve or reject." },
    { q: "Is this platform free to use?", a: "The basic tier is completely free for students and organizations. Universities have custom enterprise pricing based on the number of active students." },
    { q: "How does OTP verification work?", a: "For security, important actions like account registration and password resets use a One-Time Password (OTP) sent directly to your registered email address." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20">
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <nav className="flex items-center justify-between px-6 md:px-12 h-16 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center group-hover:opacity-90 transition-opacity">
              <GraduationCap className="text-white w-5 h-5" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-bold text-primary tracking-tight">SIWES Logbook</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/School" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">For Schools</Link>
            <Link to="/SignIn" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">For Students</Link>
            <Link to="/organization-supervisor/signin" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">For Supervisors</Link>
            <Link to="/organization/signin" className="text-sm font-bold text-slate-500 hover:text-primary transition-colors">For Organizations</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/SignIn" className="text-sm font-bold text-slate-600 hover:text-primary transition-colors">
              Login
            </Link>
            <Link to="/register/accountType" className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-xl shadow hover:shadow-md hover:scale-[0.98] transition-all">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="pt-16">
        {/* HERO */}
        <section className="pt-20 pb-16 md:pt-24 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Digital Transformation
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                Modernizing SIWES with <span className="text-primary italic">Digital Precision.</span>
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                The institutional-grade platform for students, supervisors, and coordinators to track industrial training with absolute transparency.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/register/accountType" className="bg-primary text-white text-center font-bold px-6 py-3 rounded-xl shadow hover:scale-[0.98] transition-all">
                  Get Started for Free
                </Link>
                <button className="bg-white text-slate-700 text-center font-bold px-6 py-3 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:scale-[0.98] transition-all">
                  Request a Demo
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[2rem] transform lg:rotate-2"></div>
              <div className="relative bg-white p-2 rounded-[2rem] shadow-xl border border-slate-200 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
                <img
                  alt="Digital Logbook Dashboard"
                  className="rounded-[1.5rem] w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn3j3M1fvoRGU2x4w4emlRIfoZclLYGbFSZBpWlI5m1-Q37eZuF_kbWIz7VdWnHNg0Hos3o5Iayc4Giz1J_NoEJjWQKjb905LE_NqrT7iFLwCrR2YdiZItm-MsN9SNTgVkBbkaAGeu4xxIu5S8ZRqPiKGhx4PjMsViBFaeJkvfgELrMLINUDHD31GnjRCZxQBjFd2AuaMv6AbWM7J6RF17-2cOnjUzUN655URk2a-Sft-A83VgQplhepP1p0-MYcNutP_A7MNJHDEP"
                />
              </div>
            </div>
          </div>
        </section>

        {/* LOGO WALL */}
        <section className="py-12 border-y border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Trusted by Top Engineering Faculties & Partners</p>
            <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-black text-xl text-slate-800"><Building2 className="w-6 h-6"/> ACME POLY</div>
              <div className="flex items-center gap-2 font-black text-xl text-slate-800"><Factory className="w-6 h-6"/> GLOBAL TECH</div>
              <div className="flex items-center gap-2 font-black text-xl text-slate-800"><Cpu className="w-6 h-6"/> METRO WORKS</div>
              <div className="flex items-center gap-2 font-black text-xl text-slate-800"><Microscope className="w-6 h-6"/> R&D CORP</div>
            </div>
          </div>
        </section>

        {/* METRICS */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="py-4">
              <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">50+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Partner Institutions</div>
            </div>
            <div className="py-4">
              <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">10k+</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Logbooks Signed</div>
            </div>
            <div className="py-4">
              <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">99%</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Faster Grading</div>
            </div>
          </div>
        </section>

        {/* POWERFUL FEATURES */}
        <section className="py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Powerful Features for Institutional Excellence</h2>
              <p className="text-slate-600 text-lg">Engineered to handle the complexities of large-scale industrial training programs with simplicity and scale.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Smart Daily Logging</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Students can capture high-fidelity logs with photo evidence and location tagging. Automated reminders ensure entries are never missed.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Real-time Supervision</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Remote supervisors can verify presence and progress via GPS-stamped check-ins and instant feedback loops through integrated messaging.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm hover:-translate-y-1 transition-all group">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Advanced Analytics</h3>
                <p className="text-slate-600 leading-relaxed text-sm">Generate comprehensive performance heatmaps and automated grading reports. Export institutional data for academic records in one click.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16 space-y-3">
              <span className="text-primary text-xs font-bold uppercase tracking-wider">Streamlined Workflow</span>
              <h2 className="text-3xl font-bold text-slate-900">A Seamless Journey for Every User</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-xl font-black text-slate-300 group-hover:text-primary group-hover:border-primary/30 transition-colors shadow-sm">
                    01
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-[3px] border-slate-50 text-white">
                    <UserPlus className="w-3.5 h-3.5" strokeWidth={3}/>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Institutional Setup</h4>
                <p className="text-slate-600 text-sm leading-relaxed px-4">Create department hubs and invite students with secure institutional single sign-on (SSO).</p>
              </div>
              
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-xl font-black text-slate-300 group-hover:text-primary group-hover:border-primary/30 transition-colors shadow-sm">
                    02
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-[3px] border-slate-50 text-white">
                    <History className="w-3.5 h-3.5" strokeWidth={3}/>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Active Engagement</h4>
                <p className="text-slate-600 text-sm leading-relaxed px-4">Students document daily activities while supervisors monitor engagement through live dashboard feeds.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-xl font-black text-slate-300 group-hover:text-primary group-hover:border-primary/30 transition-colors shadow-sm">
                    03
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-[3px] border-slate-50 text-white">
                    <CheckSquare className="w-3.5 h-3.5" strokeWidth={3}/>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Verified Outcomes</h4>
                <p className="text-slate-600 text-sm leading-relaxed px-4">Final evaluations are automatically tabulated, verified by industry mentors, and synced to academic portals.</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS / ASYMMETRIC SECTION */}
        <section className="py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-12">How it works</h2>
              <div className="space-y-10">
                <div className="flex gap-5">
                  <div className="flex-none w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-slate-900">1</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Register Your Profile</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">Setup your account as a student, supervisor, or institutional coordinator within minutes.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex-none w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-slate-900">2</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Log Daily Activities</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">Capture photos, text, and technical notes from your training. Get instant feedback from site managers.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="flex-none w-10 h-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center font-bold text-slate-900">3</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Get Certified</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">Automated final report generation and institutional certification once criteria are met.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200">
              <img
                alt="System Dashboard"
                className="rounded-2xl shadow-xl border border-slate-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe4rzeTjtngE8YhT4XhOBsZSGdWbn232nrkdDCPokh1WuVYZIoJzSR8N3sdS37yQO-Xw8cyJt9ZPFORdRhvhVQL-ZZmTjdvl5a0GBKPtQlPWRIpN5VcXrnkO4disx8PD0NKQPrpIiyuQ9R0_qMFPEVTLanRFaTWxY0MrscnQEZ_ZOFILpugjg32cXy-st0DNu8vjzwdkX7sMlwumRnTjWOUfjvNFmVZD3E2Pv4aXPInwXx5K43LpVe-5o8jnMgPWBWBfCTkKpaRTQ"
              />
            </div>
          </div>
        </section>

        {/* ROLE SNEAK PEEK */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Tailored for Every Role</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">Experience a dashboard designed specifically for your needs, whether you're logging daily tasks or grading hundreds of students.</p>
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-slate-200/50 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab("student")} 
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'student' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Student
                </button>
                <button 
                  onClick={() => setActiveTab("supervisor")} 
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'supervisor' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Org Supervisor
                </button>
                <button 
                  onClick={() => setActiveTab("coordinator")} 
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'coordinator' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  Coordinator
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-[2rem] border border-slate-200 p-12 min-h-[300px] flex flex-col items-center justify-center text-center shadow-sm">
              {activeTab === 'student' && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Student Dashboard</h3>
                  <p className="text-slate-600 max-w-md mx-auto">View daily tasks, upload photos, and track supervisor signatures in real-time right from your device.</p>
                </div>
              )}
              {activeTab === 'supervisor' && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Supervisor Dashboard</h3>
                  <p className="text-slate-600 max-w-md mx-auto">Quickly review intern logs, add constructive comments, and digitally sign with one click from anywhere.</p>
                </div>
              )}
              {activeTab === 'coordinator' && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Coordinator Dashboard</h3>
                  <p className="text-slate-600 max-w-md mx-auto">Monitor all students across departments, bulk grade logbooks, and export academic reports securely.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section className="py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-primary mb-6 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Bank-grade Security & Institutional Compliance</h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Academic records are sensitive. That's why Ethereal is built from the ground up with robust security protocols to protect student data and ensure compliance with educational standards.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-600 font-medium">
                  <CheckCircle2 className="text-emerald-500 w-5 h-5" /> End-to-end data encryption
                </li>
                <li className="flex items-center gap-3 text-slate-600 font-medium">
                  <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Daily automated database backups
                </li>
                <li className="flex items-center gap-3 text-slate-600 font-medium">
                  <CheckCircle2 className="text-emerald-500 w-5 h-5" /> Secure OTP verification for critical actions
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
                <Lock className="w-8 h-8 text-primary mb-3" />
                <h4 className="text-sm font-bold text-slate-900">Encrypted</h4>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
                <Cloud className="w-8 h-8 text-primary mb-3" />
                <h4 className="text-sm font-bold text-slate-900">Backed Up</h4>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm text-center col-span-2 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
                <Verified className="w-8 h-8 text-primary mb-3" />
                <h4 className="text-sm font-bold text-slate-900">Institutionally Verified</h4>
              </div>
            </div>
          </div>
        </section>

        {/* FAQS */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-600 text-lg">Have a question that isn't answered here? Check out our support page.</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => toggleFaq(index)} 
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      openFaq === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-6 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 mt-2">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Ready to Digitalize Your SIWES Program?
            </h2>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Join the growing network of universities and polytechnics modernizing their technical education monitoring systems.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register/accountType" className="bg-primary text-white font-bold px-8 py-4 rounded-xl shadow hover:scale-[0.98] hover:shadow-md transition-all">
                Get Started Now
              </Link>
              <button className="bg-white text-slate-700 font-bold px-8 py-4 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 transition-all hover:scale-[0.98]">
                Talk to an Expert
              </button>
            </div>
          </div>
        </section>
      </main>
      
      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                  <GraduationCap className="text-white w-5 h-5" strokeWidth={2.5}/>
                </div>
                SIWES Logbook
              </div>
              <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
                Setting the standard for digital industrial training management in modern education.
              </p>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                  <Globe className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-6">Platform</h5>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">Features</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Security</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Institutional API</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-6">Support</h5>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">Documentation</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-400">
            <p>© 2026 SIWES Logbook Tracking System. All rights reserved.</p>
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional Reliability Guaranteed</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
