export const chainId: number = 11155111;

export const baseUri: string = "http://localhost:3001";

export const explorerUrl: string = "https://sepolia.etherscan.io/";

export const httpProvider: string =
  "https://eth-sepolia.g.alchemy.com/v2/-j5Ne_J7uA69d7rcZ7Ho3jspA-f88pv2";

export const targetTokenOne: string =
  "0x90cc42e32526dB9EA9C0dC58830915e97dC55b64";

export const targetTokenTwo: string =
  "0x6863E283433F0E361980375DD6e3a75C52f22Ecd";

export const targetTokenThree: string =
  "0xaD5E318a527BaF60F210Dd2C5C30e08B974836b9";

export const receiverForwarder: string =
  "0x3DE30f0Cf50b3Fab23b42205Fa0D849BFf14caE1";

export const tokenAbi: Array<any> = require("./TokenABI.json");

export const receiverForwarderAbi: Array<any> = require("./ReceiverABI.json");
