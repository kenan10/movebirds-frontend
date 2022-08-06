import React from 'react'

function MintBtn({ children }) {
    return (
        <button className='bg-green-700 rounded-full p-4 px-12 text-white text-lg font-bold'>
            {children}
        </button>
    )
}

export default MintBtn
