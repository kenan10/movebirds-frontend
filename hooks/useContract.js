import { ethers } from 'ethers'
import { addresses, abi } from '../constants'
import useWeb3 from './useWeb3'
import { useEffect, useState } from 'react'

const DEFAULT_CHAIN_ID = 1
const NET_NAME = ''
if (process.env.NEXT_PUBLIC_COUNTER_PRICE_API_KEY.includes('eth-mainnet')) {
    NET_NAME = 'mainnet'
} else {
    NET_NAME = 'goerli'
}

function useContract() {
    const { chainId, accountAddress, active, signer } = useWeb3()
    const [contract, setContract] = useState()

    useEffect(() => {
        if (active) {
            const contract = new ethers.Contract(
                addresses[chainId][0],
                abi,
                signer
            )
            setContract(contract)
        } else {
            const alchemyProvider = new ethers.providers.AlchemyProvider(
                NET_NAME,
                process.env.NEXT_PUBLIC_COUNTER_PRICE_API_KEY
            )
            const contract = new ethers.Contract(
                addresses[DEFAULT_CHAIN_ID][0],
                abi,
                alchemyProvider
            )
            setContract(contract)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId, accountAddress])

    return contract
}

export default useContract
