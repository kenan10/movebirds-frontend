function Button({ children, onClick, className }) {
    return (
        <button
            className={`rounded-lg bg-rose h-fit flex flex-row justify-center items-center ${className}`}
            onClick={onClick}>
            {children}
        </button>
    )
}

export default Button
