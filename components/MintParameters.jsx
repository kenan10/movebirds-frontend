import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useState, useEffect, useRef } from 'react'
import { useContract } from '../hooks/useContract'
import Counter from './Counter'

function MintParameters({
    numberToMint,
    setNumberToMint,
    maxToMint = 2,
    toPayment,
    setToPayment
}) {
    const { active, account } = useWeb3React()
    const contract = useContract()
    const price = useRef()

    useEffect(() => {
        if (active) {
            async function updatePrice() {
                const result = (await contract.current.tokenPrice()).toString()
                price.current = ethers.utils.formatEther(result)
            }
            updatePrice()
        }
    })

    useEffect(() => {
        async function updateToPayment() {
            const tokensClaimed = await contract.current.getTokensCaimed(account)
            console.log('tokenClaimed', tokensClaimed)
            if (numberToMint > 1 && tokensClaimed < 1) {
                setToPayment(price.current * (numberToMint - 1))
            } else if (tokensClaimed > 0) {
                setToPayment(price.current * numberToMint)
            } else {
                setToPayment(0)
            }
        }
        updateToPayment()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberToMint, account])

    function decrese() {
        if (numberToMint > 1) {
            setNumberToMint(() => numberToMint - 1)
        }
    }

    function increase() {
        if (numberToMint < maxToMint) {
            setNumberToMint(() => numberToMint + 1)
        }
    }

    return (
        <div className='container flex flex-col place-items-center'>
            <span className='text-lg mb-2'>Number to mint</span>
            <Counter
                className='mb-4'
                onIncrease={increase}
                onDecrease={decrese}
                counter={numberToMint}
            />
            <span className='text-lg mb-2'>For payment: {toPayment} ETH</span>
        </div>
    )
}

export default MintParameters
