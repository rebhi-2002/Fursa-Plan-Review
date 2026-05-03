import React, { useState } from 'react';
import { AppLayout } from './_shared/AppLayout';
import { Building2, Calendar, Clock, ChevronRight, MessageSquare, Briefcase, Search, Star, AlertCircle } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';

// Mock data
const applications = [
  {
    id: 1,
    company: 'تك مينا (TechMena)',
    companyInitials: 'TM',
    titleEn: 'Senior Tech Lead',
    titleAr: 'قائد تقني أول',
    appliedDate: '2023-10-15',
    lastUpdated: '2 hours ago',
    status: 'Offer Received',
    statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    progress: 100,
    isHighlighted: true,
  },
  {
    id: 2,
    company: 'Gaza Sky Geeks',
    companyInitials: 'GSG',
    titleEn: 'Senior Frontend Developer',
    titleAr: 'مطور واجهات أمامية أول',
    appliedDate: '2023-10-18',
    lastUpdated: '1 day ago',
    status: 'Interview',
    statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    progress: 75,
    isHighlighted: false,
  },
  {
    id: 7,
    company: 'AppMakers',
    companyInitials: 'AM',
    titleEn: 'Mobile Developer (React Native)',
    titleAr: 'مطور هواتف محمولة',
    appliedDate: '2023-10-25',
    lastUpdated: '3 days ago',
    status: 'Interview',
    statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    progress: 75,
    isHighlighted: false,
  },
  {
    id: 3,
    company: 'StartupsPS',
    companyInitials: 'SPS',
    titleEn: 'Backend Engineer (Node.js)',
    titleAr: 'مهندس خلفية',
    appliedDate: '2023-10-20',
    lastUpdated: '2 days ago',
    status: 'Under Review',
    statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    progress: 50,
    isHighlighted: false,
  },
  {
    id: 6,
    company: 'TechPal',
    companyInitials: 'TP',
    titleEn: 'Project Manager',
    titleAr: 'مدير مشروع',
    appliedDate: '2023-10-22',
    lastUpdated: '1 week ago',
    status: 'Under Review',
    statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    progress: 50,
    isHighlighted: false,
  },
  {
    id: 4,
    company: 'Fursa Platform',
    companyInitials: 'FP',
    titleEn: 'Full Stack Developer',
    titleAr: 'مطور ويب متكامل',
    appliedDate: '2023-10-28',
    lastUpdated: 'Just now',
    status: 'Applied',
    statusColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    progress: 25,
    isHighlighted: false,
  },
  {
    id: 5,
    company: 'DesignHub',
    companyInitials: 'DH',
    titleEn: 'UI/UX Designer',
    titleAr: 'مصمم واجهات المستخدم',
    appliedDate: '2023-10-29',
    lastUpdated: '1 day ago',
    status: 'Applied',
    statusColor: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    progress: 25,
    isHighlighted: false,
  },
  {
    id: 8,
    company: 'BugFree Solutions',
    companyInitials: 'BF',
    titleEn: 'QA Automation Engineer',
    titleAr: 'مهندس ضمان الجودة',
    appliedDate: '2023-10-10',
    lastUpdated: '2 weeks ago',
    status: 'Rejected',
    statusColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    progress: 100,
    isHighlighted: false,
  },
];

const tabCounts = {
  All: 12,
  Applied: 5,
  'Under Review': 3,
  Interview: 2,
  Offer: 1,
  Rejected: 1,
};

const tabs = Object.keys(tabCounts);

