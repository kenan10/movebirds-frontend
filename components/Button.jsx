function Button({ children, onClick, className }) {
    return (
        <button
            className={`rounded-lg bg-rose h-fit ${className}`}
            onClick={onClick}>
            {children}
        </button>
    )
}

export default Button
