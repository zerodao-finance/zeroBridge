import { ethers } from 'ethers';
import { deployments, deploymentsFromSigner } from './zero';
import { UnderwriterTransferRequest, UnderwriterBurnRequest } from 'zero-protocol/dist/lib/zero';
import { TEST_KEEPER_ADDRESS } from 'zero-protocol/dist/lib/mock';
import EventEmitter from 'events'

export class sdkTransfer {

    response = new EventEmitter({ captureRejections: true })

    constructor (
        zeroUser,
        value,
        ratio,
        signer,
        to,
        isFast,
        _data
    ) {
        this.isFast = isFast;
        this.ratio = ratio;
        this.zeroUser = zeroUser;
        this.signer = signer;
        
        // initialize Transfer Request Object

        this.transferRequest = (async function() {
            var asset = "0xDBf31dF14B66535aF65AaC99C32e9eA844e14501"
            const contracts = await deploymentsFromSigner(signer)   
            const amount = ethers.utils.parseUnits(String(value), 8)
            const data = String(_data)

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
        })
        
        
        })();
    }


    async call() {
        
        // set correct module based on past in speed
        const transferRequest = await this.transferRequest
        transferRequest.module = this.isFast ? deployments.arbitrum.ArbitrumConvertQuick.address : deployments.arbitrum.Convert.address;
        this.response.emit('signing', { message: "please sign transaction", timeout: 5000})
        
        try {
            await transferRequest.sign(this.signer)
            this.response.emit('signed', { error: false, message: null})
            // this.StateHelper.update("transfer", "mode", { mode: "waitingDry" })
        } catch (err) {
            this.response.emit('error', { message: "failed! must sign transaction"})
            // handle signing error
            // this.Notification.createCard(5000, "error", { message: "Failed! Must sign Transaction"})
            // throw new Error('Failed to sign transaction')
        }   

        try {
            await transferRequest.dry(this.signer, { from: TEST_KEEPER_ADDRESS})
        } catch ( err ) {
            this.response.emit('error', { message: `error processing transaction ${err}`})
            // this.Notification.createCard(5000, "error", { message: `Error Processing Transaction: ${err}`})
            // throw new Error('Dry failed to run')
        }


        //handle publish transfer request
        // emit transfer request        
        try { 
            await this.zeroUser.publishTransferRequest(transferRequest)
            const mint = await transferRequest.submitToRenVM()
            var gatewayAddress = await transferRequest.toGatewayAddress()
            // this.StateHelper.update("transfer", "mode", { mode: "showGateway", gatewayData: { address: gatewayAddress, requestData: transferRequest} })
            this.response.emit('published', {gateway: gatewayAddress, request: transferRequest, mintEmitter: mint})
            // this.Emitter.emit("transfer", mint, transferRequest)
            return
        } catch (err) {
            this.response.emit('error', { message: `error publishing transaction ${err}`})
            // this.Notification.createCard(5000, "error", {message: `Error Publishing Transaction: ${err}`})
            // throw new Error('Error publishing transaction')
        }


    }

    
}

export class sdkBurn {
	constructor(zeroUser, amount, to, deadline, signer, destination, StateHelper) {
		console.log(destination);
		this.signer = signer;
		this.StateHelper = StateHelper;
		this.zeroUser = zeroUser;
		this.BurnRequest = (async function () {
			const contracts = await deploymentsFromSigner(signer);
			const value = ethers.utils.hexlify(ethers.utils.parseUnits(String(amount), 8));
			const asset = '0xDBf31dF14B66535aF65AaC99C32e9eA844e14501';

			return new UnderwriterBurnRequest({
				owner: to,
				underwriter: contracts.DelegateUnderwriter.address,
				asset: asset,
				amount: value,
				deadline: ethers.utils.hexlify(deadline),
				destination: ethers.utils.hexlify(ethers.utils.base58.decode(destination)),
				contractAddress: contracts.ZeroController.address
			});
		})();
	}

	async call() {
		const BurnRequest = await this.BurnRequest;
		console.log(BurnRequest);
		const contracts = await deploymentsFromSigner(this.signer);

		//sign burn request
		try {
			await BurnRequest.sign(this.signer, contracts.ZeroController.address);
		} catch (error) {
			console.error(error);
			//handle signature error
		}

		//publishBurnRequest
		try {
			this.zeroUser.publishBurnRequest(BurnRequest);
		} catch (error) {
			console.error(error);
		}
	}
}
