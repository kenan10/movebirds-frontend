import Head from 'next/head'
import Button from '../components/Button'
import Header from '../components/Header'
import FAQItem from '../components/FAQItem'
import Image from 'next/image'
import faqItems from '../assets/faqItems'
import useWeb3 from '../hooks/useWeb3'
import Counter from '../components/Counter'
import { useState, useEffect } from 'react'
import useContract from '../hooks/useContract'
import { formatEther } from 'ethers/lib/utils'
import stage from '../public/stage.json'
import axios from 'axios'

export default function Home() {
    const { active, connect, accountAddress } = useWeb3()
    const [quantity, setQuantity] = useState(1)
    const contract = useContract()
    const [price, setPrice] = useState('')
    const [numberMinted, setNumberMinted] = useState(0)
    const [isAllowedToMint, setIsAllowedToMint] = useState(false)

    const client = axios.create({
        baseURL: 'http://localhost:80',
        headers: { 'Access-Control-Allow-Origin': '*' }
    })

    useEffect(() => {
        if (contract) {
            if (contract.signer) {
                async function updatePrice() {
                    const price = await contract.tokenPrice()
                    setPrice(formatEther(price.toString()))
                }
                updatePrice()
                async function updateNumberMinted() {
                    const numberMinted = await contract.totalSupply()
                    setNumberMinted(numberMinted.toString())
                }
                updateNumberMinted()
                contract.on('Transfer', () => {
                    updateNumberMinted()
                })
            }
        }
    }, [contract])

    useEffect(() => {
        if (accountAddress && contract) {
            async function updateIsAllowedToMint() {
                const salesStageNumber = (await contract.saleStage()).toString()
                const list_name = stage.salesStages[salesStageNumber]?.listName
                if (list_name) {
                    const res = client.get('/lists/list_items', {
                        params: {
                            collection_name: stage.collectionName,
                            list_name:
                                stage.salesStages[salesStageNumber.toString()]
                                    .listName,
                            address: accountAddress
                        }
                    })
                    console.log(res)
                }
            }
            updateIsAllowedToMint()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, contract])

    function mint() {}

    return (
        <>
            <Head>
                <title>Mint Hootis</title>
                <meta name='description' content='Mint page of movebird' />
            </Head>

            <Header />

            <main className='bg-rose-light mx-auto p-4 flex flex-col items-center'>
                <div className='flex flex-col items-center sm:mb-60 mb-16 mt-10 w-full'>
                    <Image
                        src='/avatar.gif'
                        alt='avatar'
                        layout='fixed'
                        width='298px'
                        height='273px'
                    />
                    <div className='mt-1'>
                        <h1 className='uppercase font-Upheaval text-[4rem] text-title text-center sm:leading-none leading-extra-loose'>
                            mint by WL`s only
                        </h1>
                        <h2 className='max-w-[40rem] text-center text-xl font-VT323 text-text-light-gray mx-auto mt-4'>
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
                    <div
                        className={`flex flex-col items-center w-[300px] ${
                            active ? 'mt-9' : 'mt-[7.8rem]'
                        }`}>
                        {active ? (
                            <div className='flex flex-col items-center w-full mb-8'>
                                <span className='font-VT323 text-2xl text-faq-text w-full text-center'>
                                    quantity
                                </span>
                                <Counter
                                    quantity={quantity}
                                    setQuantity={setQuantity}
                                />
                            </div>
                        ) : (
                            ''
                        )}

                        <Button
                            className='bg-rose w-full h-16 font-VT323 text-white text-[1.7rem] hover:brightness-[1.3]'
                            onClick={() => {
                                if (active) {
                                    mint()
                                } else {
                                    connect()
                                }
                            }}>
                            {active ? 'Mint' : 'Connect Wallet'}
                        </Button>
                        {active ? (
                            <div className='flex flex-row justify-between w-full leading-none'>
                                <div className='flex flex-col items-start'>
                                    <div className='text-start text-2xl font-VT323 text-text-light-gray'>
                                        minted
                                    </div>
                                    <div className='text-start text-3xl font-VT323 text-text-light-gray'>
                                        {numberMinted}/5000
                                    </div>
                                </div>
                                <div className='flex flex-col items-end'>
                                    <div className='text-end text-2xl font-VT323 text-text-light-gray'>
                                        price
                                    </div>
                                    <div className='text-end text-3xl font-VT323 text-text-light-gray'>
                                        {price.toString()} ETH
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
                <div className='flex flex-col items-center max-w-[60rem] w-full'>
                    <h1 className='uppercase font-Upheaval text-[5.8rem] sm:mb-[4.3rem] -mb-10 text-center text-text-gray opacity-20'>
                        faq
                    </h1>
                    <div className='w-full sm:bg-white flex flex-col items-center'>
                        {faqItems.map((item) => {
                            return (
                                <FAQItem
                                    key={item.number}
                                    number={item.number}
                                    title={item.title}
                                    text={item.text}
                                />
                            )
                        })}
                        <div className='flex flex-row justify-start w-full sm:py-12 py-6 max-w-[53rem] gap-12 px-4 sm:px-0'>
                            <div>
                                <span className='font-VT323 text-5xl text-text-gray opacity-20'>
                                    04
                                </span>
                            </div>
                            <div className='flex flex-col'>
                                <h2 className='text-text-gray font-VT323 text-[2.4rem] mb-6 leading-tight'>
                                    Team?
                                </h2>
                                <p className='text-faq-text font-VT323 text-2xl whitespace-pre-line'>
                                    We know only Booby{' '}
                                    <a
                                        href='https://twitter.com/axelroode'
                                        className='underline text-title opacity-90'>
                                        @axelroode
                                    </a>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
