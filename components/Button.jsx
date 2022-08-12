function Button({ children, className, onClick }) {
    return (
        <button
            className={`rounded-lg flex flex-row justify-center items-center hover:brightness-105 hover:transition-all duration-75 ${className}`}
            onClick={onClick}>
            {children}
        </button>
    )
}

export default Button
