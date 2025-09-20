import './globals.css'

// Use system fonts instead of Google Fonts for deployment
const inter = { className: 'font-sans' }

export const metadata = {
  title: 'Ubuntu Health - Production Platform',
  description: 'Decentralized healthcare infrastructure for Network States and global communities',
}

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