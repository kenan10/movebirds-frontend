import { createContext, useState } from 'react'

const Web3Context = createContext()

function Web3Provider({ children }) {
    const [library, setLibrary] = useState()
    const [provider, setProvider] = useState()
    const [active, setActive] = useState(false)
    const [accountAddress, setAccountAddress] = useState('')
    const [chainId, setChainId] = useState('')
    const [signer, setSigner] = useState()

    return (
        <Web3Context.Provider
            value={{
                library: library,
                setLibrary: setLibrary,
                provider: provider,
                setProvider: setProvider,
                active: active,
                setActive: setActive,
                accountAddress,
                setAccountAddress,
                chainId,
                setChainId,
                signer,
                setSigner
            }}>
            {children}
        </Web3Context.Provider>
    )
}

export { Web3Provider, Web3Context }
