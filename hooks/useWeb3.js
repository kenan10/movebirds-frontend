import { useContext, useEffect } from 'react'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import { Web3Provider } from '@ethersproject/providers'
import { Web3Context } from '../contexts/Web3/Web3Provider'

let TARGET_CHAIN_ID = ''
if (process.env.NEXT_PUBLIC_COUNTER_PRICE_API_KEY.includes('eth-mainnet')) {
    TARGET_CHAIN_ID = '1'
} else {
    TARGET_CHAIN_ID = '5'
}

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: { [TARGET_CHAIN_ID]: process.env.NEXT_PUBLIC_MINT_CONNECT_RPC }
        }
    }
}

let web3Modal

function useWeb3() {
    const {
        provider,
        setProvider,
        library,
        setLibrary,
        active,
        setActive,
        accountAddress,
        setAccountAddress,
        chainId,
        setChainId,
        signer,
        setSigner
    } = useContext(Web3Context)

    async function connect() {
        try {
            const providerLocal = await web3Modal.connect()
            setProvider(providerLocal)
            const libraryLocal = new Web3Provider(providerLocal)
            const accounts = await libraryLocal.listAccounts()
            const network = await libraryLocal.getNetwork()
            if (network.chainId != TARGET_CHAIN_ID) {
                await disconnect()
                console.log("Use only mainnet")
            } else {
                const signer = libraryLocal.getSigner()
                setSigner(signer)
                if (accounts) setAccountAddress(accounts[0])
                setChainId(network.chainId)
                setLibrary(libraryLocal)
                setActive(true)
            }
        } catch (error) {
            console.log('Failed to connect')
        }
    }

    function refreshState() {
        setActive(false)
        setProvider()
        setLibrary()
        setAccountAddress()
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
            connect()
        }
    })

    useEffect(() => {
        if (provider?.on) {
            function handleDisconnect() {
                disconnect()
            }
            function handleAccountsChanged(accounts) {
                if (accounts.length !== 0) {
                    setAccountAddress(accounts[0])
                } else {
                    disconnect()
                }
            }
            function handleChainChanged(_hexChainId) {
                setChainId(parseInt(_hexChainId, 16).toString())
            }

            provider.on('disconnect', handleDisconnect)
            provider.on('accountsChanged', handleAccountsChanged)
            provider.on('chainChanged', handleChainChanged)

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

    return {
        connect,
        disconnect,
        library,
        provider,
        active,
        accountAddress,
        chainId,
        signer
    }
}

export default useWeb3
