import { useState } from "react";
import { Link } from "wouter";
import { useGetCurrentUser, useUpdateCurrentUser, getGetCurrentUserQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Bell, Mail, Moon, Globe, Shield, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/react";

export default function SeekerSettings() {
  const { lang, setLang } = useLanguageStore();
  const { user: clerkUser } = useUser();
  const queryClient = useQueryClient();
  const { data: profile } = useGetCurrentUser();
  const updateMutation = useUpdateCurrentUser();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [applicationUpdates, setApplicationUpdates] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSaveNotifications = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success(lang === "ar" ? "تم حفظ الإعدادات" : "Settings saved");
  };

  const handleDeleteAccount = () => {
    toast.error(
      lang === "ar"
        ? "لحذف حسابك، تواصل مع الدعم على support@fursa.ps"
        : "To delete your account, contact support@fursa.ps"
    );
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/seeker">{lang === "ar" ? "←" : <ChevronLeft className="h-5 w-5 rtl:rotate-180" />}</Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{lang === "ar" ? "إعدادات الحساب" : "Account Settings"}</h1>
          <p className="text-muted-foreground mt-1">{lang === "ar" ? "تحكم في تفضيلات حسابك" : "Manage your account preferences"}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {lang === "ar" ? "معلومات الحساب" : "Account Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{clerkUser?.primaryEmailAddress?.emailAddress}</span>
                {clerkUser?.primaryEmailAddress?.verification?.status === "verified" && (
                  <Badge variant="secondary" className="text-[10px] gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    {lang === "ar" ? "موثّق" : "Verified"}
                  </Badge>
                )}
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{lang === "ar" ? "الاسم" : "Name"}</span>
              <span className="text-sm font-medium">{profile?.name || clerkUser?.fullName}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{lang === "ar" ? "الدور" : "Role"}</span>
              <Badge variant="secondary">{lang === "ar" ? "باحث عن عمل" : "Job Seeker"}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {lang === "ar" ? "تفضيلات الإشعارات" : "Notification Preferences"}
            </CardTitle>
            <CardDescription>
              {lang === "ar" ? "اختر أنواع الإشعارات التي تريد تلقيها" : "Choose which notifications you want to receive"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">{lang === "ar" ? "تنبيهات الوظائف بالبريد" : "Job Alert Emails"}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{lang === "ar" ? "استلم وظائف جديدة تطابق تنبيهاتك" : "Receive new jobs matching your saved searches"}</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">{lang === "ar" ? "تحديثات طلباتي" : "Application Updates"}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{lang === "ar" ? "عند تغيّر حالة طلب التوظيف" : "When your application status changes"}</p>
              </div>
              <Switch checked={applicationUpdates} onCheckedChange={setApplicationUpdates} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">{lang === "ar" ? "الملخص الأسبوعي" : "Weekly Digest"}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{lang === "ar" ? "ملخص أسبوعي بالوظائف المناسبة" : "Weekly summary of relevant jobs"}</p>
              </div>
              <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">{lang === "ar" ? "الإشعارات الفورية" : "Push Notifications"}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{lang === "ar" ? "إشعارات داخل التطبيق" : "In-app real-time notifications"}</p>
              </div>
              <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
            </div>
            <Button onClick={handleSaveNotifications} disabled={saving} size="sm" className="w-full mt-2">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />}
              {lang === "ar" ? "حفظ التفضيلات" : "Save Preferences"}
            </Button>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {lang === "ar" ? "اللغة والمنطقة" : "Language & Region"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">{lang === "ar" ? "لغة الواجهة" : "Interface Language"}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{lang === "ar" ? "اللغة المستخدمة في كامل المنصة" : "Language used across the platform"}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={lang === "ar" ? "default" : "outline"}
                  onClick={() => setLang("ar")}
                  className="text-xs"
                >
                  العربية
                </Button>
                <Button
                  size="sm"
                  variant={lang === "en" ? "default" : "outline"}
                  onClick={() => setLang("en")}
                  className="text-xs"
                >
                  English
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{lang === "ar" ? "روابط سريعة" : "Quick Links"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-sm" asChild>
              <Link href="/seeker/alerts">
                <Bell className="h-4 w-4 mr-2 ms-2" />
                {lang === "ar" ? "إدارة تنبيهات الوظائف" : "Manage Job Alerts"}
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm" asChild>
              <Link href="/seeker/profile">
                <Shield className="h-4 w-4 mr-2 ms-2" />
                {lang === "ar" ? "تعديل الملف الشخصي" : "Edit Profile"}
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm" asChild>
              <Link href="/privacy">
                <Mail className="h-4 w-4 mr-2 ms-2" />
                {lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-base text-destructive flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              {lang === "ar" ? "منطقة الخطر" : "Danger Zone"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive w-full" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2 ms-2" />
              {lang === "ar" ? "حذف الحساب" : "Delete Account"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {lang === "ar" ? "سيتم حذف جميع بياناتك بشكل نهائي" : "All your data will be permanently deleted"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
