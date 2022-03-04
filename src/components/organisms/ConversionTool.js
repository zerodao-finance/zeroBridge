import ConvertBox, { ConfirmBox } from '../molecules/Box'
// import { _BridgeObserver, useBridge } from '../../core/instance'
import {useBridge} from '../../core/systems/bridge'
import {useState, useEffect, useContext} from 'react'



const ConversionTool = () => {
    const state = useBridge()

    return (
        <div className="animate-swing-in-top-fwd">
            { state.page == 1 ? <ConvertBox/> : <ConfirmBox transferRequest={state.data.transferRequest} back={state.data.back} status={state.status}/>}
        </div>
    )
}
export default ConversionTool 