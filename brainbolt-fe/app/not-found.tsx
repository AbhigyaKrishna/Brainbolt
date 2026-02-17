import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 text-center min-w-0">
      <div className="space-y-4 max-w-md">
        <div className="text-8xl font-bold text-primary">404</div>
        <h1 className="text-3xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="neutral" asChild>
            <Link href="/quiz">
              <Search className="mr-2 h-4 w-4" />
              Start Quiz
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
