import { Link, useLocation } from "wouter";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useListFeaturedJobs, useListJobCategories } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Briefcase, ChevronLeft, Building2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const t = useT();
  const { lang } = useLanguageStore();
  const [, setLocation] = useLocation();
  
  const { data: featuredJobs, isLoading: isLoadingJobs } = useListFeaturedJobs();
  const { data: categories, isLoading: isLoadingCats } = useListJobCategories();

  const locale = lang === "ar" ? ar : enUS;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q")?.toString().trim();
    if (query) {
      setLocation(`/jobs?search=${encodeURIComponent(query)}`);
    } else {
      setLocation(`/jobs`);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-20 md:py-32">
        <div className="container relative z-10 flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm rounded-full bg-primary/10 text-primary border-0">
            أكثر من مجرد منصة توظيف
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mb-6">
            اكتشف <span className="text-primary">فُرصة</span> للعمل والإبداع في غزة
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            نربط الكفاءات وأصحاب المهارات بالشركات وأصحاب الأعمال في غزة. 
            كل فرصة عمل هي خطوة نحو بناء مستقبل أفضل.
          </p>
          
          <div className="w-full max-w-2xl bg-background rounded-2xl shadow-lg border p-2">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Briefcase className="absolute right-4 text-muted-foreground h-5 w-5 rtl:left-auto rtl:right-4 ltr:left-4 ltr:right-auto" />
                <input 
                  name="q"
                  type="text" 
                  placeholder={t("jobs.search")}
                  className="w-full h-14 bg-transparent border-0 focus:ring-0 px-12 rtl:pl-4 ltr:pr-4 text-lg outline-none"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 text-lg rounded-xl">
                ابحث الآن
              </Button>
            </form>
          </div>
          
          <div className="mt-8 flex gap-4 text-sm text-muted-foreground">
            <span>شائع الآن:</span>
            <Link href="/jobs?category=برمجة وتطوير" className="hover:text-primary transition-colors hover:underline">برمجة وتطوير</Link>
            <Link href="/jobs?category=تصميم جرافيك" className="hover:text-primary transition-colors hover:underline">تصميم جرافيك</Link>
            <Link href="/jobs?category=تعليم" className="hover:text-primary transition-colors hover:underline">تعليم</Link>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/3 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">تصفح حسب المجال</h2>
              <p className="text-muted-foreground text-lg">اختر المجال الذي يناسب مهاراتك</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/jobs">عرض كل المجالات</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isLoadingCats ? (
              Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))
            ) : (
              categories?.slice(0, 10).map((cat) => (
                <Link key={cat.category} href={`/jobs?category=${encodeURIComponent(cat.category)}`}>
                  <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center text-center justify-center h-full gap-3">
                      <div className="font-semibold group-hover:text-primary transition-colors">
                        {cat.category}
                      </div>
                      <Badge variant="secondary" className="font-normal">
                        {cat.count} وظيفة
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/jobs">عرض كل المجالات</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">أحدث الفرص المميزة</h2>
              <p className="text-muted-foreground text-lg">وظائف تم اختيارها بعناية لتناسب كفاءاتك</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/jobs">تصفح كل الوظائف</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingJobs ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-[280px] w-full rounded-2xl" />
              ))
            ) : featuredJobs && featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <Card key={job.id} className="flex flex-col h-full hover:shadow-lg transition-shadow border-border/50">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 font-medium">
                        {job.category}
                      </Badge>
                      <Badge variant="outline" className="text-muted-foreground">
                        {t(`jobs.type.${job.type}`)}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-1 hover:text-primary transition-colors">
                      <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Building2 className="h-4 w-4 mr-2 ms-2 opacity-70" />
                        <span className="font-medium text-foreground/80">{job.employerName}</span>
                      </div>
                      {job.employerLocation && (
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4 mr-2 ms-2 opacity-70" />
                          <span>{job.employerLocation}</span>
                        </div>
                      )}
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="h-4 w-4 mr-2 ms-2 opacity-70" />
                        <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale })}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/jobs/${job.id}`}>{t("jobs.details")}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-background rounded-2xl border border-dashed">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">لا توجد وظائف مميزة حالياً</h3>
              </div>
            )}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/jobs">تصفح كل الوظائف</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="container relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">هل تبحث عن فرصتك التالية؟</h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            انضم إلى آلاف الكفاءات في غزة، قم ببناء ملفك الشخصي، وقدم على الفرص التي تناسب طموحك.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild className="text-primary font-bold px-8 h-14 text-lg">
              <Link href="/sign-up">إنشاء حساب جديد</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 h-14 text-lg">
              <Link href="/jobs">تصفح الوظائف</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}