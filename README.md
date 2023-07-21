# RelayerService

## simple relayer service that will batch user submitted transactions and execute multiple transactions in one meta-transaction

users make EIP-712 structured transactions and send it to RelayerService which verify,process transaction and execute each transaction corresponding users' request.

## Project handles three tokens - `TONE`, `TTWO`, `TTHREE`

User choose one token and request to transfer certain amount of token to certain user.

This is signed by `metamask`, sent to server.
server batches submitted transactions and make one `meta-transaction` that is sent to `receiver contract`.

`receiver contract` handle each transaction, transfer specified amount of `targeted token` from one user to another.

## Workflow

It consists of `Three` main components - `UserInterface`, `RelayerService`, `SmartContract`.

### Firstly, Users make transaction and sign using metamask in `UserInterface`.

send to `RelayerService` in below structure

ForwardRequest

```diff
{
  from: '0xf3649c30294802ab26d2a37668a1c44d96d8eb4f',
  target: '0xF8E83498f98a978DE5AAc5831ACa3fF6ccA8530a',
  tokenAmount: '700000000000000000000',
  nonce: '15',
  expireTime: 3935023,
  data: '0xa9059cbb0000000000000000000000008207b32f23610eaf25bc630f405cf4022fadfc0d000000000000000000000000000000000000000000000025f273933db5700000'
}
```

Signature

```diff
0x4198064d1e5e11571835c0e5ad72d11b6a41e644bfccd542fe48fcbb6ae264a360b57ce8d8e5c6f771b86d689e404a04c9f734540d79260d7751414c5ff8b1fa1c
```

Before project, check `UserInterface\README.md`

### Then, submitted transaction is sent to `RelayerService` and these transactions are checked, batched together and sended to `ReceiverForwarder` contract every minute.

`ReceiverForwarder` is part of `Smart Contract`

Before project, check `RelayerService\README.md`

### Next, `ReceiverForwarder` process batched transactions.

It handles, executes each transaction indepently, since revert or failure in any user transaction will not cause the failure of the entire meta-transaction.

```diff
--- example of transaction result ---
{
  blockHash: '0xf3240da8c4b30045f5d63e7e67843426206d5cb08125892c6cee9bd758c44395',
  blockNumber: 3935015,
  contractAddress: null,
  cumulativeGasUsed: 27492413,
  effectiveGasPrice: 50636,
  from: '0x5e8f3820a99550f5cc93eee7621231656fb34d12',
  gasUsed: 115889,
  logs: [
    {
      address: '0xF8E83498f98a978DE5AAc5831ACa3fF6ccA8530a',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000056bc75e2d63100000',
      blockNumber: 3935015,
      transactionHash: '0xb68c2f0f41aa34487a8ef4ea30bb12bf916584bad3b3bb51d2dd31f271fcebc4',
      transactionIndex: 34,
      blockHash: '0xf3240da8c4b30045f5d63e7e67843426206d5cb08125892c6cee9bd758c44395',
      logIndex: 636,
      removed: false,
      id: 'log_56a6b2fb'
    },
    {
      address: '0x37F03A4824a014A042A83df7cF1154FDF001075e',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000056bc75e2d63100000',
      blockNumber: 3935015,
      transactionHash: '0xb68c2f0f41aa34487a8ef4ea30bb12bf916584bad3b3bb51d2dd31f271fcebc4',
      transactionIndex: 34,
      blockHash: '0xf3240da8c4b30045f5d63e7e67843426206d5cb08125892c6cee9bd758c44395',
      logIndex: 637,
      removed: false,
      id: 'log_f3717dcb'
    }
  ],
  logsBloom: '0x0000000000000000000000000000000000000000000000000000000000000000000800000000000040000000000000000000000200000000000000000008000000000000000000000000000800000000000200000000000000000000008800000000000000000000000880000000000000000000000000000000000000000000000000000000000100000000000000000000000000002000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000200000000000000000000000000000000000000000000100002000000000000000000000000000000000000400000000000000000000000000000000000000000000000200000000000000000000000000000000000',
  status: true,
  to: '0x3de30f0cf50b3fab23b42205fa0d849bff14cae1',
  transactionHash: '0xb68c2f0f41aa34487a8ef4ea30bb12bf916584bad3b3bb51d2dd31f271fcebc4',
  transactionIndex: 34,
  type: '0x0'
}
```

Then you can see that your transaction is executed sucessfully on `etherscan.io`

Before project, check `Smart Contract\README.md`

## Example of meta-transaction execution

transaction hash of sepolia testnet

```diff
0xb68c2f0f41aa34487a8ef4ea30bb12bf916584bad3b3bb51d2dd31f271fcebc4
0xe98a4f620baf1098dfa5660a050ddbb40a1c1c83333ccc8839c617922e01b763
```

**NOTE:** you can find detailed information of smart contracts' functions in `Smart Contract\docs\index.md`
