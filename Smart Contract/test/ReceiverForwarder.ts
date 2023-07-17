import { expect } from "chai";
import { ethers } from "hardhat";
import { TargetToken } from "../typechain/TargetToken";
import { ReceiverForwarder } from "../typechain/ReceiverForwarder";
import { parseEther } from 'ethers/lib/utils';
import { BigNumber } from "@ethersproject/bignumber";

describe("PriceFeed Contract", function () {
  let receiverForwarder : ReceiverForwarder
  let targetTokenInstanceOne : TargetToken
  let targetTokenInstanceTwo : TargetToken
  let targetTokenInstanceThree : TargetToken
  let owner: any
  let executor: any
  let caller : any
  let receiver : any
  let addrs;

  before(async function () {
    receiverForwarder = await deployReceiverForwarder()
    targetTokenInstanceOne = await deployTargetToken("TargetTokenOne","TONE",receiverForwarder.address);
    targetTokenInstanceTwo = await deployTargetToken("TargetTokenTwo","TTWO",receiverForwarder.address);
    targetTokenInstanceThree = await deployTargetToken("TargetTokenThree","TTHREE",receiverForwarder.address);

    [owner,executor,caller,receiver, ...addrs] = await ethers.getSigners();
  })

  it("OwnerShip & Config", async function () {    
    expect((await receiverForwarder.owner())).to.equal(owner.address);

    await receiverForwarder.connect(owner).setTargetContractStatus(
      [targetTokenInstanceOne.address,targetTokenInstanceTwo.address,targetTokenInstanceThree.address],true);

    expect((await receiverForwarder.getTargetContractStatus(targetTokenInstanceOne.address))).to.equal(true);
    expect((await receiverForwarder.getTargetContractStatus(targetTokenInstanceTwo.address))).to.equal(true);
    expect((await receiverForwarder.getTargetContractStatus(targetTokenInstanceThree.address))).to.equal(true);
    expect((await receiverForwarder.getFunctionStatus("0xa9059cbb"))).to.equal(true);    
  });

  it("Execute Transfer", async function () {
    const tokenAmount = parseEther("2");

    await targetTokenInstanceOne.connect(owner).mint(caller.address,parseEther("10"));
    const beforeUserBalance = await targetTokenInstanceOne.balanceOf(caller.address);
    const callData = await getTransferCallData(receiver.address,tokenAmount);
    const getNonce = await receiverForwarder.getNonce(caller.address);

    const getChainId = await caller.getChainId();
    const currentBlock = Number(await caller.provider.getBlockNumber()) + 25;
    
    const domain = {
      name: 'ReceiverForwarder',
      version: 'V.0.1',
      chainId: getChainId,
      verifyingContract: receiverForwarder.address,
    };

    // The named list of all type definitions
    const types = {
      ReceiverRequest: [
          { name: 'from', type: 'address' },
          { name: 'target', type: 'address' },
          { name: 'tokenAmount', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'expireTime', type: 'uint256' },
          { name: 'data', type: 'bytes' }
      ]
    };
    // The data to sign
    const value = {
        from: caller.address,
        target: targetTokenInstanceOne.address,
        tokenAmount: tokenAmount,
        nonce: getNonce,
        expireTime: currentBlock,
        data: callData
    };
  
    let signature = await caller._signTypedData(domain, types, value);
    let ForwardRequest = {
      from: caller.address,
      target: targetTokenInstanceOne.address,
      tokenAmount: tokenAmount,
      nonce: getNonce,
      expireTime: currentBlock,
      data: callData
    }

    await receiverForwarder.connect(executor).execute(ForwardRequest,signature);
    
    const afterUserBalance = await targetTokenInstanceOne.balanceOf(caller.address);
    const receiverBalance = await targetTokenInstanceOne.balanceOf(receiver.address);

    expect((beforeUserBalance.sub(afterUserBalance))).to.equal(tokenAmount);   
    expect(receiverBalance).to.equal(tokenAmount);    
  });

  it("Execute Transfer Using Same Nonce", async function () {
    const tokenAmount = parseEther("2");

    await targetTokenInstanceOne.connect(owner).mint(caller.address,parseEther("10"));
    const beforeUserBalance = await targetTokenInstanceOne.balanceOf(caller.address);
    const callData = await getTransferCallData(receiver.address,tokenAmount);
    const getNonce = Number(await receiverForwarder.getNonce(caller.address)) - 1;
    const currentBlock = Number(await caller.provider.getBlockNumber()) + 25;

    const getChainId = await caller.getChainId();
    const domain = {
      name: 'ReceiverForwarder',
      version: 'V.0.1',
      chainId: getChainId,
      verifyingContract: receiverForwarder.address,
    };

    // The named list of all type definitions
    const types = {
      ReceiverRequest: [
          { name: 'from', type: 'address' },
          { name: 'target', type: 'address' },
          { name: 'tokenAmount', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'expireTime', type: 'uint256' },
          { name: 'data', type: 'bytes' }
      ]
    };
    // The data to sign
    const value = {
        from: caller.address,
        target: targetTokenInstanceOne.address,
        tokenAmount: tokenAmount,
        nonce: getNonce,
        expireTime: currentBlock,
        data: callData
    };
  
    let signature = await caller._signTypedData(domain, types, value);
    let ForwardRequest = {
      from: caller.address,
      target: targetTokenInstanceOne.address,
      tokenAmount: tokenAmount,
      nonce: getNonce,
      expireTime: currentBlock,
      data: callData
    }

    await expect(receiverForwarder.connect(executor).execute(ForwardRequest,signature)).to.be.revertedWith(
      "Signature_Not_Match()"
    );   
  });

  it("Expect Revert TransferForm", async function () {
    const tokenAmount = parseEther("2");

    const beforeUserBalance = await targetTokenInstanceOne.balanceOf(caller.address);
    const callData = await getTransferFromCallData(caller.address,receiver.address,tokenAmount);
    const getNonce = await receiverForwarder.getNonce(caller.address);
    const currentBlock = Number(await caller.provider.getBlockNumber()) + 25;

    const getChainId = await caller.getChainId();
    const domain = {
      name: 'ReceiverForwarder',
      version: 'V.0.1',
      chainId: getChainId,
      verifyingContract: receiverForwarder.address,
    };

    // The named list of all type definitions
    const types = {
      ReceiverRequest: [
          { name: 'from', type: 'address' },
          { name: 'target', type: 'address' },
          { name: 'tokenAmount', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'expireTime', type: 'uint256' },
          { name: 'data', type: 'bytes' }
      ]
    };
    // The data to sign
    const value = {
        from: caller.address,
        target: targetTokenInstanceOne.address,
        tokenAmount: tokenAmount,
        nonce: getNonce,
        expireTime: currentBlock,
        data: callData
    };
  
    let signature = await caller._signTypedData(domain, types, value);
    let ForwardRequest = {
      from: caller.address,
      target: targetTokenInstanceOne.address,
      tokenAmount: tokenAmount,
      nonce: getNonce,
      expireTime: currentBlock,
      data: callData
    }

    await expect(receiverForwarder.connect(executor).execute(ForwardRequest,signature)).to.be.revertedWith(
      "Invalid_CallData()"
    );   

    const afterUserBalance = await targetTokenInstanceOne.balanceOf(caller.address);
    expect((beforeUserBalance.sub(afterUserBalance))).to.equal(0);   
  });

  it("Expect Revert Signature Expired Block", async function () {
    const tokenAmount = parseEther("2");

    const beforeUserBalance = await targetTokenInstanceOne.balanceOf(caller.address);
    const callData = await getTransferCallData(receiver.address,tokenAmount);
    const getNonce = await receiverForwarder.getNonce(caller.address);
    const getChainId = await caller.getChainId();
    const currentBlock = Number(await caller.provider.getBlockNumber()) + 200; 

    const domain = {
      name: 'ReceiverForwarder',
      version: 'V.0.1',
      chainId: getChainId,
      verifyingContract: receiverForwarder.address,
    };

    // The named list of all type definitions
    const types = {
      ReceiverRequest: [
          { name: 'from', type: 'address' },
          { name: 'target', type: 'address' },
          { name: 'tokenAmount', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'expireTime', type: 'uint256' },
          { name: 'data', type: 'bytes' }
      ]
    };
    // The data to sign
    const value = {
        from: caller.address,
        target: targetTokenInstanceOne.address,
        tokenAmount: tokenAmount,
        nonce: getNonce,
        expireTime: currentBlock,
        data: callData
    };
  
    let signature = await caller._signTypedData(domain, types, value);
    let ForwardRequest = {
      from: caller.address,
      target: targetTokenInstanceOne.address,
      tokenAmount: tokenAmount,
      nonce: getNonce,
      expireTime: currentBlock,
      data: callData
    }

    await expect(receiverForwarder.connect(executor).execute(ForwardRequest,signature)).to.be.revertedWith(
      "Signature_Expired()"
    );    
  });

  async function deployTargetToken(name:string,symbol:string,params:any) {
    let TargetTokenArtifacts = await ethers.getContractFactory('TargetToken')
    let TargetToken = await TargetTokenArtifacts.deploy(name,symbol,params)
    await TargetToken.deployed();  
    return TargetToken;
  }

  async function deployReceiverForwarder() {
    let ReceiverForwarderArtifacts = await ethers.getContractFactory('ReceiverForwarder')
    let ReceiverForwarder = await ReceiverForwarderArtifacts.deploy()
    await ReceiverForwarder.deployed();  
    return ReceiverForwarder;
  }

  async function getTransferCallData(address:string,amount:BigNumber) {
    let token_itf = await ethers.getContractFactory('TargetToken')
    
    return token_itf.interface.encodeFunctionData("transfer",[address,amount]) 
  }

  async function getTransferFromCallData(fromAddress:string,toAddress:string,amount:BigNumber) {
    let token_itf = await ethers.getContractFactory('TargetToken')
    
    return token_itf.interface.encodeFunctionData("transferFrom",[fromAddress,toAddress,amount]) 
  }
});
