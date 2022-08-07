import { useContract } from '../hooks/useContract'

function MintBtn({ children }) {
    const contract = useContract()

    return (
        <button
            className='bg-green-700 rounded-full p-4 px-12 text-white text-lg font-bold'
            onClick={async () => {
                const totalSupply = await contract.current.totalSupply()
                console.log(`Log: ${totalSupply}`)
            }}>
            {children}
        </button>
    )
}

export default MintBtn
