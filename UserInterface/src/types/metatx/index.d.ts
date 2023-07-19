declare type TokenDetails = {
  symbol: string;
  balance: number;
};

declare type ForwardRequest = {
  caller: string;
  targetToken: string;
  tokenAmount: number;
  nonce: number;
  callData: string;
  expireTime: number;
  signature: string;
};
