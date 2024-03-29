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

function convertTZ(dateStr, tzString) {
    return new Date(
        (typeof dateStr === 'string'
            ? new Date(dateStr)
            : dateStr
        ).toLocaleString('en-US', { timeZone: tzString })
    )
}

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
const MAX_PER_ADDRESS = 2

function MintBlock() {
    const { active, connect, disconnect, accountAddress } = useWeb3()
    const [quantity, setQuantity] = useState(1)
    const contract = useContract()
    const [price, setPrice] = useState('')
    const [numberMinted, setNumberMinted] = useState('?')
    const [currentStage, setCurrentStage] = useState(0)
    const [currentlyMinted, setCurrentlyMinted] = useState(0)
    const [cost, setCost] = useState('')
    const [nearestSatgeAllowed, setNearestSatgeAllowed] = useState({})
    const [supply, setSupply] = useState('5000')

    useEffect(() => {
        let updateNumberMintedInterval
        if (contract) {
            if (contract.signer) {
                async function updatePrice() {
                    const price = await contract.tokenPrice()
                    setPrice(formatEther(price))
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
                        setNumberMinted('?')
                    }
                }
            }
            updateNumberMinted()

            async function updateSupply() {
                const supply = await contract.maxSupply()
                setSupply(supply.toString())
            }
            updateSupply()

            updateNumberMintedInterval = setInterval(
                updateNumberMinted,
                60 * 1000 * 10
            )
        }

        return () => clearInterval(updateNumberMintedInterval)
    }, [contract])

    useEffect(() => {
        if (accountAddress && contract) {
            async function updateNearestSatgeAllowed() {
                const salesStageNumber = (await contract.saleStage()).toString()
                setCurrentStage(salesStageNumber)
                const { data: allowedLists } =
                    (await fetchAddressLists(accountAddress)) || []
                if (typeof allowedLists !== 'undefined') {
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
                        let nearestSatgeAllowed = allowedStages.find(
                            (stage) => {
                                return stage.code == salesStageNumber
                            }
                        )
                        if (typeof nearestSatgeAllowed === 'undefined') {
                            nearestSatgeAllowed = allowedStages.reduce(
                                (prev, curr) => {
                                    return prev.startsAt < curr.startsAt
                                        ? prev
                                        : curr
                                }
                            )
                        }
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

    useEffect(() => {
        let updateCostInterval
        async function updateCost() {
            if (accountAddress && price) {
                let _currentlyMinted = await contract.numberMinted(
                    accountAddress
                )
                _currentlyMinted = parseInt(_currentlyMinted.toNumber())
                setCurrentlyMinted(_currentlyMinted)
                if (_currentlyMinted == 0) {
                    setCost((quantity - 1) * parseFloat(price))
                } else if (_currentlyMinted > 0) {
                    setCost(quantity * parseFloat(price))
                }
            }
        }
        updateCostInterval = setInterval(updateCost, 60 * 1000 * 5)
        updateCost()

        return () => clearInterval(updateCostInterval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountAddress, price, quantity])

    async function mint() {
        const signature = nearestSatgeAllowed.signedAddress
        const overrides = {
            value: parseEther(cost.toString()),
            gasLimit: parseInt(210000)
        }
        try {
            switch (currentStage) {
                case '1':
                    await contract.mintAllowlist(quantity, signature, overrides)
                    break
                case '2':
                    await contract.mintWaitlist(quantity, signature, overrides)
                default:
                    break
            }
            if (quantity == 2) {
                setCurrentlyMinted(2)
            }
        } catch (e) {
            if (e.code == 4001) {
                console.log('Txn rejected')
            } else {
                console.error(e)
            }
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
                                        ? 'mt-7 mb-2'
                                        : ''
                                }`}>
                                {nearestSatgeAllowed.code !== currentStage
                                    ? `We found your wallet in our ${
                                          nearestSatgeAllowed.displayListName
                                      }!
                        Please, wait until this mint phase
                        starts at ${padTo2Digits(
                            convertTZ(
                                nearestSatgeAllowed.startsAt,
                                'America/New_York'
                            ).getHours()
                        )}:${padTo2Digits(
                                          convertTZ(
                                              nearestSatgeAllowed.startsAt,
                                              'America/New_York'
                                          ).getMinutes()
                                      )} EDT`
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
                                        max={MAX_PER_ADDRESS - currentlyMinted}
                                    />
                                </div>

                                <Button
                                    className='bg-rose w-full h-16 font-VT323 text-white text-[1.7rem] hover:brightness-[1.3] disabled:bg-gray-500 disabled:hover:brightness-100'
                                    disabled={
                                        nearestSatgeAllowed.code !==
                                            currentStage ||
                                        MAX_PER_ADDRESS - currentlyMinted == 0
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
                                            {numberMinted}/{supply}
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-end'>
                                        <div className='text-end text-2xl text-secondary'>
                                            cost
                                        </div>
                                        <div className='text-end text-3xl text-secondary'>
                                            {cost.toString()} ETH
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
                        minted {numberMinted}/{supply}
                    </div>
                </div>
            )}
        </>
    )
}

export default MintBlock
