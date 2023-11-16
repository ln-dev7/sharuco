import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="google-adsense-account" content="ca-pub-2222017759396595" />
      </Head>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
