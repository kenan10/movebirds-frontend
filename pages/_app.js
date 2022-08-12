import '../styles/globals.css'

function getLibrary(provider) {
    return new Web3Provider(provider)
}

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
}

export default MyApp
