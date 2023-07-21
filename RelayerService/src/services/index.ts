import web3 from "web3";
import CryptoJS from "crypto-js";
import {
  url,
  forwardRequest,
  encryptedPrivateKey,
  secretKey,
  receiverForwarderContract,
  receiverForwarderAbi,
} from "../config";

const currentWeb3: web3 = new web3(
  new web3.providers.HttpProvider(String(url))
);
const receiverInstance = new currentWeb3.eth.Contract(
  receiverForwarderAbi,
  receiverForwarderContract
);

const decryptPrivateKey = (args: any) => {
  let bytes = CryptoJS.AES.decrypt(args, secretKey);
  let privateKey = bytes.toString(CryptoJS.enc.Utf8);
  return privateKey.toString();
};

export const makeTransaction = async (
  forwardRequest: forwardRequest[],
  signature: string[]
): Promise<string> => {
  const privateKey: string = decryptPrivateKey(encryptedPrivateKey);

  console.log("reqeust length: " + forwardRequest.length);
  console.log("sign length: " + signature.length);

  return new Promise(async (resolve, reject) => {
    try {
      const { address } = await currentWeb3.eth.accounts.wallet.add(privateKey);
      console.log("1");

      const calldata = await receiverInstance.methods
        .execute(forwardRequest, signature)
        .encodeABI();
      console.log("2");

      const estimateGas = await receiverInstance.methods
        .execute(forwardRequest, signature)
        .estimateGas({ from: address });
      console.log("3", estimateGas);

      const gasPrice = await currentWeb3.eth.getGasPrice();
      console.log("4"), gasPrice;

      const tx_data = {
        from: address,
        to: receiverForwarderContract,
        gas: estimateGas * 2,
        gasPrice: gasPrice,
        data: calldata,
      };

      console.log("address:", address);

      const receipt = await currentWeb3.eth.sendTransaction(tx_data);
      console.log(receipt);
      resolve(receipt.transactionHash);
      console.log("6");
    } catch (err: any) {
      reject(err);
    }
  });
};

export const verifyMetaTx = async (
  forwardRequest: forwardRequest,
  signature: string
): Promise<Boolean> => {
  try {
    return await receiverInstance.methods
      .verify(forwardRequest, signature)
      .call();
  } catch (e: any) {
    return false;
  }
};
