import Link from 'next/link';
import './globals.css';

export const metadata = { title: 'JSA Play | Jaffna Sports Academy', description: 'Indoor court booking for Jaffna Sports Academy' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <Link href="/" className="brand">JSA Play</Link>
          <nav><Link href="/">Book a slot</Link><Link href="/admin/login">Admin login</Link></nav>
        </header>
        <main className="wrap">{children}</main>
      </body>
    </html>
  );
}
