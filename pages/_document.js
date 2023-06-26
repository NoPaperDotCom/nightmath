import { Html, Head, Main, NextScript } from 'next/document';
import Script from "next/script";
import { GlobalStyle, FontStyle, IconStyle } from "de/components";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <GlobalStyle />
        <IconStyle type="rounded" />
        <IconStyle type="outlined" />
        <IconStyle type="sharp" />
        <FontStyle fonts={{
          "Pacifico": false,
          "Roboto": false,
          "Noto Sans TC": [700, 900]
        }} />
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=UA-226120719-1"></Script>
        <Script id="google-analytics" strategy="afterInteractive">
        {`
           window.dataLayer = window.dataLayer || [];
           function gtag(){dataLayer.push(arguments);}
           gtag('js', new Date());

           gtag('config', 'UA-226120719-1');
        `}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
