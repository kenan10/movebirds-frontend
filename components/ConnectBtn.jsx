import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { connectors } from '../utils/connectors'

export default function ConnectBtn({ setIsModalOpen, children }) {
    const { deactivate, activate, active, ggg } = useWeb3React()

    function resetState() {
        window.localStorage.setItem('provider', undefined)
    }

    function disconnect() {
        deactivate()
        resetState()
    }

    useEffect(() => {
        const provider = window.localStorage.getItem('provider')
        if (provider) {
           async () => await activate(connectors[provider])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active])

    return (
        <button
            className='bg-amber-400 rounded-full p-4 px-6 text-white text-lg font-bold'
            onClick={async () => {
                if (active) {
                    disconnect()
                } else {
                    setIsModalOpen(true)
                }
            }}
        >
            {children}
        </button>
    )
}
