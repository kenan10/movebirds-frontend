import Head from 'next/head'
import Header from '../components/Header'
import FAQItem from '../components/FAQItem'
import Image from 'next/image'
import faqItems from '../public/faqItems'
import MintBlock from '../components/MintBlock'

export default function Home() {
    return (
        <>
            <Head>
                <title>Mint Hootis</title>
                <link rel='shortcut icon' href='/favicon.ico' />
                <meta name='description' content='Mint page of movebird' />
            </Head>

            <Header />

            <main className='bg-rose-light mx-auto p-4 flex flex-col items-center pb-24'>
                <div className='flex flex-col items-center sm:mb-60 mb-16 mt-10 w-full'>
                    <Image
                        src='/avatar.gif'
                        alt='avatar'
                        layout='fixed'
                        width='300px'
                        height='300px'
                    />
                    <div className='mt-1'>
                        <h1 className='uppercase font-Upheaval text-[4rem] text-title text-center sm:leading-none leading-extra-loose'>
                            mint by WL`s only
                        </h1>
                        <h2 className='max-w-[40rem] text-center text-xl text-secondary mx-auto mt-4'>
                            No public mint. No gas wars. Check our optimized{' '}
                            <a href='https://etherscan.io/address/0xf43E7f67b2d419e09882A2e16cEB5f2D129D4E11'>
                                <span className='text-title'>
                                    {' '}
                                    contract here
                                </span>
                            </a>
                            . This animated collection — is first from many
                            next. By owning this OG you have best chances to get
                            spots for others. Details soon.
                        </h2>
                    </div>
                    <MintBlock />
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
