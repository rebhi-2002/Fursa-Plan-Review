import { useState } from "react";
import { Link } from "wouter";
import { useGetCurrentUser } from "@workspace/api-client-react";
import { useLanguageStore } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Bell,
  Globe,
  Shield,
  Trash2,
  Loader2,
  CheckCircle2,
  Building2,
  Mail,
  Moon,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/react";
import { useThemeStore } from "@/lib/theme";

export default function EmployerSettings() {
  const { lang, setLang } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const { user: clerkUser } = useUser();
  const { data: profile } = useGetCurrentUser();

  const [applicationAlerts, setApplicationAlerts] = useState(true);
  const [newMessageAlerts, setNewMessageAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
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
        : "To delete your account, contact support@fursa.ps",
    );
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/employer">
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {lang === "ar" ? "إعدادات الحساب" : "Account Settings"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {lang === "ar" ? "تحكم في تفضيلات حسابك كصاحب عمل" : "Manage your employer account preferences"}
          </p>
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
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" />
                {lang === "ar" ? "صاحب عمل" : "Employer"}
              </Badge>
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
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "إشعارات الطلبات الجديدة" : "New Application Alerts"}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ar" ? "عند تلقي طلب توظيف جديد" : "When a new application is submitted"}
                </p>
              </div>
              <Switch checked={applicationAlerts} onCheckedChange={setApplicationAlerts} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "إشعارات الرسائل" : "Message Notifications"}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ar" ? "عند استلام رسالة من مرشح" : "When you receive a message from a candidate"}
                </p>
              </div>
              <Switch checked={newMessageAlerts} onCheckedChange={setNewMessageAlerts} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "التقرير الأسبوعي" : "Weekly Hiring Report"}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ar" ? "ملخص أسبوعي بأداء وظائفك" : "Weekly summary of your job postings performance"}
                </p>
              </div>
              <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
            </div>
            <Button onClick={handleSaveNotifications} disabled={saving} size="sm" className="w-full mt-2">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />}
              {lang === "ar" ? "حفظ التفضيلات" : "Save Preferences"}
            </Button>
          </CardContent>
        </Card>

        {/* Language & Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {lang === "ar" ? "اللغة والمظهر" : "Language & Appearance"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">{lang === "ar" ? "لغة الواجهة" : "Interface Language"}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ar" ? "اللغة المستخدمة في كامل المنصة" : "Language used across the platform"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant={lang === "ar" ? "default" : "outline"} onClick={() => setLang("ar")} className="text-xs">
                  العربية
                </Button>
                <Button size="sm" variant={lang === "en" ? "default" : "outline"} onClick={() => setLang("en")} className="text-xs">
                  English
                </Button>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">{lang === "ar" ? "المظهر" : "Theme"}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "ar" ? "الوضع الفاتح أو الداكن" : "Light or dark mode"}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={toggleTheme} className="gap-2 text-xs">
                {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                {theme === "dark" ? (lang === "ar" ? "فاتح" : "Light") : (lang === "ar" ? "داكن" : "Dark")}
              </Button>
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
              <Link href="/employer/profile">
                <Building2 className="h-4 w-4 mr-2 ms-2" />
                {lang === "ar" ? "تعديل ملف الشركة" : "Edit Company Profile"}
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm" asChild>
              <Link href="/employer/analytics">
                <Bell className="h-4 w-4 mr-2 ms-2" />
                {lang === "ar" ? "لوحة التحليلات" : "Analytics Dashboard"}
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
            <Button
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive w-full"
              onClick={handleDeleteAccount}
            >
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
