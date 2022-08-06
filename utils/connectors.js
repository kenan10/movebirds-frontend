import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

const injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42, 31337]
})

const walletconnect = new WalletConnectConnector({
    rpcUrl: `https://eth-goerli.g.alchemy.com/v2/y8uHg_12_Esag7RzN8lU3C81F44DuK_l`,
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true
})

const walletlink = new WalletLinkConnector({
    url: `https://eth-goerli.g.alchemy.com/v2/y8uHg_12_Esag7RzN8lU3C81F44DuK_l`,
    appName: 'web3-react-demo'
})

export const connectors = {
    injected: injected,
    walletConnect: walletconnect,
    coinbaseWallet: walletlink
}
