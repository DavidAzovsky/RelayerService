# Solidity API

## ReceiverForwarder

_contract can parse the meta-transaction and handle the user transaction within it.
Able to handle each user transaction independently, meaning that the revert
or failure in any user transaction will not cause the failure of the entire meta-transaction._

### ForwardRequest

```solidity
struct ForwardRequest {
  address from;
  address target;
  uint256 tokenAmount;
  uint256 nonce;
  uint256 expireTime;
  bytes data;
}
```

### constructor

```solidity
constructor() public
```

### execute

```solidity
function execute(struct ReceiverForwarder.ForwardRequest[] req, bytes[] signature) external
```

_execute meta-transaction for multiple transactions submitted by users_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| req | struct ReceiverForwarder.ForwardRequest[] | the ForwardRequest structured data made and sent from relayerService |
| signature | bytes[] | the signed data sent from relayerService which is signed by EOA |

### pause

```solidity
function pause() external
```

_pause the contract
owner's privilege_

### unpause

```solidity
function unpause() external
```

_unpause the contract
owner's privilege_

### setFunctionStatus

```solidity
function setFunctionStatus(bytes4 msgSig, bool status) external
```

_set status of function._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| msgSig | bytes4 | the signature of function. |
| status | bool | true or false |

### setTargetContractStatus

```solidity
function setTargetContractStatus(address[] targetContract, bool status) external
```

_set status of targetContract(CA)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| targetContract | address[] | the address of target contracts. |
| status | bool | true or false |

### getNonce

```solidity
function getNonce(address from) external view returns (uint256)
```

_Gets the nonce of the specified address(EOA)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address to query the nonce. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | A uint256 representing the transactions passed by address. |

### getTargetContractStatus

```solidity
function getTargetContractStatus(address target) public view returns (bool)
```

_Gets the status of the target contract._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| target | address | contract address. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | true if target is verified, false otherwise. |

### getFunctionStatus

```solidity
function getFunctionStatus(bytes4 msgSig) external view returns (bool)
```

_Gets the status of function._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| msgSig | bytes4 | the signature of function. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | true if signature is allowed, false otherwise. |

### verify

```solidity
function verify(struct ReceiverForwarder.ForwardRequest req, bytes signature) public view returns (bool)
```

_verify the request and signature pair_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| req | struct ReceiverForwarder.ForwardRequest | the ForwardRequest structured data made and sent from relayerService |
| signature | bytes | the signed data sent from relayerService which is signed by EOA |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | true if req and signature is matched |

## TargetToken

### constructor

```solidity
constructor(string name, string symbol, address trustedForwarder) public
```

### mint

```solidity
function mint(address to, uint256 amount) external
```

_owner mints an amount of the token and assigns it to
an account. This encapsulates the modification of balances such that the
proper events are emitted._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The account that will receive the created tokens. |
| amount | uint256 | The amount that will be created. |

### _msgSender

```solidity
function _msgSender() internal view returns (address)
```

_internal function to get function caller address_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | address of msg.sender |

### _msgData

```solidity
function _msgData() internal view returns (bytes)
```

_internal function to get function caller's data_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes | data of msg.sender |

