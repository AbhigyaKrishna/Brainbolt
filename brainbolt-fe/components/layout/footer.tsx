import Link from "next/link";
import { Brain, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t-2 border-t-foreground bg-background min-w-0">
      <div className="container py-8 px-4 sm:px-6 max-w-[1920px]">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 font-semibold mb-1">
              <Brain className="h-5 w-5 text-primary" />
              <span>BrainBolt</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Adaptive quiz platform that grows with you.
            </p>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm mb-1">Product</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/quiz"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Play Quiz
              </Link>
              <Link
                href="/leaderboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Leaderboard
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm mb-1">Resources</h3>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                API
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Support
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm mb-1">Legal</h3>
            <div className="flex flex-col gap-2">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t-2 border-t-foreground pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} BrainBolt. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/AbhigyaKrishna/Brainbolt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
