import { useContext, useEffect } from 'react'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import { Web3Provider } from '@ethersproject/providers'
import { Web3Context } from '../contexts/Web3/Web3Provider'

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: { 5: process.env.GOERLI_RPC }
        }
    }
}

let web3Modal

function useWeb3() {
    const { provider, setProvider, library, setLibrary, active, setActive } =
        useContext(Web3Context)

    async function connect() {
        const providerLocal = await web3Modal.connect()
        setProvider(providerLocal)
        const libraryLocal = new Web3Provider(providerLocal)
        setLibrary(libraryLocal)
        setActive(true)
    }

    function refreshState() {
        setProvider()
        setLibrary()
        setActive(false)
    }

    async function disconnect() {
        await web3Modal.clearCachedProvider()
        refreshState()
    }

    useEffect(() => {
        web3Modal = new Web3Modal({
            cacheProvider: false,
            providerOptions
        })
    })

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            connectWallet()
        }
    })

    useEffect(() => {
        if (provider?.on) {
            function handleDisconnect() {
                console.log('disconnect')
                disconnect()
            }
            function handleAccountsChanged(accounts) {
                console.log(accounts)
            }
            function handleChainChanged(_hexChainId) {
                console.log(_hexChainId)
            }

            provider.on('accountsChanged', handleAccountsChanged)
            provider.on('chainChanged', handleChainChanged)
            provider.on('disconnect', handleDisconnect)

            return () => {
                if (provider.removeListener) {
                    provider.removeListener(
                        'accountsChanged',
                        handleAccountsChanged
                    )
                    provider.removeListener('chainChanged', handleChainChanged)
                    provider.removeListener('disconnect', handleDisconnect)
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider])

    return { connect, disconnect, library, provider, active }
}

export default useWeb3
