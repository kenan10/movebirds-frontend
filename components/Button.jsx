function Button({ children, className, onClick, href, ...props }) {
    return (
        <button
            {...props}
            className={`rounded-lg flex flex-row justify-center items-center hover:brightness-105 hover:transition-all duration-75 ${className}`}
            onClick={onClick}>
            <a
                href={href}
                className='h-full w-full flex flex-row justify-center items-center'>
                {children}
            </a>
        </button>
    )
}

export default Button
