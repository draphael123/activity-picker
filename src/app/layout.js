import './globals.css'
export const metadata = {
  title: 'Activity Picker',
  description: 'Track your interest in hobbies and activities',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
