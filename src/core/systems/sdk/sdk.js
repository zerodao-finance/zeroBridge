import { UnderwriterTransferRequest, TransferRequest } from 'zero-protocol/dist/lib/zero';
import {ethers} from 'ethers';
import { MOCK_TF_RQ, controller } from '../../tools/utilities'
import { eventManager } from '../event'
import { deploymentsFromSigner } from '../../tools/utilities/zero';
import { chainFromHexString } from '../wallet'

const deployments = {



const transferRequestFromSigner = ({
  amount,
  asset,
  data,
  to
}) => {
  const


class SDK {

    zeroUser
    constructor(){

    }
    
    async transferRequestFromSigner({
      amount,
      asset,
      to,
      data
    }, signer) {
      const contracts = await deploymentsFromSigner(signer);
      return new UnderwriterTransferRequest({
        amount,
        asset,
        to,
        data,
        pNonce: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
        nonce: ethers.utils.hexlify(ethers.utils.randomBytes(32)),
        underwriter: contracts.DelegateUnderwriter.address,
        module: contracts.Convert.address,
        contractAddress: contracts.ZeroController.address
      });
    }
    
    
    async  submitNewTX(_signer, _value, _ratio, state) {
        console.log("Submitting a new Transfer Request")
        const { connection, connectWallet } = global.wallet
        if (!connection) return
        let chain = chainFromHexString(await connection.eth.getChainId())
        let tools = MOCK_TF_RQ[chain.chainName]

        /**
         * CREATE
         */
        var _to
        var _key
        try {
            _to = await _signer.getAddress()
        } catch (error) {
            const err = "Oops, check wallet connection"
            eventManager.dispatch.emit("error", err, 4000)
            return
        }
        const data = ethers.utils.defaultAbiCoder.encode(
            ["uint256"],
            [ethers.utils.parseEther(_ratio).div(ethers.BigNumber.from('100'))]
        )

        const asset = tools.asset
        const transferRequest = await transferRequestFromSigner({
            to: _to,
            asset,
            amount: ethers.utils.parseUnits(String(_value), 8),
            data: String(data)
        }, signer)

        /**
         * SIGN
         */
        try {
            await transferRequest.sign(_signer)
        } catch(error){
            const err = "Oops, check wallet connection"
            eventManager.dispatch.emit("error", err, 4000)
            return
        }

        /**
         * DRY
         */

        try {
            console.log(transferRequest)
            await (new UnderwriterTransferRequest(transferRequest)).dry(_signer.provider, { from : '0x4A423AB37d70c00e8faA375fEcC4577e3b376aCa'})
            _key = await storage.set(transferRequest)
            storage.storeSplit(_key, state.renBTC, state.ETH);
        } catch (error) {

		console.error(error);
            const err = "Loan will fail, double check input values"
            console.log("loan will fail", error)
            eventManager.dispatch.emit("error", err, 4000)
            return
        }



        /**
         * TRANSFER
         */

        try {
            await this.zeroUser.publishTransferRequest(transferRequest)
            const _mint = await transferRequest.submitToRenVM()
            if (process.env.REACT_APP_TEST){
                //mock
                eventManager.dispatch.emit("new_transaction_submited", transferRequest, _mint.gatewayAddress)
                let deposit = await new Promise(async (resolve) => _mint.on("deposit", resolve))
                console.log(deposit)
                const confirmed = await deposit.confirmed();
                eventManager.dispatch.emit("new_transaction_confirmed")
                eventManager.dispatch.emit("confirmed", confirmed)
                confirmed.on('confirmation', (currentConfirmations, totalNeeded) => {
                    console.log(currentConfirmations + '/' + totalNeeded + ' confirmations seen');
                });
                const signed = await deposit.signed();
                signed.on('status', (status) => {
                    // if (status === 'signed') storage.updateTransferRequest(_key, "success");
                });
            }
            else {
                //prod
                let tf = {...transferRequest}
                var _gatewayAddress = await transferRequest.toGatewayAddress()
                eventManager.dispatch.emit("new_transaction_submited", tf, _gatewayAddress)
                let _deposit = await _mint.on("deposit", async (deposit) => {
                    eventManager.dispatch.emit("new_transaction_confirmed")
                    console.log(deposit)
                    console.log(deposit.depositDetails)
                    let confirmed = deposit.confirmed()
                    let signed = deposit.signed()
                    eventManager.dispatch.emit("confirmed", confirmed)
                    signed.on("status", (status) => { 
                        // if (status === 'done') storage.updateTransferRequest(_key, "success");
                    })
                })
                /**
                 * 
                 */
            }
        } catch (error){
            storage.deleteTransferRequest(_key)
            const err = "Error connecting to with RenVM! Try again later"
                eventManager.dispatch.emit("error", err, 7000)
                return
        }
                               

    }

    async submitPendingTX(data) {
        let _key = data.key
        try{
            const transferRequest = new TransferRequest(data.data)
            const _mint = await transferRequest.submitToRenVM()
            if (process.env.REACT_APP_TEST){
                console.log("here")
                //mock
                let deposit = await new Promise(async (resolve) => _mint.on("deposit", resolve))
                console.log(deposit)
                const confirmed = await deposit.confirmed();
                confirmed.on('confirmation', (currentConfirmations, totalNeeded) => {
                    console.log(currentConfirmations + '/' + totalNeeded + ' confirmations seen');
                });
                const signed = await deposit.signed();
                    signed.on('status', (status) => {
                    // if (status === 'signed') storage.updateTransferRequest(_key, "success");
                });
            }
            else {
                //prod
                let _deposit = await _mint.on("deposit", async (deposit) => {
                    let signed = deposit.signed()
                    signed.on("status", (status) => { 
                        // if (status === 'signed') storage.updateTransferRequest(_key, "success");
                    })
                })
                
                
                // eventManager.dispatch.emit("new_transaction_submited", _mint, _gatewayAddress)
            }
        } catch (error){
            // storage.deleteTransferRequest(_key)
        }
    }


}

export const sdk = new SDK
