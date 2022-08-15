function Counter({ quantity, setQuantity }) {
    function increase() {
        if (quantity < 2) {
            setQuantity(quantity + 1)
        }
    }

    function decrease() {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    return (
        <div className='flex flex-row justify-center gap-4 leading-none'>
            <button
                className='font-VT323 text-[2.7rem] text-black hover:bg-rose-medium rounded-xl h-fit px-2'
                onClick={decrease}>
                -
            </button>
            <span className='font-VT323 text-[2.7rem] text-black'>
                {quantity}
            </span>
            <button
                className='font-VT323 text-[2.7rem] text-black hover:bg-rose-medium rounded-xl h-fit px-2'
                onClick={increase}>
                +
            </button>
        </div>
    )
}

export default Counter
