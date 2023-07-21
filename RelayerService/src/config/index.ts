import dotenv from "dotenv";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️ Couldn't find .env file ⚠️");
}

export interface forwardRequest {
  from: string;
  target: string;
  tokenAmount: any;
  nonce: number;
  expireTime: number;
  data: string;
}

export const receiverForwarderContract: string | undefined =
  process.env.RECEIVERFORWARDERCONTRACT;

export const port: string | undefined = process.env.PORT;

export const url: string | undefined = process.env.RPCURL;

export const secretKey: any = process.env.SECRETKEY;

export const encryptedPrivateKey: string | undefined =
  process.env.ENCRYPTEDPRIVATEKEY;

export const receiverForwarderAbi: Array<any> = require("./ReceiverABI.json");
