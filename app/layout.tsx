import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Funpic AI - AI Generated Photos & Photo Editor',
  description: 'Funpic AI is a free online photo editor and AI generated photo generator. You can edit & generate photos with AI.',
  applicationName: 'Funpic AI',
  authors: [
    { name: 'Nicotordev', url: 'https://www.linkedin.com/in/nicotordev/' },
  ],
  generator: 'Next JS',
  keywords: ['Free AI', 'photo editor', 'AI generated photos', 'image editing', 'free photo editor', 'online photo editor', 'image generator'],
  referrer: 'origin',
  themeColor: '#000000',
  colorScheme: 'dark',
  viewport: 'width=device-width, initial-scale=1',
  creator: 'NicotorDev',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://funpicai.nicotordev.com/',
  },
  icons: {
    icon: [{
      url: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png",
    }, {
      url: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png",
    }, {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      rel: "apple-touch-icon",
    }, {
      url: "/safari-pinned-tab.svg",
      rel: "mask-icon",
      color: "#000000",
    },{
      url: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },{
      url: "/android-chrome-384x384.png",
      sizes: "384x384",
      type: "image/png",
    },{
      url:"/mstile-150x150.png",
      sizes: "150x150",
      type: "image/png",
    },{
      url: "/favicon.ico",
      rel: "icon",
      type: "image/x-icon",
      sizes: "16x16",
    }]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    url: 'https://funpicai.nicotordev.com',
    title: 'Funpic AI - Edit and Generate Photos with AI',
    description: 'Experience the power of AI with Funpic AI. Edit, create, and enhance photos online with our free photo editor and AI-generated images.',
    siteName: 'Funpic AI',
    images: [{ url: 'https://cdn.nicotordev.com/files/fe150c04-6e32-4f87-9ce4-ce6aacb99072.webp' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
