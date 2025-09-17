// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/**
 * @title VulnerableBank
 * @dev This contract demonstrates multiple common vulnerabilities
 * WARNING: This is for educational purposes only - DO NOT deploy!
 */
contract VulnerableBank {
    
    mapping(address => uint256) public balances;
    mapping(address => bool) public isAdmin;
    
    address public owner;
    uint256 public totalDeposits;
    bool public emergencyStop;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event AdminAdded(address indexed admin);
    
    constructor() {
        owner = msg.sender;
        isAdmin[msg.sender] = true;
    }
    
    // VULNERABILITY 1: Reentrancy Attack
    // External call before state update allows recursive calls
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // DANGEROUS: External call before state update
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        // State update happens AFTER external call - TOO LATE!
        balances[msg.sender] -= amount;
        totalDeposits -= amount;
        
        emit Withdrawal(msg.sender, amount);
    }
    
    // VULNERABILITY 2: Missing Access Control
    // Anyone can call this function to add admins
    function addAdmin(address newAdmin) external {
        // DANGEROUS: No access control check
        isAdmin[newAdmin] = true;
        emit AdminAdded(newAdmin);
    }
    
    // VULNERABILITY 3: Integer Overflow (in Solidity < 0.8.0)
    // No SafeMath protection
    function deposit() external payable {
        // DANGEROUS: Can overflow if totalDeposits + msg.value > type(uint256).max
        balances[msg.sender] += msg.value;
        totalDeposits += msg.value;
        
        emit Deposit(msg.sender, msg.value);
    }
    
    // VULNERABILITY 4: Unchecked External Call
    // Return value not verified
    function emergencyWithdraw() external {
        require(isAdmin[msg.sender], "Only admin");
        require(emergencyStop, "Emergency not active");
        
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        
        // DANGEROUS: Not checking return value
        msg.sender.call{value: amount}("");
    }
    
    // VULNERABILITY 5: Gas Limit DoS
    // Loop over potentially large array
    address[] public users;
    
    function distributeRewards() external {
        require(isAdmin[msg.sender], "Only admin");
        
        // DANGEROUS: Unbounded loop can run out of gas
        for (uint256 i = 0; i < users.length; i++) {
            if (balances[users[i]] > 0) {
                balances[users[i]] += 100; // Give 100 wei reward
            }
        }
    }
    
    // VULNERABILITY 6: Logic Error in Condition
    // Assignment instead of comparison
    function setEmergencyStop(bool _stop) external {
        require(isAdmin[msg.sender], "Only admin");
        
        // DANGEROUS: Assignment (=) instead of comparison (==)
        if (emergencyStop = _stop) {
            // This always sets emergencyStop to _stop AND evaluates to _stop
            totalDeposits = 0;
        }
    }
    
    // VULNERABILITY 7: No Input Validation
    // Missing zero address check
    function transferOwnership(address newOwner) external {
        require(msg.sender == owner, "Only owner");
        
        // DANGEROUS: No check if newOwner is zero address
        owner = newOwner;
        isAdmin[newOwner] = true;
    }
    
    // VULNERABILITY 8: State Variables Not Updated
    // Users array not maintained properly
    function withdrawAll() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");
        
        balances[msg.sender] = 0;
        totalDeposits -= amount;
        
        // Users array not updated - memory leak
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    // Helper function to add users (has its own vulnerability)
    function addUser(address user) internal {
        // VULNERABILITY 9: No duplicate check
        users.push(user); // Can add same user multiple times
    }
    
    // View functions
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    function getUserCount() external view returns (uint256) {
        return users.length;
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // Receive function to accept Ether
    receive() external payable {
        deposit();
        addUser(msg.sender);
    }
}

/**
 * VULNERABILITY SUMMARY:
 * 1. Reentrancy in withdraw() - CRITICAL
 * 2. Missing access control in addAdmin() - HIGH  
 * 3. Integer overflow in deposit() - MEDIUM
 * 4. Unchecked external call in emergencyWithdraw() - MEDIUM
 * 5. Gas limit DoS in distributeRewards() - MEDIUM
 * 6. Logic error in setEmergencyStop() - LOW
 * 7. Missing input validation in transferOwnership() - MEDIUM
 * 8. State not properly maintained - LOW
 * 9. No duplicate user check - LOW
 * 
 * POTENTIAL IMPACT: Complete fund drainage, unauthorized admin access,
 * contract becoming unusable due to gas limits.
 */