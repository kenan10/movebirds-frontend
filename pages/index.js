import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import ConnectBtn from '../components/ConnectBtn'
import MintBtn from '../components/MintBtn'
import ConnectWalletModal from '../components/ConnectWalletModal'
import Header from '../components/Header'
import { useWeb3React } from '@web3-react/core'
import { useContract } from '../hooks/useContract'
import MintParameters from '../components/MintParameters'
import Image from 'next/image'
import Button from '../components/Button'

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

            <Header />

            <main className='bg-rose-light mx-auto p-4'>
                <div className='flex flex-col items-center mb-60'>
                    <Image
                        src='/../public/avatar.png'
                        alt='avatar'
                        layout='fixed'
                        width='273px'
                        height='273px'
                    />
                    <div className='mt-8'>
                        <h1 className='uppercase font-Upheaval text-[5rem] text-title text-center leading-none'>
                            mint by WL`s only
                        </h1>
                        <h2 className='max-w-[40rem] text-center text-xl font-VT323 text-text-gray mx-auto'>
                            No public mint. No gas wars. Check our optimized
                            <a href='https://etherscan.io/'>
                                <span className='text-title'>
                                    {' '}
                                    contract here
                                </span>
                            </a>
                            . This collection is our first from many next in
                            Season 1. By owning this OG — you have best chances
                            to get spots for others. LFG!
                        </h2>
                    </div>
                    <Button className='px-20 h-16 font-VT323 text-white text-[1.7rem] mt-32 bg-rose-dark'>
                        Connect Wallet
                    </Button>
                    <span className='text-center text-2xl font-VT323 text-text-gray mx-auto'>
                        minted 0/5000
                    </span>
                </div>
            </main>
        </>
    )
}
