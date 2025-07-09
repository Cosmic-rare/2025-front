import { Html, Head, Main, NextScript } from "next/document"


export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/apple-touch-icon.png" />
        <meta name="msapplication-TileColor" content="#5EABD6" />
        <meta name="theme-color" content="#5EABD6" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
