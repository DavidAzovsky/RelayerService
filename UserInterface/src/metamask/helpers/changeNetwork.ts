import {httpProvider, explorerUrl, chainId} from "../../config/constants";


const networks: Record<string, any> = {
  sepolia: {
    chainId: `0x${Number(chainId).toString(16)}`,
    chainName: "Binance Test Network",
    nativeCurrency: {
      name: "BINANCE TEST ETH",
      symbol: "TBNB",
      decimals: 18,
    },
    rpcUrls: [httpProvider],
    blockExplorerUrls: [explorerUrl],
  },
};

export default async function changeNetwork(networkName: string) {
  if (!networkName) networkName = "sepolia";

  await window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        ...networks[networkName],
      },
    ],
  });
}
