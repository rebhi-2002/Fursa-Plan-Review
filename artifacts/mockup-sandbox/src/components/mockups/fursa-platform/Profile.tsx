import React, { useState } from "react";
import { AppLayout } from "./_shared/AppLayout";
import { 
  Github, 
  Linkedin, 
  Globe, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Download, 
  Upload, 
  CheckCircle2, 
  Plus,
  Pencil,
  Mail,
  Calendar,
  Languages
} from "lucide-react";

export function Profile() {
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  return (
    <AppLayout role="seeker">
      <div className="max-w-6xl mx-auto px-4 py-8" style={{ fontFamily: "'Outfit', 'Cairo', sans-serif" }}>
        
        {/* Profile Header Card */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700 overflow-hidden mb-8 shadow-xl">
          {/* Banner */}
          <div className="h-48 md:h-64 bg-gradient-to-r from-[#1D4ED8] via-indigo-600 to-[#FBBF24] relative">
            <button className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition">
              <Pencil className="w-5 h-5" />
            </button>
          </div>
          
          {/* Profile Info */}
          <div className="px-6 sm:px-10 pb-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-16 md:-mt-24 mb-6">
              <div 
                className="relative rounded-full border-4 border-[#1E293B] p-1 bg-gradient-to-b from-[#FBBF24] to-[#1D4ED8]"
                onMouseEnter={() => setIsHoveringAvatar(true)}
                onMouseLeave={() => setIsHoveringAvatar(false)}
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-slate-800 relative cursor-pointer">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" 
                    alt="Omar Al-Shafi" 
                    className="w-full h-full object-cover"
                  />
                  {isHoveringAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none bg-[#1D4ED8] hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2">
                  <Pencil className="w-4 h-4" />
                  <span>Edit Profile / تعديل</span>
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 text-white p-2.5 rounded-lg transition flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                  Omar Al-Shafi <span className="text-slate-400 font-normal text-2xl">|</span> <span dir="rtl" className="font-['Cairo']">عمر الشافي</span>
                  <CheckCircle2 className="w-6 h-6 text-[#1D4ED8]" />
                </h1>
                <p className="text-xl text-slate-300 mb-3 font-medium">Full-Stack Developer</p>
                
                <div className="flex flex-wrap gap-4 text-slate-400 mb-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>Gaza, Palestine</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <span>omar.shafi@example.com</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#FBBF24]">
                    <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
                    <span className="font-medium">Open to Work</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1D4ED8] transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1D4ED8] transition">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1D4ED8] transition">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-[#1E293B] rounded-xl border border-slate-700 p-6 mb-8 flex flex-col md:flex-row items-center gap-6 shadow-md">
          <div className="w-16 h-16 rounded-full border-4 border-slate-700 flex items-center justify-center relative shrink-0">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="28" cy="28" r="28" fill="none" stroke="#334155" strokeWidth="4" />
              <circle cx="28" cy="28" r="28" fill="none" stroke="#FBBF24" strokeWidth="4" strokeDasharray="175" strokeDashoffset="44" />
            </svg>
            <span className="text-white font-bold text-lg">75%</span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-1">Profile Completion</h3>
            <p className="text-slate-400">Add 2 more sections to reach 100%. Complete profiles are 3x more likely to be contacted by employers.</p>
          </div>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shrink-0 whitespace-nowrap">
            Complete Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About */}
            <section className="bg-[#1E293B] rounded-xl border border-slate-700 p-6 md:p-8 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#1D4ED8] rounded-full"></span>
                  About
                </h2>
                <button className="text-slate-400 hover:text-white transition"><Pencil className="w-5 h-5" /></button>
              </div>
              <div className="space-y-6">
                <p className="text-slate-300 leading-relaxed">
                  Passionate Full-Stack Developer with 4+ years of experience building scalable web applications. Strong focus on modern JavaScript ecosystems including React, Node.js, and TypeScript. Dedicated to writing clean, maintainable code and solving complex technical challenges. Active contributor to open-source projects.
                </p>
                <div className="h-px bg-slate-700 w-full"></div>
                <p dir="rtl" className="text-slate-300 leading-relaxed font-['Cairo'] text-lg">
                  مطور واجهات متكاملة (Full-Stack) شغوف بخبرة تزيد عن 4 سنوات في بناء تطبيقات ويب قابلة للتوسع. أركز بشكل كبير على بيئة عمل JavaScript الحديثة بما في ذلك React و Node.js و TypeScript. مكرس لكتابة كود نظيف وقابل للصيانة وحل التحديات التقنية المعقدة. مساهم نشط في المشاريع مفتوحة المصدر.
                </p>
              </div>
            </section>

            {/* Experience */}
            <section className="bg-[#1E293B] rounded-xl border border-slate-700 p-6 md:p-8 shadow-md">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#1D4ED8] rounded-full"></span>
                  Experience
                </h2>
                <button className="text-[#1D4ED8] hover:bg-blue-900/30 p-2 rounded-lg transition flex items-center gap-1 text-sm font-medium">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                
                {/* Job 1 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#1E293B] bg-[#1D4ED8] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow absolute left-0 md:left-1/2 -translate-x-1/2 z-10">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-14 md:ml-0 p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-lg">Senior Frontend Developer</h3>
                      <button className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition"><Pencil className="w-4 h-4" /></button>
                    </div>
                    <div className="text-[#FBBF24] font-medium mb-1">TechVision Solutions</div>
                    <div className="text-slate-400 text-sm flex items-center gap-1.5 mb-3">
                      <Calendar className="w-3.5 h-3.5" /> Jan 2022 - Present
                    </div>
                    <ul className="text-slate-300 text-sm space-y-2 list-disc list-inside">
                      <li>Led the migration of legacy Angular app to React/Next.js</li>
                      <li>Improved performance scores by 40%</li>
                      <li>Mentored 3 junior developers</li>
                    </ul>
                  </div>
                </div>

                {/* Job 2 */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#1E293B] bg-slate-700 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow absolute left-0 md:left-1/2 -translate-x-1/2 z-10">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-14 md:ml-0 p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-lg">Web Developer</h3>
                      <button className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition"><Pencil className="w-4 h-4" /></button>
                    </div>
                    <div className="text-slate-300 font-medium mb-1">Gaza Sky Geeks (Freelance)</div>
                    <div className="text-slate-400 text-sm flex items-center gap-1.5 mb-3">
                      <Calendar className="w-3.5 h-3.5" /> Jun 2019 - Dec 2021
                    </div>
                    <ul className="text-slate-300 text-sm space-y-2 list-disc list-inside">
                      <li>Developed full-stack web applications for international clients</li>
                      <li>Implemented responsive designs and RESTful APIs</li>
                    </ul>
                  </div>
                </div>

              </div>
            </section>

            {/* Education */}
            <section className="bg-[#1E293B] rounded-xl border border-slate-700 p-6 md:p-8 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-6 bg-[#1D4ED8] rounded-full"></span>
                  Education
                </h2>
                <button className="text-[#1D4ED8] hover:bg-blue-900/30 p-2 rounded-lg transition flex items-center gap-1 text-sm font-medium">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="flex gap-4 p-5 rounded-xl border border-slate-700 bg-slate-800/50 group">
                <div className="w-12 h-12 rounded-lg bg-[#1D4ED8]/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-[#1D4ED8]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-lg">B.Sc. Software Engineering</h3>
                    <button className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition"><Pencil className="w-4 h-4" /></button>
                  </div>
                  <div className="text-[#FBBF24] mb-1">Islamic University of Gaza</div>
                  <div className="text-slate-400 text-sm flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3.5 h-3.5" /> 2015 - 2019
                  </div>
                  <p className="text-slate-300 text-sm">Graduated with Honors. GPA: 3.8/4.0</p>
                </div>
              </div>
            </section>
          </div>

          {/* Side Column */}
          <div className="space-y-8">
            
            {/* Skills */}
            <section className="bg-[#1E293B] rounded-xl border border-slate-700 p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#FBBF24] rounded-full"></span>
                  Skills
                </h2>
                <button className="text-slate-400 hover:text-white transition p-1"><Plus className="w-5 h-5" /></button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: "React / Next.js", level: 90 },
                  { name: "Node.js / Express", level: 85 },
                  { name: "TypeScript", level: 85 },
                  { name: "Python", level: 70 },
                  { name: "PostgreSQL", level: 80 },
                  { name: "Tailwind CSS", level: 95 }
                ].map((skill, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-200 font-medium">{skill.name}</span>
                      <span className="text-slate-500 opacity-0 group-hover:opacity-100 transition">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#1D4ED8] h-2 rounded-full" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="flex flex-wrap gap-2">
                  {["Docker", "AWS", "GraphQL", "MongoDB", "Figma", "Git"].map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-medium border border-slate-700">
                      {tag}
                    </span>
                  ))}
                  <button className="px-3 py-1 bg-slate-800/50 border border-dashed border-slate-600 text-slate-400 rounded-full text-xs font-medium hover:bg-slate-700 hover:text-white transition">
                    + Add Skill
                  </button>
                </div>
              </div>
            </section>

            {/* Languages */}
            <section className="bg-[#1E293B] rounded-xl border border-slate-700 p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#FBBF24] rounded-full"></span>
                  Languages
                </h2>
                <button className="text-slate-400 hover:text-white transition p-1"><Plus className="w-5 h-5" /></button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#1D4ED8]/20 flex items-center justify-center text-[#1D4ED8]">
                      <Languages className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">Arabic</div>
                      <div className="text-slate-400 text-xs font-['Cairo']">العربية</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded text-xs font-bold uppercase tracking-wide">Native</span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-slate-300">
                      <Languages className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">English</div>
                      <div className="text-slate-400 text-xs">الإنجليزية</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-700 text-slate-300 rounded text-xs font-bold uppercase tracking-wide">Fluent</span>
                </div>
              </div>
            </section>

            {/* CV / Documents */}
            <section className="bg-[#1E293B] rounded-xl border border-slate-700 p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#FBBF24] rounded-full"></span>
                  Resume / CV
                </h2>
              </div>
              
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-5 text-center hover:border-slate-400 hover:bg-slate-800/50 transition cursor-pointer group">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-[#1D4ED8]" />
                </div>
                <div className="text-white font-medium mb-1">omar-shafi-cv-2023.pdf</div>
                <div className="text-slate-400 text-xs mb-4">Updated 2 months ago • 2.4 MB</div>
                
                <div className="flex gap-2 justify-center">
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Replace
                  </button>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
