import { useState, useEffect } from 'react'
import Head from 'next/head'
import ConnectBtn from '../components/ConnectBtn'
import MintBtn from '../components/MintBtn'
import ConnectWalletModal from '../components/ConnectWalletModal'
import Header from '../components/Header'
import { useWeb3React } from '@web3-react/core'
import { useContract } from '../hooks/useContract'
import MintParameters from '../components/MintParameters'

export default function Home() {
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
    const [mintedCounter, setMintedCounter] = useState(0)
    const { chainId, account, activate, active, library } = useWeb3React()
    const [toPayment, setToPayment] = useState(0)
    const [numberToMint, setNumberToMint] = useState(1)
    const contract = useContract()

    useEffect(() => {
        if (active) {
            async function updateMintedCounter() {
                const totalSupply = (
                    await contract.current.totalSupply()
                ).toString()
                console.log(totalSupply)
                setMintedCounter(totalSupply)
            }
            updateMintedCounter()
            const transferEvent = contract.current.filters.Transfer()
            contract.current.on(transferEvent, async () => {
                updateMintedCounter()
            })
        }
    })

    return (
        <>
            <Head>
                <title>Mint Hootis</title>
                <meta name='description' content='Mint page of movebird' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <Header/>

            <main className='bg-rose-light h-screen w-full px-[33rem]'>
                main
            </main>
        </>
    )
}
