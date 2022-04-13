import { BridgeLoadingWallet } from "../bridge.transfer/bridge.loading.wallet"
import { BridgeLoadingSignature } from "./bridge.loading.signature"
import { useCheckWalletConnected } from "../../../api/global/interfaces/interfaces.wallet"
import { BridgeBurnInput } from './bridge.burn.amount'
import { BridgeBurnSubmit } from './bridge.burn.submit'
import { useBridgeBurnInput } from "../../../api/global/interfaces/interface.bridge.burn"

export const BridgeBurnModule = () => {
    const { open } = useCheckWalletConnected()
    const { 
        getBridgeBurnInputProps,
        getBurnSenderProps
     } = useBridgeBurnInput() 
    const isLoading = false
    const BTC = 0.0
    return (
        <>
        {
            open ?
            <BridgeLoadingWallet />
            : 
            <>
            {
                isLoading ? <BridgeLoadingSignature />
                :
                <>
                    <div className="animate-flip-in-hor-top [animation-delay:400ms] container h-max flex flex-row place-content-center max-w-[25rem] gap-3 md:gap-5 justify-around items-center px-1 md:px-8 z-10">
                        <p className="text-[10px] text-gray-300 whitespace-nowrap"> release amount </p>
                        <div className="flex flex-col">
                            <BridgeBurnInput {...getBridgeBurnInputProps()}/>
                        </div>
                    </div>
                    <div className={` animate-flip-in-hor-top [animation-delay:600ms] container h-max flex flex-col place-content-center max-w-[25rem] gap-3 md:gap-5 justify-around items-center px-1 md:px-8  pt-8 pb-4`}>
                        <p className="text-[10px] text-gray-300 whitespace-nowrap">result</p>
                        <div className="flex flex-col w-full">
                        <div className="w-fit self-center">
                            <div className="text-badger-yellow-neon-400 flex flex-row gap-2">
                                    <p>
                                        {BTC}
                                    </p>
                                    <p>
                                        BTC
                                    </p> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="animate-flip-in-hor-top [animation-delay:700ms] mt-4">
                        <BridgeBurnSubmit {...getBurnSenderProps()}/>
                    </div>
                </>
            }
            </>
        }
        </>
    )
}
