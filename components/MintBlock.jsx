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

function isObject(obj) {
    return obj instanceof Object && Object.keys(obj).length !== 0
}

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_ADDRESS
})

async function fetchAddressLists(address) {
    try {
        const response = await client.get('/lists/list_items', {
            params: {
                collection_name: info.collectionName,
                address: address
            }
        })
        return response
    } catch (error) {
        console.log('Failed to read lists')
    }
}

async function fetchNumberMinted() {
    try {
        const response = await client.get('/blockchain/number_minted')
        return response
    } catch (error) {}
}

function padTo2Digits(num) {
    return String(num).padStart(2, '0')
}

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
                if (isObject(contract)) {
                    const { data: numberMinted } =
                        (await fetchNumberMinted()) || {}
                    if (typeof numberMinted != 'undefined') {
                        setNumberMinted(numberMinted?.value.toString())
                    } else {
                        setNumberMinted(0)
                    }
                }
            }
            updateNumberMinted()
            setInterval(updateNumberMinted, 60 * 1000 * 2)
        }
    }, [contract])

    useEffect(() => {
        if (accountAddress && contract) {
            async function updateNearestSatgeAllowed() {
                const salesStageNumber = (await contract.saleStage()).toString()
                setCurrentStage(salesStageNumber)
                const { data: allowedLists } =
                    (await fetchAddressLists(accountAddress)) || []
                if (typeof allowedLists != 'undefined') {
                    const allowedStages = info.salesStages.filter((stage) =>
                        allowedLists.find((allowedList) => {
                            return allowedList.listName === stage.listName
                        })
                    )

                    let updateValue
                    if (
                        Array.isArray(allowedStages) &&
                        allowedStages.length !== 0
                    ) {
                        const nearestSatgeAllowed = allowedStages.reduce(
                            (prev, curr) => {
                                return prev.startsAt < curr.startsAt
                                    ? prev
                                    : curr
                            }
                        )
                        updateValue = {
                            ...nearestSatgeAllowed,
                            signedAddress: allowedLists.find((allowedList) => {
                                return (
                                    allowedList.listName ===
                                    nearestSatgeAllowed.listName
                                )
                            }).signedAddress
                        }
                    }
                    setNearestSatgeAllowed({ ...updateValue })
                }
            }
            updateNearestSatgeAllowed()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, contract])

    async function mint() {
        const signature = nearestSatgeAllowed.signedAddress
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
                    {isObject(nearestSatgeAllowed) ? (
                        <>
                            <p
                                className={`text-secondary text-2xl text-center max-w-lg ${
                                    nearestSatgeAllowed.code !== currentStage
                                        ? 'mt-9'
                                        : ''
                                }`}>
                                {nearestSatgeAllowed.code !== currentStage
                                    ? `We found your wallet in our ${
                                          nearestSatgeAllowed.displayListName
                                      }!
                        Please, wait until this mint phase
                        starts at ${padTo2Digits(
                            new Date(nearestSatgeAllowed.startsAt).getUTCHours()
                        )}:${padTo2Digits(
                                          new Date(
                                              nearestSatgeAllowed.startsAt
                                          ).getMinutes()
                                      )}`
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
                                    className='bg-rose w-full h-16 font-VT323 text-white text-[1.7rem] hover:brightness-[1.3] disabled:bg-gray-500 disabled:hover:brightness-100'
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
