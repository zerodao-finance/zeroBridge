import { useEffect, useState } from 'react';
import useTransferPrices from '../../../api/hooks/transfer-prices';
import { ReactComponent as BTC } from '../../../assets/svg-coins/btc.svg';
import { DefaultInput } from '../../atoms';
import { ethers } from 'ethers';

function BridgeTransferFrom({ amount, effect, tokenPrice, setToken, token }) {
    const [calculateWith, setCalculateWith] = useState(1);
    const [calculateLoading, setCalculateLoading] = useState(false);
    const { getRenBtcEthPair } = useTransferPrices();

    useEffect(async () => {
        setCalculateLoading(true)
        if(token.toLowerCase() === 'eth'){
            const pair = await getRenBtcEthPair();
            setCalculateWith(pair);
        }
        else if(token.toLowerCase() === 'usdc'){
            if(tokenPrice){
                const btcPrice = ethers.utils.formatUnits(tokenPrice, 6);
                setCalculateWith(1 / btcPrice)
            }
        }
        else {
            setCalculateWith(1);
        }
        setCalculateLoading(false);
    }, [token]);

    console.log(calculateLoading)

    return (
        <div className="w-100 flex items-center justify-between gap-5 dark:bg-badger-gray-500 bg-gray-100 px-2 rounded-2xl" style={{minHeight: "58px"}}>
            <div className="flex items-center pl-2 w-full">
                <p className="text-[10px] text-gray-300 whitespace-nowrap">FROM</p>
                <div className="inline-flex justify-center max-w-[100%] rounded-md pl-4 py-2 bg-transparent text-sm font-medium text-white justify-between w-full focus:outline-none">
                    <span className="flex items-center gap-2 max-w-[100%] w-full">
                        <BTC className="w-[4rem] h-[2rem] fill-gray-400" />
                        <p className="dark:text-white text-gray-500">
                            BTC
                        </p>
                        <DefaultInput value={amount * calculateWith} onChange={effect} disabled loading={calculateLoading}  />
                    </span>
                </div>
            </div>
            
        </div>
    )
}

export default BridgeTransferFrom;