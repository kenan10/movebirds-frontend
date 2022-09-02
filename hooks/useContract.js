import { ethers } from 'ethers'
import { addresses, abiMainnet } from '../constants'
import useWeb3 from './useWeb3'
import { useEffect, useState } from 'react'

const DEFAULT_CHAIN_ID = 1

function useContract() {
    const { chainId, accountAddress, active, signer } = useWeb3()
    const [contract, setContract] = useState()

    useEffect(() => {
        if (active) {
            const contract = new ethers.Contract(
                addresses[chainId][0],
                abiMainnet,
                signer
            )
            setContract(contract)
        } else {
            const alchemyProvider = new ethers.providers.AlchemyProvider(
                'mainnet',
                process.env.NEXT_PUBLIC_MAINNET_COUNTER_PRICE_API_KEY
            )
            const contract = new ethers.Contract(
                addresses[DEFAULT_CHAIN_ID][0],
                abiMainnet,
                alchemyProvider
            )
            setContract(contract)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId, accountAddress])

    return contract
}

export default useContract
