import { parseEther } from 'ethers/lib/utils'
import { useContract } from '../hooks/useContract'
import stage from '../public/stage.json'

function MintBtn({ numberToMint, amount, children }) {
    const contract = useContract()

    async function mint(tokensToMint) {
        const currentStage = stage.currentSalesStage
        console.log(currentStage)
        switch (currentStage) {
            case 'public':
                const value = parseEther(amount.toString())
                console.log(value)
                await contract.current.mintPublic(tokensToMint.toString(), {
                    value: value,
                })
                break
            default:
                break
        }
    }

    return (
        <button
            className='bg-green-700 rounded-full p-4 px-12 text-white text-lg font-bold'
            onClick={async () => {
                mint(numberToMint)
            }}>
            {children}
        </button>
    )
}

export default MintBtn
