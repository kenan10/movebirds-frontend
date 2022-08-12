function FAQItem({ number, text, title }) {
    return (
        <div className='flex flex-row justify-start w-full sm:py-12 py-6 max-w-[53rem] gap-12 px-4 sm:px-0'>
            <div className='sm:block hidden'>
                <span className='font-VT323 text-5xl text-text-gray opacity-20'>
                    {number}
                </span>
            </div>
            <div className='flex flex-col'>
                <h2 className='text-text-gray font-VT323 text-[2.4rem] sm:mb-6 mb-2 leading-tight'>
                    {title}
                </h2>
                <p className='text-faq-text font-VT323 text-2xl whitespace-pre-line'>{text}</p>
            </div>
        </div>
    )
}

export default FAQItem
