import { createContext, useState, useEffect } from 'react'

const Web3Context = createContext()

function Web3Provider({ children }) {
    const [library, setLibrary] = useState()
    const [provider, setProvider] = useState()
    const [active, setActive] = useState(false)

    return (
        <Web3Context.Provider
            value={{
                library: library,
                setLibrary: setLibrary,
                provider: provider,
                setProvider: setProvider,
                active: active,
                setActive: setActive
            }}>
            {children}
        </Web3Context.Provider>
    )
}

export { Web3Provider, Web3Context }
