import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useT } from "@/lib/i18n";

export default function NotFound() {
  const t = useT();

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border/50 shadow-sm">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-destructive/10 p-3 rounded-full">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-3">
            {t("notFound.title")}
          </h2>
          <p className="text-muted-foreground mb-6">{t("notFound.desc")}</p>
          <Button asChild size="lg" className="w-full">
            <Link href="/">{t("notFound.home")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
