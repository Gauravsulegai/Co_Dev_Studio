import './globals.css'

export const metadata = {
  title: 'Co-Dev-Studio',
  description: 'The collaborative space for developers.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}