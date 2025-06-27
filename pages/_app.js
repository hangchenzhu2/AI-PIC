import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css'
import '../styles/apple.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
