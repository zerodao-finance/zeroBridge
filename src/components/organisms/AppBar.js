import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Button from '../atoms/Buttons'
import { DarkLight } from '../atoms/DarkLight'
import {ContractContext, Web3Context, UIContext} from '../../context/Context';
import { BsAppIndicator } from 'react-icons/bs'




export default function AppBar() {

  return (
      <div className="w-screen px-12 py-3 sticky top-0 flex flex-row justify-between bg-neutral-50 dark:bg-slate-900 z-40 bg-opacity-0 backdrop-blur-md">
          <UIContext.Consumer>
          { value => 
              value.get ? 
              <img src="/ArbitrumLogo@2x.png" alt="image" className="h-[70px]" /> :
              <img src="/ArbitrumLogoDark@2x.png" alt="image" className="h-[70px]" /> 
          }
          </UIContext.Consumer>
            <div className="self-center flex justify-between gap-3">
                <Web3Context.Consumer>
                { value =>
                        <Button text={value.get.connection ? "Connected" : "Connect Wallet"} variant={value.get.connection ? "valid" : "outlined"} action={value.get.connection ? null : value.set.connectWallet}/>
                }
                </Web3Context.Consumer>
                <ContractContext.Consumer>
                    { value =>
                    <span className="flex gap-4 self-center text-lg ml-8">

                        {value.get.keepers.length > 0 && <p className="font-medium text-emerald-300 hidden md:block text-sm">Keeper Status</p>}
                        {value.get.keepers.length === 0 && <p className="font-medium text-red-500 text-sm">Keeper Status</p>}
                        {value.get.keepers.length > 0 ?
                        <BsAppIndicator className="fill-emerald-400 scale-150 self-center animate hover:animate-ping"/> :
                        <BsAppIndicator className="fill-red-500 scale-150 self-center animate animate-ping"/> 
                        }
                    </span>
                    }
                </ContractContext.Consumer>
                {/* <DarkLight /> */}
            </div>
      </div> 
  )
}