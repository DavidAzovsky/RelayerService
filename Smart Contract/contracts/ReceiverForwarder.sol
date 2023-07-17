// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";

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

    error Invalid_CallData();
    error Invalid_Target_Address();
    error Call_Failed();
    error Signature_Not_Match();
    error Signature_Expired();

    constructor() EIP712("ReceiverForwarder", "V.0.1") {
        _allowedFunction[0xa9059cbb] = true;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function getNonce(address from) public view returns (uint256) {
        return _nonces[from];
    }

    function getTargetContractStatus(
        address target
    ) public view returns (bool) {
        return _targetContractStatus[target];
    }

    function getFunctionStatus(bytes4 msgSig) public view returns (bool) {
        return _allowedFunction[msgSig];
    }

    function setFunctionStatus(bytes4 msgSig, bool status) external onlyOwner {
        _allowedFunction[msgSig] = status;
    }

    function setTargetContractStatus(
        address[] calldata targetContract,
        bool status
    ) external onlyOwner {
        for (uint8 i = 0; i < targetContract.length; i++) {
            _targetContractStatus[targetContract[i]] = status;
        }
    }

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

    function execute(
        ForwardRequest calldata req,
        bytes calldata signature
    ) public whenNotPaused {
        if (!verify(req, signature)) revert Signature_Not_Match();
        if (
            req.expireTime < block.number ||
            ((block.number + EXPIRE_TIME_FOR_SIGN) < req.expireTime)
        ) revert Signature_Expired();
        _nonces[req.from] = req.nonce + 1;

        if (!_allowedFunction[bytes4(req.data[0:4])]) revert Invalid_CallData();
        if (!_targetContractStatus[req.target]) revert Invalid_Target_Address();

        (bool success, ) = req.target.call(
            abi.encodePacked(req.data, req.from)
        );

        if (!success) revert Call_Failed();
    }
}
