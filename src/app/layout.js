
import "./globals.css"
import AuthGate from "./AuthGate"
import Script from "next/script"

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

        {/* OneSignal SDK */}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />

        {/* OneSignal Init */}
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];

            OneSignalDeferred.push(async function(OneSignal) {

              await OneSignal.init({
                appId: "cea0d2bd-0c2f-4126-85dc-b404c3482341",
                notifyButton: { enable: true }
              });

              /* ================= HANDLE NOTIFICATION CLICK ================= */

              OneSignal.Notifications.addEventListener("click", function(event) {

                const data = event.notification.additionalData;

                if (data && data.type === "task" && data.taskId) {

                  console.log("Opening task:", data.taskId);

                  window.location.href = "/task/" + data.taskId;

                }

              });

            });
          `}
        </Script>

      </body>
    </html>
  )
    }
