// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

/**
 * @title ReceiverForwarder contract
 * @dev contract can parse the meta-transaction and handle the user transaction within it.
 * Able to handle each user transaction independently, meaning that the revert
 * or failure in any user transaction will not cause the failure of the entire meta-transaction.
 */

contract ReceiverForwarder is EIP712, Pausable, Ownable {
    using ECDSA for bytes32;

    struct ForwardRequest {
        address from;
        address target;
        uint256 tokenAmount;
        uint256 nonce;
        uint256 expireTime;
        bytes data;
    }

    bytes32 private constant _TYPEHASH =
        keccak256(
            "ReceiverRequest(address from,address target,uint256 tokenAmount,uint256 nonce,uint256 expireTime,bytes data)"
        );
    bytes4 private constant TRANSFER_CALLDATA = 0xa9059cbb;
    uint256 private constant EXPIRE_TIME_FOR_SIGN = 100;

    mapping(address => uint256) private _nonces;
    mapping(address => bool) private _targetContractStatus;
    mapping(bytes4 => bool) private _allowedFunction;

    constructor() EIP712("ReceiverForwarder", "V.0.1") {
        _allowedFunction[0xa9059cbb] = true;
    }

    /**
     * @dev execute meta-transaction for multiple transactions submitted by users
     * @param req the ForwardRequest structured data made and sent from relayerService
     * @param signature the signed data sent from relayerService which is signed by EOA
     */
    function execute(
        ForwardRequest[] calldata req,
        bytes[] calldata signature
    ) external whenNotPaused {
        require(req.length == signature.length, "invalid input");
        for (uint i = 0; i < req.length; i++) {
            if (!verify(req[i], signature[i])) continue;
            if (
                req[i].expireTime < block.number ||
                ((block.number + EXPIRE_TIME_FOR_SIGN) < req[i].expireTime)
            ) continue;
            _nonces[req[i].from] = req[i].nonce + 1;

            if (!_allowedFunction[bytes4(req[i].data[0:4])]) continue;
            if (!_targetContractStatus[req[i].target]) continue;

            (bool success, ) = req[i].target.call(
                abi.encodePacked(req[i].data, req[i].from)
            );
        }
    }

    /**
     * @dev pause the contract
     * owner's privilege
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev unpause the contract
     * owner's privilege
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev set status of function.
     * @param msgSig the signature of function.
     * @param status true or false
     */
    function setFunctionStatus(bytes4 msgSig, bool status) external onlyOwner {
        _allowedFunction[msgSig] = status;
    }

    /**
     * @dev set status of targetContract(CA).
     * @param targetContract the address of target contracts.
     * @param status true or false
     */
    function setTargetContractStatus(
        address[] calldata targetContract,
        bool status
    ) external onlyOwner {
        for (uint8 i = 0; i < targetContract.length; i++) {
            _targetContractStatus[targetContract[i]] = status;
        }
    }

    /**
     * @dev Gets the nonce of the specified address(EOA).
     * @param from The address to query the nonce.
     * @return A uint256 representing the transactions passed by address.
     */
    function getNonce(address from) external view returns (uint256) {
        return _nonces[from];
    }

    /**
     * @dev Gets the status of the target contract.
     * @param target contract address.
     * @return true if target is verified, false otherwise.
     */
    function getTargetContractStatus(
        address target
    ) public view returns (bool) {
        return _targetContractStatus[target];
    }

    /**
     * @dev Gets the status of function.
     * @param msgSig the signature of function.
     * @return true if signature is allowed, false otherwise.
     */
    function getFunctionStatus(bytes4 msgSig) external view returns (bool) {
        return _allowedFunction[msgSig];
    }

    /**
     * @dev verify the request and signature pair
     * @param req the ForwardRequest structured data made and sent from relayerService
     * @param signature the signed data sent from relayerService which is signed by EOA
     * @return true if req and signature is matched      */
    function verify(
        ForwardRequest calldata req,
        bytes calldata signature
    ) public view returns (bool) {
        address signer = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    _TYPEHASH,
                    req.from,
                    req.target,
                    req.tokenAmount,
                    req.nonce,
                    req.expireTime,
                    keccak256(req.data)
                )
            )
        ).recover(signature);
        return _nonces[req.from] == req.nonce && signer == req.from;
    }
}
