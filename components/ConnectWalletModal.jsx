import { connectors } from '../utils/connectors'
import { useWeb3React } from '@web3-react/core'

function ConnectWalletModal({ isModalOpen, setIsModalOpen }) {
    const { activate } = useWeb3React()

    function close() {
        setIsModalOpen(false)
    }

    function setProvider(type) {
        window.localStorage.setItem('provider', type)
    }

    return isModalOpen ? (
        <>
            <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                <div className='relative w-auto my-6 mx-auto max-w-3xl bg-white rounded-lg'>
                    {/*content*/}
                    <div className='border-0 shadow-lg relative flex flex-col w-full outline-none focus:outline-none'>
                        {/*body*/}
                        <div className='relative p-6 flex flex-col'>
                            <button
                                className='p-5 px-9 font-bold border-2 rounded-full mb-3 text-xl transition-colors hover:bg-orange-600 hover:text-white'
                                onClick={async () => {
                                    await activate(connectors.injected)
                                    setIsModalOpen(false)
                                    setProvider('injected')
                                }}>
                                Metamask
                            </button>
                            <button
                                className='p-5 px-9 font-bold border-2 mb-3 text-xl transition-colors rounded-full hover:bg-blue-500 hover:text-white'
                                onClick={async () => {
                                    await activate(connectors.coinbaseWallet)
                                    setIsModalOpen(false)
                                    setProvider('coinbaseWallet')
                                }}>
                                Coinbase Wallet
                            </button>
                            <button
                                className='p-5 px-9 font-bold border-2 text-xl transition-colors rounded-full hover:bg-blue-700 hover:text-white'
                                onClick={async () => {
                                    await activate(connectors.walletConnect)
                                    setIsModalOpen(false)
                                    setProvider('walletConnect')
                                }}>
                                Wallet Connect
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </>
    ) : null
}

export default ConnectWalletModal
