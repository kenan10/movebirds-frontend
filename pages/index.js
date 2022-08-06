import { useState, useEffect } from 'react'
import Head from 'next/head'
import ConnectBtn from '../components/ConnectBtn'
import MintBtn from '../components/MintBtn'
import ConnectWalletModal from '../components/ConnectWalletModal'
import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'

export default function Home() {
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
    const [mintedCounter, setMintedCounter] = useState(0)
    const { chainId, account, activate, active, library } = useWeb3React()

    useEffect(() => {
      
    }, [active, chainId])
    
    return (
        <div className='p-96'>
            <Head>
                <title>Mint Movebird</title>
                <meta name='description' content='Mint page of movebird' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <div className='flex flex-col justify-center'>
                {active ? (
                    <>
                        <span className='text-4xl text-center border-4 py-4 border-green-400 mb-5'>
                            {mintedCounter} / 5000
                        </span>
                        <MintBtn>Mint</MintBtn>
                    </>
                ) : (
                    <ConnectBtn setIsModalOpen={setIsWalletModalOpen}>
                        Connect Wallet
                    </ConnectBtn>
                )}
            </div>
            <ConnectWalletModal
                isModalOpen={isWalletModalOpen}
                setIsModalOpen={setIsWalletModalOpen}
            />
        </div>
    )
}
