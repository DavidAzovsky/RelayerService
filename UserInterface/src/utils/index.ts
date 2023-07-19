import web3 from "web3";
import {tokenAbi, receiverForwarderAbi, httpProvider} from "../config/constants";

export const getTokenBalance = async(targetToken: string, wallet:string) : Promise<{balance:any, symbol:any}>=> {
    let currentWeb3 = new web3(new web3.providers.HttpProvider(httpProvider));
    let tokenInstance = new currentWeb3.eth.Contract(tokenAbi,targetToken);
    const balance = await tokenInstance.methods.balanceOf(wallet).call();
    const symbol = await tokenInstance.methods.symbol().call();
    return {balance,symbol}
}


export const getMetaTxSign = async(contract: string, fromWallet:string,toWallet:any,amount:any) : Promise<{nonce:number, calldata:any}>=> {
    let currentWeb3 = new web3(new web3.providers.HttpProvider(httpProvider));
    let receiverInstance = new currentWeb3.eth.Contract(receiverForwarderAbi,contract);
    
    const nonce = await receiverInstance.methods.getNonce(fromWallet).call();
    const calldata = await currentWeb3.eth.abi.encodeFunctionCall({
        name: 'transfer',
        type: 'function',
        inputs: [{
            type: 'address',
            name: 'to'
        },{
            type: 'uint256',
            name: 'amount'
        }]
    }, [toWallet,amount]);
    return {nonce,calldata}
}



