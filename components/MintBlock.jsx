import Button from './Button'
import Counter from './Counter'
import { useState, useEffect } from 'react'
import useContract from '../hooks/useContract'
import { formatEther, parseEther } from 'ethers/lib/utils'
import useWeb3 from '../hooks/useWeb3'

import info from '../public/info.json'
import axios from 'axios'

const salesStages = Object.assign({}, info.salesStages)
Object.keys(info.salesStages).forEach((key) => {
    Object.assign(salesStages, {
        [key]: { listName: info.salesStages[key].listName, isAllowed: false }
    })
})

const client = axios.create({
    baseURL: 'http://localhost:80',
    headers: { 'Access-Control-Allow-Origin': '*' }
})

function MintBlock() {
    const { active, connect, disconnect, accountAddress } = useWeb3()
    const [quantity, setQuantity] = useState(1)
    const contract = useContract()
    const [price, setPrice] = useState('')
    const [numberMinted, setNumberMinted] = useState(0)
    const [currentStage, setCurrentStage] = useState(0)
    const [nearestSatgeAllowed, setNearestSatgeAllowed] = useState({})

    useEffect(() => {
        if (contract) {
            if (contract.signer) {
                async function updatePrice() {
                    const price = await contract.tokenPrice()
                    setPrice(formatEther(price.toString()))
                }
                updatePrice()
            }
            async function updateNumberMinted() {
                const numberMinted = await contract.totalSupply()
                setNumberMinted(numberMinted.toString())
            }
            updateNumberMinted()
            contract.on('Transfer', () => {
                updateNumberMinted()
            })
        }
    }, [contract])

    useEffect(() => {
        if (accountAddress && contract) {
            async function updateNearestSatgeAllowed() {
                const salesStageNumber = (await contract.saleStage()).toString()
                setCurrentStage(salesStageNumber)
                const list_name = info.salesStages.find(
                    (stage) => stage.code === salesStageNumber
                )
                if (list_name) {
                    let allowedLists
                    try {
                        const { data } = await client.get('/lists/list_items', {
                            params: {
                                collection_name: info.collectionName,
                                address: accountAddress
                            }
                        })
                        allowedLists = data
                    } catch (e) {
                        setNearestSatgeAllowed({})
                    }
                    let updateValue
                    if (
                        allowedLists?.length === 0 ||
                        typeof allowedLists === undefined
                    ) {
                        updateValue = {}
                    } else {
                        info.salesStages.sort((a, b) => {
                            return (
                                Date.parse(a.startsAt) - Date.parse(b.startsAt)
                            )
                        })
                        findNearestAllowedStage: {
                            for (let i = 0; i < info.salesStages.length; i++) {
                                const stage = info.salesStages[i]
                                for (let j = 0; j < allowedLists.length; j++) {
                                    const allowedList = allowedLists[i]
                                    if (
                                        stage.listName === allowedList.listName
                                    ) {
                                        const signedAddress =
                                            allowedList.signedAddress

                                        updateValue = {
                                            ...stage,
                                            signedAddress: signedAddress
                                        }
                                        break findNearestAllowedStage
                                    }
                                }
                            }
                        }
                    }
                    setNearestSatgeAllowed(updateValue)
                }
            }
            updateNearestSatgeAllowed()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, contract])

    async function mint() {
        const signature = nearestSatgeAllowed.signedAddress
        console.log(signature)
        // await contract.mintDev(5)
        const overrides = {
            value: parseEther((price * quantity).toString()),
            gasLimit: parseInt(3e7 / 2)
        }
        switch (currentStage) {
            case '1':
                await contract.mintAllowlist(quantity, signature, overrides)
                break
            case '2':
                await contract.mintWaitlist(quantity, signature, overrides)
            default:
                break
        }
    }

    return (
        <>
            {active ? (
                <>
                    {Object.keys(nearestSatgeAllowed).length !== 0 ? (
                        <>
                            <p
                                className={`text-secondary text-2xl text-center max-w-lg ${
                                    nearestSatgeAllowed.code !== currentStage
                                        ? 'mt-9'
                                        : ''
                                }`}>
                                {nearestSatgeAllowed.code !== currentStage
                                    ? `We found your wallet in our ${nearestSatgeAllowed.displayListName}!
                        Please, wait until this mint phase
                        starts at 0:00:00 UTC`
                                    : ''}
                            </p>
                            <div
                                className={`flex flex-col items-center w-[300px] ${
                                    nearestSatgeAllowed.code !== currentStage
                                        ? ''
                                        : 'mt-9'
                                }`}>
                                <div className='flex flex-col items-center w-full mb-8'>
                                    <span className='font-VT323 text-2xl text-faq-text w-full text-center'>
                                        quantity
                                    </span>
                                    <Counter
                                        quantity={quantity}
                                        setQuantity={setQuantity}
                                    />
                                </div>

                                <Button
                                    className='bg-rose w-full h-16 font-VT323 text-white text-[1.7rem] hover:brightness-[1.3] disabled:bg-gray-500 disabled:hover:bg-gray-500'
                                    disabled={
                                        nearestSatgeAllowed.code !==
                                        currentStage
                                    }
                                    onClick={mint}>
                                    Mint
                                </Button>
                                <div className='flex flex-row justify-between w-full leading-none'>
                                    <div className='flex flex-col items-start'>
                                        <div className='text-start text-2xl text-secondary'>
                                            minted
                                        </div>
                                        <div className='text-start text-3xl text-secondary'>
                                            {numberMinted}/5000
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-end'>
                                        <div className='text-end text-2xl text-secondary'>
                                            price
                                        </div>
                                        <div className='text-end text-3xl text-secondary'>
                                            {price.toString()} ETH
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className='flex flex-col items-center mt-9'>
                            <div className='text-rose max-w-lg text-center font-VT323 text-2xl'>
                                We didn&apos;t found this address in our Allow
                                or Waitlist. Please connect right one if you
                                have spot on it.
                            </div>
                            <Button
                                className='bg-rose h-16 font-VT323 text-white text-[1.7rem] hover:brightness-[1.3] w-[300px] mt-6'
                                onClick={disconnect}>
                                Disconnect
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className='flex flex-col items-center w-[300px] mt-[7.8rem]'>
                    <Button
                        className='bg-rose w-full h-16 font-VT323 text-white text-[1.7rem] hover:brightness-[1.3]'
                        onClick={connect}>
                        Connect Wallet
                    </Button>
                    <div className='text-center text-2xl text-secondary'>
                        minted {numberMinted}/5000
                    </div>
                </div>
            )}
        </>
    )
}

export default MintBlock
