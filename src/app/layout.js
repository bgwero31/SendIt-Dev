import "./globals.css"
import AuthGate from "./AuthGate"

export const metadata = {
  title: "SendIt",
  description: "Errands handled. Time saved.",
  manifest: "/manifest.json",
  themeColor: "#fafafa",
  appleWebApp: {
    capable: true,
    title: "SendIt",
    statusBarStyle: "black-translucent",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#fafafa] antialiased">

        <AuthGate>
          {children}
        </AuthGate>

      </body>
    </html>
  )
}
