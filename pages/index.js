import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import ConnectBtn from '../components/ConnectBtn'
import Header from '../components/Header'
import FAQItem from '../components/FAQItem'
import Image from 'next/image'
import faqItems from '../assets/faqItems'

export default function Home() {
    function mint() {}

    return (
        <>
            <Head>
                <title>Mint Hootis</title>
                <meta name='description' content='Mint page of movebird' />
            </Head>

            <Header />

            <main className='bg-rose-light mx-auto p-4 flex flex-col items-center'>
                <div className='flex flex-col items-center sm:mb-60 mb-16 w-full'>
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
                    <ConnectBtn
                        className='bg-rose px-20 h-16 font-VT323 text-white text-[1.7rem] mt-[7.8rem] hover:brightness-[1.3]'
                        onActiveClick={mint}
                        activeText='Mint'
                    />
                    <span className='text-center text-2xl font-VT323 text-text-light-gray mx-auto'>
                        minted 0/5000
                    </span>
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
