import Image from 'next/image'
import Button from '../Button'

function Header() {
    return (
        <header className='w-full xl:px-16 lg:px-12 md:px-5 sm:px-3 px-3 py-2 flex flex-row justify-between items-center bg-white'>
            <div className='flex flex-col h-fit'>
                <div className='font-Upheaval text-5xl leading-none'>
                    Hootis
                </div>
                <div className='font-VT323 text-lg leading-none relative inset-x-[3.7rem] -inset-y-2'>
                    animated pfp`s
                </div>
            </div>
            <div className='flex flex-row gap-5 h-fit'>
                <Button className='p-3'>
                    <Image
                        src='/../public/etherscan-logo.png'
                        alt='etherscan'
                        layout='fixed'
                        height='20rem'
                        width='20rem'
                    />
                </Button>
                <Button className='text-[#FD4E79] px-9 py-2 font-VT323 text-[1.5rem] leading-none'>
                    Connect Wallet
                </Button>
            </div>
        </header>
    )
}

export default Header
