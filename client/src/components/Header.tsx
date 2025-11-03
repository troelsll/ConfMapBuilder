import { MapPin, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background">
      <div className="container mx-auto h-full flex items-center justify-between px-6">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2 cursor-pointer">
            <MapPin className="w-6 h-6 text-primary" data-testid="icon-logo" />
            <div>
              <h1 className="text-xl font-bold text-foreground" data-testid="text-app-name">MapCon</h1>
              <p className="text-xs text-muted-foreground" data-testid="text-app-subtitle">Convention Maps Dashboard</p>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" data-testid="link-convention-maps">
            <Button
              variant={location === "/" ? "default" : "ghost"}
              data-testid="button-convention-maps"
            >
              Convention Maps
            </Button>
          </Link>
          <Link href="/admin" data-testid="link-admin">
            <Button
              variant={location === "/admin" ? "default" : "ghost"}
              data-testid="button-admin"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
