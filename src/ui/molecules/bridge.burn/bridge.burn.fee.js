import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import useBurnFees from '../../../api/hooks/burn-fees'

export const BridgeBurnTransferFee = ({ amount, effect, tokenPrice, setToken, token }) => {
    const { getBurnOutput } = useBurnFees();
    const [isFeeLoading, setIsFeeLoading] = useState(false);
    const [fee, setFee] = useState();
    useEffect(async () => {
        if(amount > 0) {
            setIsFeeLoading(true);
            const output = await getBurnOutput({ amount, token });
            setFee(output);
            setIsFeeLoading(false);
        }
    }, [amount, token])

    var formatter = new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: "USD"
    })

    return (
      <>
        {amount > 0 && (
          <div className="self-center px-0 py-0 w-full">
              <div className="w-full shadow-inner flex justify-between px-4 py-2 mt-5 text-white rounded-xl dark:bg-badger-gray-500 bg-gray-100">
                  <div className="flex items-center max-w-[100%]">
                    <p className="text-[10px] text-gray-300 whitespace-nowrap">RESULT</p>
                  </div>
                  <div>
                      <span className={`${isFeeLoading && "animate-pulse"}`}>
                          {fee || 0} BTC
                      </span>
                  </div>
              </div>
              <div className=" xl:mr-5 italic tracking-wider w-full text-right text-[10px] text-badger-yellow-neon-400">
                  ~ { tokenPrice && formatter.format(fee * ethers.utils.formatUnits(tokenPrice, 6)) }
              </div> 
          </div>
        )}
      </>
    )
}