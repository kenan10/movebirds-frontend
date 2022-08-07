import { useEffect, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { address, abi } from '../constants'

function useContract() {
    const { chainId, account, activate, active, library } = useWeb3React()
    const contract = useRef(null)

    useEffect(() => {
        if (active) {
            contract.current = new Contract(address[chainId][0], abi, library)
            const transferEvent = contract.current.filters.Transfer(null, null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, chainId, active, library])

    return contract
}

export { useContract }
