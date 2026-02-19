import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import ConsultationForm from "@/components/ConsultationForm";

export default function Apply() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link to="/">
            <Button variant="ghost" size="sm" className="rounded-xl gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Launchpad Prep" className="h-7 w-7 rounded-lg object-contain" />
            <span className="font-serif text-sm text-foreground">Launchpad Prep</span>
          </div>
          <div className="w-[68px]" /> {/* spacer to center logo */}
        </div>
      </header>

      {/* Form fills remaining space */}
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10 md:py-14">
          <ConsultationForm />
        </div>

        <footer className="border-t py-4 text-center text-xs text-muted-foreground">
          Questions? Reach out at{" "}
          <a href="mailto:launchpadprep0@gmail.com" className="underline hover:text-foreground transition-colors">
            launchpadprep0@gmail.com
          </a>
        </footer>
      </main>
    </div>
  );
}
