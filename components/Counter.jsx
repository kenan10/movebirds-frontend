const Counter = ({ className, onIncrease, onDecrease, counter }) => {
    const style = {
        counterBtn:
            'rounded-full border-4 border-green-700 bg-transparent w-14 h-14 text-2xl align-middle basis-1/4 grow-0',
        container: 'flex flex-row items-center w-full',
        output: 'text-4xl basis-1/2 text-center grow-1'
    }

    return (
        <div className={`${style.container} ${className}`}>
            <button className={style.counterBtn} onClick={onDecrease}>
                -
            </button>
            <span className={style.output}>{counter}</span>
            <button className={style.counterBtn} onClick={onIncrease}>
                +
            </button>
        </div>
    )
}

export default Counter
