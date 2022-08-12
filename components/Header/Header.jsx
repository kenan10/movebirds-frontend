import Image from 'next/image'
import Button from '../Button'
import ConnectBtn from '../ConnectBtn'

function Header() {
    return (
        <header className='w-full xl:px-16 lg:px-12 md:px-9 sm:px-7 px-6 py-2 flex flex-row justify-between items-center bg-white'>
            <div className='flex flex-col h-fit'>
                <div className='font-Upheaval text-5xl leading-none text-title'>
                    Hootis
                </div>
                <div className='font-VT323 text-lg leading-none relative inset-x-[3.7rem] -inset-y-2 text-title'>
                    animated pfp`s
                </div>
            </div>
            <div className='flex flex-row items-center gap-5 h-12'>
                <Button className='w-12 h-full bg-rose-medium'>
                    <Image
                        src='/etherscan-logo.png'
                        alt='etherscan'
                        layout='fixed'
                        height='20rem'
                        width='20rem'
                    />
                </Button>
                <Button className='w-12 h-full bg-rose-medium'>
                    <Image
                        src='/twitter-logo.png'
                        alt='etherscan'
                        layout='fixed'
                        height='20rem'
                        width='24rem'
                        className='flex-grow'
                    />
                </Button>
                <ConnectBtn
                    className='text-rose px-9 py-2 h-full w-56 font-VT323 text-[1.5rem] leading-none sm:flex hidden bg-rose-medium'
                    activeText='Disconnect' />
            </div>
        </header>
    )
}

export default Header
