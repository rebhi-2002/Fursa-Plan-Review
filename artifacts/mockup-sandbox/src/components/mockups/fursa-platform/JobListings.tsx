import React, { useState } from "react";
import { AppLayout } from "./_shared/AppLayout";
import { Search, MapPin, Briefcase, Filter, ChevronDown, Bookmark, ArrowRight, Star, Grid, List } from "lucide-react";

export function JobListings() {
  const [view, setView] = useState<"grid" | "list">("grid");

  const jobs = [
    {
      id: 1,
      titleEn: "Senior Frontend Developer",
      titleAr: "مطور واجهات أمامية أول",
      company: "TechNova Solutions",
      locationEn: "Gaza City (Remote)",
      locationAr: "مدينة غزة (عن بعد)",
      salary: "$1,200 - $2,500 / mo",
      type: "Full-time",
      match: 92,
      posted: "2 hours ago",
      featured: true,
      tags: ["React", "TypeScript", "Remote"],
      initials: "TN",
      gradient: "from-blue-600 to-indigo-600"
    },
    {
      id: 2,
      titleEn: "UX/UI Designer",
      titleAr: "مصمم واجهة وتجربة المستخدم",
      company: "Creative Minds Agency",
      locationEn: "Ramallah (Hybrid)",
      locationAr: "رام الله (هجين)",
      salary: "$900 - $1,500 / mo",
      type: "Contract",
      match: 85,
      posted: "5 hours ago",
      featured: false,
      tags: ["Figma", "UI/UX", "Contract"],
      initials: "CM",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      titleEn: "Backend Software Engineer",
      titleAr: "مهندس برمجيات خلفية",
      company: "Global Tech Hub",
      locationEn: "Remote",
      locationAr: "عن بعد",
      salary: "$1,500 - $3,000 / mo",
      type: "Full-time",
      match: 78,
      posted: "1 day ago",
      featured: false,
      tags: ["Node.js", "PostgreSQL", "AWS"],
      initials: "GT",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      id: 4,
      titleEn: "Mobile App Developer",
      titleAr: "مطور تطبيقات جوال",
      company: "Appify Me",
      locationEn: "Gaza City",
      locationAr: "مدينة غزة",
      salary: "$1,000 - $2,000 / mo",
      type: "Full-time",
      match: 88,
      posted: "1 day ago",
      featured: false,
      tags: ["Flutter", "Dart", "Mobile"],
      initials: "AM",
      gradient: "from-orange-500 to-red-500"
    },
    {
      id: 5,
      titleEn: "DevOps Engineer",
      titleAr: "مهندس عمليات التطوير",
      company: "Cloud Systems Inc.",
      locationEn: "Remote",
      locationAr: "عن بعد",
      salary: "$1,800 - $3,500 / mo",
      type: "Full-time",
      match: 75,
      posted: "2 days ago",
      featured: false,
      tags: ["Docker", "Kubernetes", "CI/CD"],
      initials: "CS",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      id: 6,
      titleEn: "Data Analyst",
      titleAr: "محلل بيانات",
      company: "DataMinds",
      locationEn: "Nablus (Remote)",
      locationAr: "نابلس (عن بعد)",
      salary: "$800 - $1,400 / mo",
      type: "Part-time",
      match: 65,
      posted: "3 days ago",
      featured: false,
      tags: ["Python", "SQL", "Tableau"],
      initials: "DM",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <AppLayout role="seeker">
      <div 
        className="min-h-screen text-slate-100 p-6 font-sans flex flex-col md:flex-row gap-8"
        style={{ backgroundColor: "#0F172A", fontFamily: "'Outfit', 'Cairo', sans-serif" }}
      >
        {/* Filter Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
          <div className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Filters <span className="text-sm font-normal text-slate-400 ml-1">تصفية</span></h2>
            </div>
            
            <div className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Job title, keywords..." 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium block">Category</label>
                <div className="relative">
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <option>All Categories</option>
                    <option>Technology</option>
                    <option>Engineering</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="City or region" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Job Type */}
              <div className="space-y-3">
                <label className="text-sm text-slate-300 font-medium block">Job Type</label>
                <div className="space-y-2">
                  {["Full-time", "Part-time", "Remote", "Contract"].map(type => (
                    <label key={type} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer sr-only" defaultChecked={type === "Full-time" || type === "Remote"} />
                        <div className="w-4 h-4 border border-slate-600 rounded bg-slate-900 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="group-hover:text-white transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm text-slate-300 font-medium block">Salary</label>
                  <span className="text-xs text-blue-400 font-medium">$500 - $3000+</span>
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full relative">
                  <div className="absolute left-1/4 right-1/4 top-0 bottom-0 bg-blue-500 rounded-full"></div>
                  <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow cursor-pointer border-2 border-blue-500"></div>
                  <div className="absolute right-1/4 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full shadow cursor-pointer border-2 border-blue-500"></div>
                </div>
              </div>

              <button 
                className="w-full py-2.5 rounded-lg font-medium text-sm transition-all shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
                style={{ backgroundColor: "#1D4ED8", color: "white" }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                Found 248 jobs <span className="text-slate-500 text-xl font-normal hidden sm:inline">|</span> <span className="text-lg text-slate-400 font-medium" style={{ fontFamily: "'Cairo', sans-serif" }}>تم العثور على ٢٤٨ وظيفة</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">Showing matching results based on your preferences</p>
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="relative">
                <select className="bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-8 py-2 text-sm text-white appearance-none focus:outline-none focus:border-blue-500">
                  <option>Newest First</option>
                  <option>Highest Salary</option>
                  <option>Best Match</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              
              <div className="flex bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setView("grid")}
                  className={`p-2 transition-colors ${view === "grid" ? "bg-slate-800 text-blue-400" : "text-slate-400 hover:text-white"}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setView("list")}
                  className={`p-2 transition-colors ${view === "list" ? "bg-slate-800 text-blue-400" : "text-slate-400 hover:text-white"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className={`grid gap-5 ${view === "grid" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"}`}>
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className={`relative flex flex-col bg-slate-800/40 border rounded-xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 group ${
                  job.featured 
                    ? "border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.1)]" 
                    : "border-slate-700/50 hover:border-blue-500/50"
                }`}
              >
                {/* Featured Badge */}
                {job.featured && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 z-10">
                    <Star className="w-3 h-3 fill-white" /> Sponsored
                  </div>
                )}
                
                <div className="p-5 flex-1 flex flex-col">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      {/* Logo */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${job.gradient} shadow-lg shrink-0`}>
                        {job.initials}
                      </div>
                      
                      {/* Title & Company */}
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                          {job.titleEn}
                        </h3>
                        <p className="text-sm text-slate-400 font-medium mb-1" style={{ fontFamily: "'Cairo', sans-serif" }} dir="rtl">
                          {job.titleAr}
                        </p>
                        <p className="text-sm text-slate-300">{job.company}</p>
                      </div>
                    </div>
                    
                    {/* Bookmark */}
                    <button className="text-slate-400 hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-slate-700/50">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Meta Details */}
                  <div className="grid grid-cols-2 gap-3 mb-5 mt-auto">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="truncate" title={job.locationEn}>{job.locationEn}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span className="truncate">{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 col-span-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.salary}
                    </div>
                  </div>
                  
                  {/* Tags & Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-700/50 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map(tag => (
                        <span key={tag} className="bg-slate-900 border border-slate-700 text-slate-300 text-xs px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-700">
                        {job.posted}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Bar */}
                <div className="bg-slate-900/50 px-5 py-3 border-t border-slate-700/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1 mr-1">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] text-green-400 font-bold">
                        {job.match}%
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400">Match score</span>
                  </div>
                  
                  <button 
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/20"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 backdrop-blur-sm">
              <button className="px-3 py-1 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-700">Prev</button>
              <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-md font-medium">1</button>
              <button className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white rounded-md font-medium transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white rounded-md font-medium transition-colors">3</button>
              <span className="text-slate-500 px-1">...</span>
              <button className="w-8 h-8 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white rounded-md font-medium transition-colors">24</button>
              <button className="px-3 py-1 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-700">Next</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
