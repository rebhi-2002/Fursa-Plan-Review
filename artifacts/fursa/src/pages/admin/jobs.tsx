import { useState } from "react";
import { Link } from "wouter";
import { 
  useListAdminJobs, 
  useApproveJob, 
  useRejectJob,
  getListAdminJobsQueryKey,
  getGetAdminDashboardQueryKey
} from "@workspace/api-client-react";
import { ListAdminJobsStatus } from "@workspace/api-client-react";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Briefcase, CheckCircle2, XCircle, Clock, ChevronLeft, Building2, MapPin, Loader2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLanguageStore } from "@/lib/i18n";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminJobs() {
  const t = useT();
  const { lang } = useLanguageStore();
  const locale = lang === "ar" ? ar : enUS;
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<ListAdminJobsStatus | "">("pending");
  const [rejectReason, setRejectReason] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const { data: jobs, isLoading } = useListAdminJobs({
    status: statusFilter || undefined
  });

  const approveMutation = useApproveJob({
    mutation: {
      onSuccess: () => {
        toast.success("تم اعتماد الوظيفة بنجاح ونشرها على المنصة");
        queryClient.invalidateQueries({ queryKey: getListAdminJobsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminDashboardQueryKey() });
      }
    }
  });

  const rejectMutation = useRejectJob({
    mutation: {
      onSuccess: () => {
        toast.success("تم رفض الوظيفة");
        setIsRejectOpen(false);
        setRejectReason("");
        setSelectedJobId(null);
        queryClient.invalidateQueries({ queryKey: getListAdminJobsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminDashboardQueryKey() });
      }
    }
  });

  const handleApprove = (id: number) => {
    approveMutation.mutate({ data: { id } });
  };

  const handleReject = () => {
    if (selectedJobId && rejectReason.trim().length >= 5) {
      rejectMutation.mutate({ 
        data: { id: selectedJobId, data: { reason: rejectReason } } 
      });
    } else {
      toast.error("يرجى كتابة سبب الرفض (5 أحرف على الأقل)");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"><CheckCircle2 className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0" /> معتمد</Badge>;
      case 'rejected': return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"><XCircle className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0" /> مرفوض</Badge>;
      default: return <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200"><Clock className="h-3 w-3 ml-1 rtl:mr-1 rtl:ml-0" /> بانتظار المراجعة</Badge>;
    }
  };

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full hidden sm:flex">
            <Link href="/admin">
              <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">مراجعة الوظائف</h1>
            <p className="text-muted-foreground mt-1">مراجعة واعتماد الوظائف المنشورة على المنصة</p>
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
          <SelectTrigger className="w-full sm:w-[200px] bg-background">
            <SelectValue placeholder="تصفية حسب الحالة" />
          </SelectTrigger>
          <SelectContent dir={lang === "ar" ? "rtl" : "ltr"}>
            <SelectItem value="">الكل</SelectItem>
            <SelectItem value="pending">بانتظار المراجعة</SelectItem>
            <SelectItem value="approved">المعتمدة</SelectItem>
            <SelectItem value="rejected">المرفوضة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))
        ) : jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} className={`border-border/50 ${job.status === 'pending' ? 'border-l-4 rtl:border-r-4 rtl:border-l-0 border-l-amber-500 rtl:border-r-amber-500' : ''}`}>
              <CardContent className="p-5 flex flex-col md:flex-row gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(job.status)}
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">{job.category}</Badge>
                      </div>
                      <h3 className="text-xl font-bold">{job.title}</h3>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-3 rounded-lg grid sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Building2 className="h-4 w-4 mr-2 ms-2" />
                      <span className="font-medium text-foreground">{job.employerName}</span>
                    </div>
                    <div className="text-muted-foreground truncate" dir="ltr" align="right">
                      {job.employerEmail}
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="line-clamp-2 text-muted-foreground leading-relaxed">{job.description}</p>
                  </div>
                  
                  {job.status === 'rejected' && job.rejectionReason && (
                    <div className="bg-red-50 text-red-800 text-sm p-3 rounded-md border border-red-100 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block mb-1">سبب الرفض:</span>
                        {job.rejectionReason}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3 md:w-48 shrink-0 border-t md:border-t-0 md:border-r rtl:md:border-l rtl:md:border-r-0 border-border/50 pt-4 md:pt-0 rtl:md:pl-6 md:pr-6">
                  <div className="text-xs text-center text-muted-foreground mb-1">
                    نُشر {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true, locale })}
                  </div>
                  
                  {job.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        className="w-full bg-green-600 hover:bg-green-700" 
                        onClick={() => handleApprove(job.id)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle2 className="mr-2 ms-2 h-4 w-4" />
                        اعتماد الوظيفة
                      </Button>
                      
                      <Dialog open={isRejectOpen && selectedJobId === job.id} onOpenChange={(open) => {
                        setIsRejectOpen(open);
                        if (!open) {
                          setRejectReason("");
                          setSelectedJobId(null);
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="w-full"
                            onClick={() => setSelectedJobId(job.id)}
                          >
                            <XCircle className="mr-2 ms-2 h-4 w-4" />
                            رفض
                          </Button>
                        </DialogTrigger>
                        <DialogContent dir={lang === "ar" ? "rtl" : "ltr"}>
                          <DialogHeader>
                            <DialogTitle>رفض الوظيفة: {job.title}</DialogTitle>
                            <DialogDescription>
                              يرجى توضيح سبب رفض هذه الوظيفة. سيتم إرسال هذا السبب إلى صاحب العمل.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>سبب الرفض <span className="text-destructive">*</span></Label>
                              <Textarea 
                                placeholder="اكتب سبب الرفض هنا بوضوح..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="min-h-[100px] resize-none"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>إلغاء</Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleReject}
                              disabled={rejectMutation.isPending || rejectReason.trim().length < 5}
                            >
                              {rejectMutation.isPending && <Loader2 className="mr-2 ms-2 h-4 w-4 animate-spin" />}
                              تأكيد الرفض
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  
                  {job.status === 'approved' && (
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href={`/jobs/${job.id}`}>
                        <ExternalLink className="mr-2 ms-2 h-4 w-4" />
                        عرض في المنصة
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-12 text-center flex flex-col items-center">
              <CheckCircle2 className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">لا توجد وظائف {statusFilter === 'pending' ? 'بانتظار المراجعة' : ''}</h3>
              <p className="text-muted-foreground">صندوق المراجعة فارغ في الوقت الحالي.</p>
              {statusFilter !== "" && (
                <Button variant="link" onClick={() => setStatusFilter("")} className="mt-4">
                  عرض كل الوظائف
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}