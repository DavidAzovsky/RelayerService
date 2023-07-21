// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title target token contract users try to transfer token.
 * target token contract is verified by receiver contract and execute transactions
 * by receiver contract's caller.
 */

contract TargetToken is ERC2771Context, ERC20, ERC20Burnable, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        address trustedForwarder
    ) ERC20(name, symbol) ERC2771Context(trustedForwarder) {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    /**
     * @dev owner mints an amount of the token and assigns it to
     * an account. This encapsulates the modification of balances such that the
     * proper events are emitted.
     * @param to The account that will receive the created tokens.
     * @param amount The amount that will be created.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev internal function to get function caller address
     * @return address of msg.sender
     */
    function _msgSender()
        internal
        view
        override(Context, ERC2771Context)
        returns (address)
    {
        return ERC2771Context._msgSender();
    }

    /**
     * @dev internal function to get function caller's data
     * @return data of msg.sender
     */
    function _msgData()
        internal
        view
        override(Context, ERC2771Context)
        returns (bytes calldata)
    {
        return ERC2771Context._msgData();
    }
}
