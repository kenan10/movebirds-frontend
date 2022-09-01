import '../styles/globals.css'
import { Web3Provider } from '../contexts/Web3/Web3Provider'
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
    return (
        <Web3Provider>
            <Script
                strategy='lazyOnload'
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />

            <Script strategy='lazyOnload' id='ga-script'>
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
            </Script>

            <Component {...pageProps} />
        </Web3Provider>
    )
}

export default MyApp
