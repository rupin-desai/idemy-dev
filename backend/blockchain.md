# Idemy Custom Blockchain Implementation

This document provides an in-depth overview of the custom blockchain system implemented for the Idemy platform, a decentralized student and institution identity verification system.

## Core Components

### Block Structure
Each block in our blockchain contains:
- **Index**: Sequential block number (Genesis block is 0)
- **Timestamp**: Creation time in milliseconds
- **Transactions**: Array of transaction objects
- **Previous Hash**: Hash of the previous block
- **Metadata**: Additional block information
- **Hash**: SHA-256 hash of the block content
- **Nonce**: Number used in the mining process

### Transaction Structure
Transactions are the basic units of data and include:
- **ID**: Unique transaction identifier
- **From Address**: Sender's address (null for mining rewards)
- **To Address**: Recipient's address
- **Amount**: Value transferred (0 for most system operations)
- **Timestamp**: Creation time
- **Metadata**: Transaction-specific data (e.g., student records, institution details)
- **Signature**: Digital signature for verification (not used in development mode)

## Key Features

### Proof-of-Work Consensus
The blockchain uses a Proof-of-Work consensus mechanism:
- New blocks must be mined by finding a valid hash
- Mining process requires computational effort, securing the chain
- Difficulty level determines mining complexity

### Difficulty Mechanism
The blockchain implements an adjustable difficulty level:

```javascript
mineBlock(difficulty) {
    const target = Array(difficulty + 1).join("0");
    while (this.hash.substring(0, difficulty) !== target) {
        this.nonce++;
        this.hash = this.calculateHash();
    }
    return this.hash;
}
```

- **Default Difficulty**: 4 (requiring 4 leading zeros)
- **Target Generation**: Creates a string of zeros matching the difficulty level
- **Mining Process**: Incrementally adjusts the nonce until the hash has the required leading zeros
- **Validation**: Blocks are only accepted when they have a valid proof-of-work
- **Adjustable**: The system allows manual adjustment of difficulty via the `setBlockchainDifficulty` method
- **Performance Impact**: Higher difficulty exponentially increases computational requirements

### Mathematical Foundation

The difficulty setting of 4 means that valid blocks must have hashes beginning with four zeros. The probability of randomly finding such a hash is:

1 in 16<sup>4</sup> = 1 in 65,536

This means that, on average, 65,536 different nonce values must be tried before finding a valid hash.

**Processing Impact**: Higher difficulty values exponentially increase the computational work required:

- **Difficulty 1**: 1 in 16 hashes (16<sup>1</sup>) will be valid
- **Difficulty 2**: 1 in 256 hashes (16<sup>2</sup>)
- **Difficulty 3**: 1 in 4,096 hashes (16<sup>3</sup>)
- **Difficulty 4**: 1 in 65,536 hashes (16<sup>4</sup>)
- **Difficulty 5**: 1 in 1,048,576 hashes (16<sup>5</sup>)

### Blockchain Persistence
- The blockchain state is saved to a JSON file (`blockchain.json`)
- Auto-saves occur at regular intervals (every 5 minutes)
- The system can restore the blockchain state from file
- Logs record each save operation

### Transaction Management
- Transactions are first added to a pending transactions pool
- Mining creates new blocks with pending transactions
- Mining rewards are automatically issued to miners
- Special transaction types for student and institution operations

### Chain Validation
The blockchain provides methods to verify its integrity:
```javascript
isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];

        // Validate hash
        if (currentBlock.hash !== currentBlock.calculateHash()) {
            return false;
        }

        // Validate chain linkage
        if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
        }
    }
    return true;
}
```

## System Architecture

### Models
- **Block**: Represents individual blocks in the chain
- **Blockchain**: Manages the chain, transactions, and mining
- **Transaction**: Represents data exchange between addresses

### Services
- **BlockchainService**: High-level operations on the blockchain
- **BlockService**: Block-specific operations
- **PersistenceService**: Handles saving/loading blockchain state
- **TransactionService**: Manages transaction creation and validation

## API Endpoints
The blockchain exposes several API endpoints:
- `GET /api/blockchain`: Get the full blockchain
- `GET /api/blockchain/info`: Get blockchain statistics
- `GET /api/blockchain/block/:index`: Get block by index
- `POST /api/blockchain/mine`: Mine pending transactions
- `POST /api/blockchain/save`: Manually save blockchain state
- `GET /api/blockchain/validate`: Validate blockchain integrity

## Use Cases

### Student Identity Management
- Student registration on the blockchain
- Record verification by institutions
- NFT issuance for verified identities

### Institution Verification
- Institution registration and verification
- Creation of NFTs for validated institutions

## Mining Mechanism

Mining is the process of adding new blocks to the blockchain:

1. Transactions are collected in the pending transactions pool
2. A mining reward transaction is added to the pool
3. A new block is created with the pending transactions
4. The block is mined using the proof-of-work algorithm
5. Once mined, the block is added to the chain
6. The pending transactions pool is cleared

## Technical Implementation Notes

- Written in Node.js with Express.js for the API layer
- Uses crypto library for hash generation
- File-based persistence with automatic backups
- Development mode allows bypass of signature validation
- Configurable mining difficulty
- Auto-saving occurs every 5 minutes as indicated in logs

## Conclusion

This custom blockchain implementation provides a robust foundation for the Idemy platform's decentralized identity verification system. The adjustable difficulty mechanism allows the system to balance security needs with performance requirements as the network grows.