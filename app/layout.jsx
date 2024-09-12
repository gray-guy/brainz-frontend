import { NotificationContext } from "@/app/contexts/notification"
import "./globals.css"
import { Inter } from "next/font/google"
import Providers from "./Providers"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Suspense } from "react"
import Script from "next/script"

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
})

export const metadata = {
  title: "Brainz | Play Live Trivia Games & Win Prizes",
  description:
    "Join Brainz for exciting live trivia, quizzes, and games. From general trivia to crypto and sports challenges, test your knowledge and win big rewards. Play and win now!",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <meta
        name="google-site-verification"
        content="3vxxsAuMgtxlYcB0JSkAZZByvVnMNvEWlTdwCI8T8hk"
      />
      <body>
        <Suspense>
          <NotificationContext>
            <ToastContainer hideProgressBar={true} position="bottom-center" />
            <Providers>{children}</Providers>
          </NotificationContext>
          <GoogleAnalytics gaId="G-68EFCMX8V4" />
        </Suspense>
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1668196110409091');
          fbq('track', 'PageView');`}
        </Script>
        <Script id="twitter-pixel" strategy="afterInteractive">
          {`!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','on4uj');`}
        </Script>
        <Script id="tiktok-pixel" strategy="afterInteractive">
          {`!function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
            var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
            ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

              ttq.load('CRGO4ERC77UD12CU84AG');
              ttq.page();
            }(window, document, 'ttq');`}
        </Script>
      </body>
    </html>
  )
}
