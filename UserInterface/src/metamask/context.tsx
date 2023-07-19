import React, { useEffect } from "react";
import getBalance from "./helpers/getBalance";
import requestAccounts from "./helpers/requestAccounts";
import {chainId as currentChainId} from "../config/constants";
import { toast } from 'react-toastify';

type Values = {
  user: User;
  setUser: (values: any) => void;
  contract: any;
  setContract: (values: any) => void;
};

const initialValues: Values = {
	contract: {},
	setContract: () => {},
	user: {
		address: "",
		isConnected: false,
		balance: 0,
	},
	setUser: () => {},
};

const MetamaskContext = React.createContext<Values>(initialValues);

const MetamaskProvider = ({ children }: any) => {
	const [contract, setContract] = React.useState<any>();
	const [user, setUser] = React.useState<User>({
		address: "",
		isConnected: false,
		balance: 0,
	});
	const [chainId,setChainId] = React.useState<Number>();
    const getUserInfo = async () => {
		if (window.ethereum) {
			const userInfo = await requestAccounts();
			setUser({
				...user,
				...userInfo,
			});

			if(Number(window.ethereum.chainId) != chainId) {
				setChainId(Number(window.ethereum.chainId));
			}
		} 		
	};
    const values: Values = { user, setUser, contract, setContract };

	if (window.ethereum) {		
		window.ethereum.on(
			"accountsChanged", async (accounts: any) => {
				console.log("Changed");				
				getUserInfo();
			}
		);

		window.ethereum.on('networkChanged', function(networkId: any){
			console.log('networkChanged',networkId);

			setChainId(networkId);			
		});
	}

	useEffect(() => {		
		if (window.ethereum) {
			getUserInfo();
	
			if(chainId != currentChainId && chainId != null) {
				toast.error("Please Change the Network Sepolia Testnet !", {
					position: toast.POSITION.TOP_RIGHT
				});
			}
		} else {
			setUser({
				address: "",
				isConnected: null,
				balance: 0,
			})
		}
	}, [chainId]);

  return (
    <MetamaskContext.Provider value={values}>
      {children}
    </MetamaskContext.Provider>
  );
};

export { MetamaskProvider, MetamaskContext };
