import type { Metadata } from 'next'
import { Inter, Poppins, Sora, Dancing_Script } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sora',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-dancing',
})

export const metadata: Metadata = {
  title: '✨ Something Special ✨',
  description: 'You have been invited to something special...',
  openGraph: {
    title: '✨ A Secret Awaits ✨',
    description: 'Someone has something to tell you...',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} ${sora.variable} ${dancingScript.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
