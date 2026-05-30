import type { Metadata } from 'next';
import '@verity/brand/tokens/index.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Verity — Property verification for African real estate',
  description:
    'Verity is the property verification and transaction infrastructure for African real estate — building now, with founding partners. Coming to Lagos, 2026.',
  metadataBase: new URL('https://verity.properties'),
  openGraph: {
    type: 'website',
    url: 'https://verity.properties/',
    title: 'Verity — Property verification for African real estate',
    description: 'AI-augmented, analyst-verified title reports for Lagos properties. Coming 2026.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verity — Property verification for African real estate',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@400;500;700&family=Tenor+Sans&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
