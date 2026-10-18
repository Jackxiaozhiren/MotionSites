export default function Footer() {
  return (
    <footer className="py-12 px-8 md:px-28 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-muted-foreground text-sm">
        &copy; 2026 Mindloop. All rights reserved.
      </p>
      <div className="flex items-center gap-6">
        <a
          href="#"
          className="text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          Privacy
        </a>
        <a
          href="#"
          className="text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          Terms
        </a>
        <a
          href="#"
          className="text-muted-foreground text-sm hover:text-foreground transition-colors"
        >
          Contact
        </a>
      </div>
    </footer>
  );
}
