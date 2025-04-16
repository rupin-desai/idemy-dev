class Blockchain {
    constructor() {
        this.chain = [];
        this.pendingTransactions = [];
        this.createGenesisBlock();
    }

    createGenesisBlock() {
        const genesisBlock = this.createBlock(0, "0");
        this.chain.push(genesisBlock);
    }

    createBlock(index, previousHash) {
        const block = {
            index: index,
            timestamp: Date.now(),
            transactions: this.pendingTransactions,
            previousHash: previousHash,
            hash: this.calculateHash(index, previousHash, this.pendingTransactions, Date.now())
        };
        this.pendingTransactions = [];
        return block;
    }

    calculateHash(index, previousHash, transactions, timestamp) {
        return crypto.createHash('sha256').update(index + previousHash + JSON.stringify(transactions) + timestamp).digest('hex');
    }

    addTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock() {
        const latestBlock = this.getLatestBlock();
        const newBlock = this.createBlock(latestBlock.index + 1, latestBlock.hash);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== this.calculateHash(currentBlock.index, currentBlock.previousHash, currentBlock.transactions, currentBlock.timestamp)) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Blockchain;