export function Applications() {
  const [activeTab, setActiveTab] = useState('All');

  const filteredApps = activeTab === 'All' 
    ? applications 
    : applications.filter(app => {
        if (activeTab === 'Offer') return app.status === 'Offer Received';
        return app.status === activeTab;
      });

  return (
    <AppLayout role="seeker">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans" style={{ fontFamily: 'Outfit, Cairo, sans-serif' }}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Applications / <span className="font-arabic" style={{ fontFamily: 'Cairo' }}>طلباتي</span></h1>
            <p className="text-slate-400">Track and manage your job applications.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search applications..." 
                className="bg-slate-800/50 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8] focus:border-transparent w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex space-x-2 border-b border-slate-800 pb-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-t-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === tab 
                    ? 'text-white border-b-2 border-[#1D4ED8] bg-slate-800/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                }`}
              >
                {tab}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab 
                    ? 'bg-[#1D4ED8] text-white' 
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {tabCounts[tab as keyof typeof tabCounts]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div 
              key={app.id} 
              className={`relative rounded-xl border p-5 sm:p-6 transition-all duration-200 hover:shadow-lg ${
                app.isHighlighted 
                  ? 'border-[#FBBF24]/50 bg-gradient-to-br from-slate-800/80 to-slate-900 overflow-hidden' 
                  : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/60'
              }`}
            >
              {app.isHighlighted && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FBBF24] via-amber-500 to-yellow-600"></div>
                  <div className="absolute top-0 right-0 p-1.5 bg-gradient-to-bl from-[#FBBF24]/20 to-transparent rounded-bl-xl border-b border-l border-[#FBBF24]/10">
                    <Star className="h-4 w-4 text-[#FBBF24] fill-[#FBBF24]/50" />
                  </div>
                </>
              )}

              {/* Offer Banner */}
              {app.isHighlighted && (
                <div className="mb-4 bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#FBBF24] rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎉</span>
                    <span className="font-medium">You received an offer! / لقد تلقيت عرض عمل!</span>
                  </div>
                  <Button size="sm" className="bg-[#FBBF24] hover:bg-amber-500 text-slate-900 font-semibold border-none">
                    Review Offer
                  </Button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                
                {/* Logo & Company */}
                <div className="flex items-center gap-4 min-w-[240px]">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0 ${
                    app.isHighlighted 
                      ? 'bg-gradient-to-br from-[#1D4ED8] to-blue-900 text-white border border-blue-400/30 shadow-[0_0_15px_rgba(29,78,216,0.5)]' 
                      : 'bg-gradient-to-br from-slate-700 to-slate-800 text-slate-200 border border-slate-600'
                  }`}>
                    {app.companyInitials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white leading-tight flex flex-col gap-1">
                      <span>{app.titleEn}</span>
                      <span className="text-sm font-arabic text-slate-300" style={{ fontFamily: 'Cairo' }}>{app.titleAr}</span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{app.company}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Pipeline */}
                <div className="flex-1 w-full space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Badge variant="outline" className={`${app.statusColor} border font-medium px-2.5 py-0.5 rounded-full`}>
                      {app.status}
                    </Badge>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Applied: {app.appliedDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Updated: {app.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500 font-medium px-1">
                      <span className={app.progress >= 25 ? 'text-[#1D4ED8]' : ''}>Applied</span>
                      <span className={app.progress >= 50 ? 'text-[#1D4ED8]' : ''}>Review</span>
                      <span className={app.progress >= 75 ? 'text-[#1D4ED8]' : ''}>Interview</span>
                      <span className={app.progress >= 100 ? (app.status === 'Rejected' ? 'text-red-500' : 'text-green-500') : ''}>
                        {app.status === 'Rejected' ? 'Rejected' : 'Offer'}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          app.status === 'Rejected' 
                            ? 'bg-red-500' 
                            : app.isHighlighted ? 'bg-gradient-to-r from-[#1D4ED8] to-[#FBBF24]' : 'bg-[#1D4ED8]'
                        }`}
                        style={{ width: `${app.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-5">
                  <Button variant="outline" size="sm" className="flex-1 sm:w-full bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-9">
                    <Briefcase className="h-4 w-4 mr-2" />
                    View Job
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 sm:w-full bg-transparent border-slate-700 text-slate-300 hover:bg-[#1D4ED8]/10 hover:text-[#1D4ED8] hover:border-[#1D4ED8]/30 h-9">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
                
              </div>
            </div>
          ))}

          {filteredApps.length === 0 && (
            <div className="text-center py-12 px-4 border border-slate-800 rounded-xl bg-slate-800/20">
              <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No applications found</h3>
              <p className="text-slate-400">You haven't applied to any jobs with this status yet.</p>
              <Button className="mt-6 bg-[#1D4ED8] hover:bg-blue-600 text-white">
                Find Jobs
              </Button>
            </div>
          )}
        </div>

        {/* Info State */}
        <div className="mt-8 flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-sm text-slate-400">
            <AlertCircle className="h-4 w-4 text-[#1D4ED8]" />
            <span>Applications update every 24 hours. Keep your profile up to date to stand out!</span>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
