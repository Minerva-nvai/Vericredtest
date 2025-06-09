export function Footer() {
  return (
    <footer className="mt-auto border-t">
      <div className="container py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} VeriCred. All rights reserved.
      </div>
    </footer>
  );
}
