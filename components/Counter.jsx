function Counter({ quantity, setQuantity, max }) {
    function increase() {
        setQuantity(quantity + 1)
    }

    function decrease() {
        setQuantity(quantity - 1)
    }

    return (
        <div className='flex flex-row justify-center gap-4 leading-none'>
            <button
                className='font-VT323 text-[2.7rem] text-black hover:bg-rose-medium rounded-xl h-fit px-2 disabled:text-gray-400'
                onClick={decrease}
                disabled={quantity <= 1}>
                -
            </button>
            <span className='font-VT323 text-[2.7rem] text-black'>
                {quantity}
            </span>
            <button
                className='font-VT323 text-[2.7rem] text-black hover:bg-rose-medium rounded-xl h-fit px-2 disabled:text-gray-400'
                onClick={increase}
                disabled={quantity >= max}>
                +
            </button>
        </div>
    )
}

export default Counter
