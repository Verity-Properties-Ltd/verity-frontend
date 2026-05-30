import type { Metadata } from 'next';
import '@verity/brand/tokens/index.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Verity',
  description: 'Property verification and transaction infrastructure for African real estate.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Mono:wght@300;400;500&family=Tenor+Sans&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
