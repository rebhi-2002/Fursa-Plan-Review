import React from 'react';
import { 
  Briefcase, 
  Building2, 
  Users, 
  ArrowRight,
  UserPlus,
  FileText,
  CheckCircle,
  Monitor,
  HardHat,
  Stethoscope,
  GraduationCap,
  PieChart,
  PenTool,
  Megaphone,
  Truck,
  Star,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ backgroundColor: '#0F172A', color: 'white', minHeight: '100dvh', overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        
        .font-sans {
          font-family: 'Outfit', sans-serif;
        }
        
        .font-arabic {
          font-family: 'Cairo', sans-serif;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .gradient-text-gold {
          background: linear-gradient(135deg, #FDE68A 0%, #FBBF24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .hero-bg {
          background: radial-gradient(circle at top right, rgba(29, 78, 216, 0.15), transparent 40%),
                      radial-gradient(circle at bottom left, rgba(251, 191, 36, 0.1), transparent 40%);
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        
        .float-animation-delayed {
          animation: float 6s ease-in-out 3s infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}} />

      <div className="font-sans">
        {/* Navigation */}
        <nav className="fixed w-full z-50 glass-card border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center font-bold text-xl">
                ف
              </div>
              <span className="text-2xl font-bold tracking-tight">Fursa</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#" className="hover:text-white transition-colors">Find Jobs</a>
              <a href="#" className="hover:text-white transition-colors">Companies</a>
              <a href="#" className="hover:text-white transition-colors">About Us</a>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-sm font-medium hover:text-white transition-colors">Log In</button>
              <button style={{ backgroundColor: '#1D4ED8' }} className="px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 hero-bg overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Empowering Gaza's Future
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                  <span className="block mb-2 text-white">Your Next</span>
                  <span className="block gradient-text mb-4">Opportunity</span>
                  <span className="block text-white">Starts Here</span>
                </h1>
                
                <h2 className="text-3xl lg:text-5xl font-arabic font-bold text-slate-400 mb-8" dir="rtl">
                  فرصتك التالية <span className="gradient-text-gold">تبدأ هنا</span>
                </h2>
                
                <p className="text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
                  Connecting world-class talent from Gaza with global opportunities. Build your career, grow your team, shape the future.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button style={{ backgroundColor: '#1D4ED8' }} className="px-8 py-4 rounded-xl font-medium hover:bg-blue-600 transition-all flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(29,78,216,0.3)] hover:shadow-[0_0_40px_rgba(29,78,216,0.5)]">
                    <span>Find Jobs</span>
                    <span className="font-arabic border-l border-white/20 pl-2 ml-2">ابحث عن وظائف</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="px-8 py-4 rounded-xl font-medium border border-slate-700 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                    <span>Post a Job</span>
                    <span className="font-arabic border-l border-white/20 pl-2 ml-2">انشر وظيفة</span>
                  </button>
                </div>
              </div>

              {/* Decorative Hero Visuals */}
              <div className="relative h-[500px] hidden lg:block">
                {/* Abstract shape representing connection/globe */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-blue-500/20 shadow-[inset_0_0_100px_rgba(29,78,216,0.2)]">
                  <div className="absolute inset-4 rounded-full border border-yellow-500/20 rotate-45"></div>
                  <div className="absolute inset-8 rounded-full border border-blue-400/20 -rotate-12"></div>
                </div>

                {/* Stat Badges */}
                <div className="absolute top-10 left-10 glass-card p-4 rounded-2xl float-animation flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Briefcase className="text-blue-400 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">2,400+</div>
                    <div className="text-sm text-slate-400">Active Jobs</div>
                  </div>
                </div>

                <div className="absolute top-1/2 right-0 glass-card p-4 rounded-2xl float-animation-delayed flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Building2 className="text-yellow-400 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">850+</div>
                    <div className="text-sm text-slate-400">Companies</div>
                  </div>
                </div>

                <div className="absolute bottom-10 left-20 glass-card p-4 rounded-2xl float-animation flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Users className="text-purple-400 w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">12k+</div>
                    <div className="text-sm text-slate-400">Job Seekers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-[#0B1120]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4">How It Works <span className="font-arabic font-normal text-slate-400 mx-2">كيف تعمل المنصة</span></h3>
              <p className="text-slate-400 max-w-2xl mx-auto">Your journey to the perfect opportunity is just three steps away.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-blue-900 via-yellow-900 to-blue-900"></div>
              
              <div className="relative text-center">
                <div className="w-24 h-24 mx-auto bg-[#0F172A] border-2 border-blue-900 rounded-full flex items-center justify-center mb-6 z-10 relative shadow-[0_0_30px_rgba(29,78,216,0.15)]">
                  <UserPlus className="w-10 h-10 text-blue-500" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm border-4 border-[#0F172A]">1</div>
                </div>
                <h4 className="text-xl font-bold mb-2">Sign Up</h4>
                <h5 className="font-arabic text-slate-400 mb-4" dir="rtl">سجل حسابك</h5>
                <p className="text-sm text-slate-500 leading-relaxed">Create your account in seconds. Choose between a job seeker or employer profile.</p>
              </div>

              <div className="relative text-center">
                <div className="w-24 h-24 mx-auto bg-[#0F172A] border-2 border-yellow-900 rounded-full flex items-center justify-center mb-6 z-10 relative shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                  <FileText className="w-10 h-10 text-yellow-500" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-yellow-500 text-[#0F172A] flex items-center justify-center font-bold text-sm border-4 border-[#0F172A]">2</div>
                </div>
                <h4 className="text-xl font-bold mb-2">Build Profile</h4>
                <h5 className="font-arabic text-slate-400 mb-4" dir="rtl">أنشئ ملفك الشخصي</h5>
                <p className="text-sm text-slate-500 leading-relaxed">Highlight your skills, experience, and portfolio to stand out to top companies.</p>
              </div>

              <div className="relative text-center">
                <div className="w-24 h-24 mx-auto bg-[#0F172A] border-2 border-blue-900 rounded-full flex items-center justify-center mb-6 z-10 relative shadow-[0_0_30px_rgba(29,78,216,0.15)]">
                  <CheckCircle className="w-10 h-10 text-blue-500" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm border-4 border-[#0F172A]">3</div>
                </div>
                <h4 className="text-xl font-bold mb-2">Get Hired</h4>
                <h5 className="font-arabic text-slate-400 mb-4" dir="rtl">احصل على الوظيفة</h5>
                <p className="text-sm text-slate-500 leading-relaxed">Apply to jobs, attend interviews, and land your dream role with global employers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h3 className="text-3xl font-bold mb-2">Featured Categories</h3>
                <h4 className="font-arabic text-xl text-slate-400" dir="rtl">التصنيفات المميزة</h4>
              </div>
              <button className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group">
                Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { icon: Monitor, en: 'Technology', ar: 'تكنولوجيا المعلومات', color: 'blue', jobs: '450+' },
                { icon: HardHat, en: 'Engineering', ar: 'هندسة', color: 'yellow', jobs: '320+' },
                { icon: Stethoscope, en: 'Healthcare', ar: 'رعاية صحية', color: 'emerald', jobs: '210+' },
                { icon: GraduationCap, en: 'Education', ar: 'تعليم', color: 'purple', jobs: '180+' },
                { icon: PieChart, en: 'Finance', ar: 'مالية ومحاسبة', color: 'indigo', jobs: '150+' },
                { icon: PenTool, en: 'Design', ar: 'تصميم', color: 'pink', jobs: '280+' },
                { icon: Megaphone, en: 'Marketing', ar: 'تسويق', color: 'orange', jobs: '190+' },
                { icon: Truck, en: 'Logistics', ar: 'خدمات لوجستية', color: 'cyan', jobs: '120+' },
              ].map((cat, i) => (
                <div key={i} className="glass-card p-6 rounded-2xl hover:bg-slate-800/50 transition-all cursor-pointer group border border-slate-800 hover:border-slate-600">
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-${cat.color}-500/10 text-${cat.color}-400 group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold mb-1">{cat.en}</h4>
                  <div className="font-arabic text-sm text-slate-400 mb-4" dir="rtl">{cat.ar}</div>
                  <div className="text-xs text-slate-500 font-medium">{cat.jobs} Jobs</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-[#0B1120]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4">Success Stories <span className="font-arabic font-normal text-slate-400 mx-2">قصص نجاح</span></h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Ahmad M.',
                  arName: 'أحمد م.',
                  role: 'Software Engineer at TechCorp',
                  quote: 'Fursa opened doors I never thought possible. I am now working remotely with a top-tier European company.',
                  arQuote: 'فتحت لي منصة فرصة أبواباً لم أتخيلها. أعمل الآن عن بعد مع شركة أوروبية رائدة.'
                },
                {
                  name: 'Sarah K.',
                  arName: 'سارة ك.',
                  role: 'UX Designer',
                  quote: 'The platform is intuitive and focuses on real talent. My portfolio got noticed within a week of signing up.',
                  arQuote: 'المنصة سهلة الاستخدام وتركز على المواهب الحقيقية. تم ملاحظة معرض أعمالي خلال أسبوع من التسجيل.'
                },
                {
                  name: 'TechFlow Inc',
                  arName: 'شركة تك فلو',
                  role: 'Employer',
                  quote: 'We found incredible, dedicated talent in Gaza through Fursa. The hiring process was seamless.',
                  arQuote: 'وجدنا مواهب مذهلة ومتفانية في غزة من خلال فرصة. كانت عملية التوظيف سلسة للغاية.'
                }
              ].map((test, i) => (
                <div key={i} className="glass-card p-8 rounded-3xl relative">
                  <div className="flex gap-1 mb-6 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <p className="text-slate-300 mb-4 italic leading-relaxed">"{test.quote}"</p>
                  <p className="font-arabic text-slate-400 mb-8 italic leading-relaxed" dir="rtl">"{test.arQuote}"</p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center font-bold">
                      {test.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{test.name} <span className="font-arabic text-slate-400 ml-1 font-normal text-sm">({test.arName})</span></div>
                      <div className="text-sm text-slate-500">{test.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative rounded-[2.5rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-[#0F172A]"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
              
              <div className="relative z-10 p-12 md:p-20 text-center">
                <h3 className="text-4xl md:text-5xl font-bold mb-6">Join 12,000+ professionals</h3>
                <h4 className="text-2xl md:text-3xl font-arabic text-slate-300 mb-10" dir="rtl">انضم إلى أكثر من 12,000 محترف</h4>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button style={{ backgroundColor: '#1D4ED8' }} className="px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-all shadow-[0_0_30px_rgba(29,78,216,0.5)]">
                    Create Your Profile
                  </button>
                  <button style={{ backgroundColor: '#FBBF24', color: '#0F172A' }} className="px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all">
                    Hire Talent
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0B1120] border-t border-white/5 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
              <div className="col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center font-bold text-lg">
                    ف
                  </div>
                  <span className="text-xl font-bold tracking-tight">Fursa</span>
                </div>
                <p className="text-slate-400 mb-6 max-w-sm">
                  Connecting Gaza's exceptional talent with global opportunities. Bridging the gap between potential and success.
                </p>
                <div className="flex gap-4">
                  <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Github className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div>
                <h5 className="font-bold mb-4">Candidates</h5>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Find Jobs</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Browse Companies</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Career Advice</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Create Profile</a></li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-bold mb-4">Employers</h5>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Post a Job</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Search Resumes</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">HR Resources</a></li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-bold mb-4">Fursa (فرصة)</h5>
                <ul className="space-y-3 text-slate-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
              <p>© 2024 Fursa Platform. All rights reserved.</p>
              <div className="flex gap-4 font-arabic" dir="rtl">
                <span>صنع في غزة</span>
                <span>•</span>
                <span>Made in Gaza</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
