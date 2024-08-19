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
  subsets: ["latin"]
})

export const metadata = {
  title: "Brainz",
  description: "Play Trivia, Win Crypto Rewards"
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
            <Providers> {children}</Providers>
          </NotificationContext>
          <GoogleAnalytics gaId="G-68EFCMX8V4" />
        </Suspense>
        <Script id="twq">
          {`!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','on4uj');`}
        </Script>
        <Script id='fbq'>
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
      </body>
    </html>
  )
}
