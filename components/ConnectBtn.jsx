import Button from './Button'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: { 5: process.env.GOERLI_RPC }
        }
    }
}

export default function ConnectBtn({ onActiveClick, activeText, className }) {
    async function connect() {
        const web3Modal = new Web3Modal({
            cacheProvider: false,
            providerOptions
        })
        const web3ModalProvider = await web3Modal.connect()
    }

    return (
        <Button
            onClick={() => {
                connect()
            }}
            className={className}>Connect Wallet</Button>
    )
}
