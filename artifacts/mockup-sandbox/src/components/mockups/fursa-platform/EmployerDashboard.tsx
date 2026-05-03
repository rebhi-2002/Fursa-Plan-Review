import React from "react";
import { AppLayout } from "./_shared/AppLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase, Users, Clock, CheckCircle2, Download, Plus, ChevronRight, BarChart } from "lucide-react";

export function EmployerDashboard() {
  return (
    <AppLayout role="employer">
      <div className="space-y-8 p-6 text-slate-900 bg-slate-50 min-h-screen font-['Outfit',_'Cairo',_sans-serif]" dir="ltr">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              TechBridge Gaza <span className="text-slate-400 font-normal">/</span> <span dir="rtl" className="font-['Cairo']">تك بريدج غزة</span>
            </h1>
            <p className="text-slate-500 mt-1">Welcome back. Here's what's happening with your job postings today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 text-slate-700 border-slate-200">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
            <Button className="bg-[#1D4ED8] hover:bg-blue-800 text-white gap-2 border-none">
              <Plus className="w-4 h-4" />
              Post New Job
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-100 shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-[#1D4ED8] rounded-lg">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Active Jobs</p>
                <h3 className="text-2xl font-bold text-slate-900">5</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-100 shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-[#FBBF24] rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Applicants</p>
                <h3 className="text-2xl font-bold text-slate-900">87</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-100 shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Reviews Pending</p>
                <h3 className="text-2xl font-bold text-slate-900">23</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-100 shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Hires This Month</p>
                <h3 className="text-2xl font-bold text-slate-900">3</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Active Job Posts */}
            <Card className="border-slate-100 shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-900">Active Job Posts</CardTitle>
                  <Button variant="ghost" size="sm" className="text-[#1D4ED8] hover:text-blue-800 hover:bg-blue-50">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b-slate-100">
                      <TableHead className="w-[300px] text-slate-500">Job Title</TableHead>
                      <TableHead className="text-slate-500">Date Posted</TableHead>
                      <TableHead className="text-center text-slate-500">Applicants</TableHead>
                      <TableHead className="text-slate-500">Status</TableHead>
                      <TableHead className="text-right text-slate-500">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { titleEn: "Senior Frontend Engineer", titleAr: "مهندس واجهات أمامية", date: "Oct 24, 2024", applicants: 32, status: "Active" },
                      { titleEn: "UX/UI Designer", titleAr: "مصمم واجهات وتجربة مستخدم", date: "Oct 20, 2024", applicants: 18, status: "Active" },
                      { titleEn: "Project Manager", titleAr: "مدير مشروع", date: "Oct 15, 2024", applicants: 45, status: "Paused" },
                      { titleEn: "Marketing Specialist", titleAr: "أخصائي تسويق", date: "Oct 01, 2024", applicants: 64, status: "Closed" },
                    ].map((job, i) => (
                      <TableRow key={i} className="border-b-slate-100 hover:bg-slate-50">
                        <TableCell>
                          <div className="font-medium text-slate-900">{job.titleEn}</div>
                          <div className="text-sm text-slate-500 font-['Cairo'] mt-0.5">{job.titleAr}</div>
                        </TableCell>
                        <TableCell className="text-slate-500 text-sm">{job.date}</TableCell>
                        <TableCell className="text-center font-medium text-slate-700">{job.applicants}</TableCell>
                        <TableCell>
                          <Badge variant={job.status === "Active" ? "default" : job.status === "Paused" ? "secondary" : "outline"}
                            className={
                              job.status === "Active" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-none font-normal" :
                              job.status === "Paused" ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200 shadow-none font-normal" :
                              "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200 shadow-none font-normal"
                            }>
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-[#1D4ED8] hover:bg-blue-50">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Hiring Pipeline Chart */}
            <Card className="border-slate-100 shadow-sm bg-white">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-slate-400" /> Hiring Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-medium text-slate-800">Senior Frontend Engineer</span>
                      <span className="text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full text-xs">32 Total</span>
                    </div>
                    <div className="flex h-8 rounded-lg overflow-hidden bg-slate-50 w-full relative ring-1 ring-inset ring-slate-200/50">
                      <div className="bg-[#1D4ED8]/10 h-full flex items-center justify-center text-xs font-semibold text-[#1D4ED8] border-r border-white/50" style={{ width: '40%' }}>13 Rec.</div>
                      <div className="bg-[#1D4ED8]/40 h-full flex items-center justify-center text-xs font-semibold text-[#1D4ED8] border-r border-white/50" style={{ width: '30%' }}>10 Rev.</div>
                      <div className="bg-[#1D4ED8]/70 h-full flex items-center justify-center text-xs font-semibold text-white border-r border-white/50" style={{ width: '20%' }}>6 Short.</div>
                      <div className="bg-[#1D4ED8] h-full flex items-center justify-center text-xs font-semibold text-white" style={{ width: '10%' }}>3 Int.</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-medium text-slate-800">UX/UI Designer</span>
                      <span className="text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full text-xs">18 Total</span>
                    </div>
                    <div className="flex h-8 rounded-lg overflow-hidden bg-slate-50 w-full relative ring-1 ring-inset ring-slate-200/50">
                      <div className="bg-[#1D4ED8]/10 h-full flex items-center justify-center text-xs font-semibold text-[#1D4ED8] border-r border-white/50" style={{ width: '50%' }}>9 Rec.</div>
                      <div className="bg-[#1D4ED8]/40 h-full flex items-center justify-center text-xs font-semibold text-[#1D4ED8] border-r border-white/50" style={{ width: '25%' }}>4 Rev.</div>
                      <div className="bg-[#1D4ED8]/70 h-full flex items-center justify-center text-xs font-semibold text-white border-r border-white/50" style={{ width: '15%' }}>3 Short.</div>
                      <div className="bg-[#1D4ED8] h-full flex items-center justify-center text-xs font-semibold text-white" style={{ width: '10%' }}>2 Int.</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-5 mt-8 pt-5 border-t border-slate-100 text-[13px] font-medium text-slate-600 justify-center">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#1D4ED8]/10 ring-1 ring-inset ring-black/5"></div> Received</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#1D4ED8]/40 ring-1 ring-inset ring-black/5"></div> Reviewed</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#1D4ED8]/70 ring-1 ring-inset ring-black/5"></div> Shortlisted</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#1D4ED8]"></div> Interviewed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {/* Recent Applicants */}
            <Card className="border-slate-100 shadow-sm h-full bg-white flex flex-col">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-900">Recent Applicants</CardTitle>
                  <Button variant="ghost" size="sm" className="text-[#1D4ED8] hover:text-blue-800 hover:bg-blue-50">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <div className="divide-y divide-slate-100 h-full">
                  {[
                    { name: "محمد أحمد", init: "م.أ", role: "Frontend Eng", date: "2h ago", status: "Pending", color: "from-blue-500 to-indigo-500" },
                    { name: "سارة محمود", init: "س.م", role: "UX Designer", date: "5h ago", status: "Shortlisted", color: "from-[#FBBF24] to-orange-500" },
                    { name: "أحمد حسن", init: "أ.ح", role: "Project Manager", date: "1d ago", status: "Rejected", color: "from-slate-400 to-slate-500" },
                    { name: "نور الدين", init: "ن.د", role: "Frontend Eng", date: "1d ago", status: "Pending", color: "from-emerald-400 to-teal-500" },
                    { name: "ليلى جمال", init: "ل.ج", role: "Marketing", date: "2d ago", status: "Shortlisted", color: "from-purple-500 to-pink-500" },
                  ].map((applicant, i) => (
                    <div key={i} className="p-4 flex items-start gap-4 hover:bg-slate-50/80 transition-colors">
                      <Avatar className="w-11 h-11 border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <div className={`w-full h-full bg-gradient-to-br ${applicant.color} flex items-center justify-center text-white font-bold font-['Cairo'] text-sm`}>
                          {applicant.init}
                        </div>
                      </Avatar>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-slate-900 font-['Cairo'] text-[15px] truncate">{applicant.name}</h4>
                          <span className="text-xs font-medium text-slate-400 shrink-0">{applicant.date}</span>
                        </div>
                        <div className="text-[13px] font-medium text-slate-500 mb-2.5 truncate">{applicant.role}</div>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="outline" 
                            className={
                              applicant.status === "Pending" ? "bg-slate-100 text-slate-600 border-slate-200 text-[10px] px-2 py-0.5 shadow-none font-medium" :
                              applicant.status === "Shortlisted" ? "bg-blue-50 text-[#1D4ED8] border-blue-200 text-[10px] px-2 py-0.5 shadow-none font-medium" :
                              "bg-rose-50 text-rose-600 border-rose-200 text-[10px] px-2 py-0.5 shadow-none font-medium"
                            }>
                            {applicant.status}
                          </Badge>
                          <Button variant="ghost" size="sm" className="h-7 text-xs font-medium text-[#1D4ED8] hover:text-blue-800 hover:bg-blue-50 px-3 rounded-md">Review</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default EmployerDashboard;