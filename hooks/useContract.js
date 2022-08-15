import { ethers } from 'ethers'
import { addresses, abi } from '../constants'
import useWeb3 from './useWeb3'
import { useEffect, useState } from 'react'

const DEFAULT_CHAIN_ID = 5

function useContract() {
    const { chainId, accountAddress, library, active, signer } = useWeb3()
    const [contract, setContract] = useState()

    useEffect(() => {
        if (active) {
            const contract = new ethers.Contract(
                addresses[chainId][0],
                abi,
                signer
            )
            setContract(contract)
        } /* else {
            const contract = new ethers.Contract(
                addresses[DEFAULT_CHAIN_ID][0],
                abi,
                ethers.getDefaultProvider()
            )
            setContract(contract)
        } */
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chainId, accountAddress])

    return contract
}

export default useContract
