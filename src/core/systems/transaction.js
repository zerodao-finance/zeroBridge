/**
 * handles injesting minting event listener, 
 * alerts ui elements when to appear
 * interacts with localStorage Persistance adapter
 */
import { useState, useEffect } from 'react'
import { useBridgeContext, useSigner, _ErrorNotifications, _BridgeMonitor, _TransactionNotifications, sdk } from '../instance'
import { ethers } from 'ethers'
import _ from "lodash"


/**
 * Hook
 * 
 * checks if wallet is connected and calls BridgeMonitor functions to send transaction
 * @catagory [Convert]
 */
export function useTransactionSender(props){
    const retrieveSigner = useSigner()
    const {connection, connectWallet} = global.wallet
    const {state, dispatch} = useBridgeContext()
    const [ isLoading, toggle ] = useState(false)

    const sign = async () => {
        sdk.submitNewTX(await retrieveSigner(), state.value, state.ratio)
    }
    
    return [isLoading, sign]
}

export function useTransactionListener(props){
    const [ deposit, setDeposit ] = useState(null)
    const [ signed, setSigned ] = useState(null)
    const [ mint, setMint ] = useState(null)

    useEffect(() => {
        _BridgeMonitor.listener.on("transaction", async (mint) => {
            if (process.env.REACT_APP_TEST){
                let _deposit = await new Promise((resolve) => mint.on("deposit", resolve))
                setMint(mint)
                setSigned(await _deposit.signed())
                setDeposit(await _deposit.confirmed())
            } else {
                let _deposit = await mint.on("deposit", async (deposit) => {
                    console.log(deposit.depositDetails)
                    setSigned( deposit.signed())
                    setDeposit( deposit.confirmed())
                })
                await setMint(mint)
            }
                
        })

        return () => _BridgeMonitor.listener.removeAllListeners()
    }, [])

    useEffect(async () => {
        _BridgeMonitor.listener.on("background", async (_transferRequest) => {
            console.log("Background Process: processing past TX")
            let _mint = await _BridgeMonitor.load(_transferRequest)
            let _deposit = await _mint.processDeposit
            console.log(_deposit)
            _BridgeMonitor.listener.emit("cleared")

        })
    }, [])



    useEffect(async () => {
        if (deposit && (!process.env.REACT_APP_TEST && deposit.status !== "reverted") && signed) {
            console.log(`Transaction Listener: Found TX \n`, deposit.depositDetails)
            _BridgeMonitor.listener.emit("clear")
            _TransactionNotifications.emitter.emit("add", deposit)
            signed.on("status", (status) => { if (status === "done") _TransactionNotifications.emitter.emit("delete")})
            setDeposit(null)
            setMint(null)
            setSigned(null)
        } else if (deposit && process.env.REACT_APP_TEST && signed) {
            console.log(`Transaction Listener: Found TX \n`)
            _BridgeMonitor.listener.emit("clear")
            _TransactionNotifications.emitter.emit("add", deposit)
            signed.on("status", (status) => {if (status === "signed") _TransactionNotifications.emitter.emit("delete")})
            setDeposit(null)
            setMint(null)
            setSigned(null)

        }

    }, [deposit])
}
