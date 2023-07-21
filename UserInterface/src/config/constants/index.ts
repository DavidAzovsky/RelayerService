export const chainId: number = 11155111;

export const baseUri: string = "http://localhost:3001";

export const explorerUrl: string = "https://sepolia.etherscan.io/";

export const httpProvider: string =
  "https://eth-sepolia.g.alchemy.com/v2/-j5Ne_J7uA69d7rcZ7Ho3jspA-f88pv2";

export const targetTokenOne: string =
  "0xF8E83498f98a978DE5AAc5831ACa3fF6ccA8530a";

export const targetTokenTwo: string =
  "0x37F03A4824a014A042A83df7cF1154FDF001075e";

export const targetTokenThree: string =
  "0xe89AE64B49688796F632d4A6e4fBAc031b415461";

export const receiverForwarder: string =
  "0x3DE30f0Cf50b3Fab23b42205Fa0D849BFf14caE1";

export const tokenAbi: Array<any> = require("./TokenABI.json");

export const receiverForwarderAbi: Array<any> = require("./ReceiverABI.json");
