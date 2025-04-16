class BlockService {
    constructor() {
        this.blocks = [];
    }

    createBlock(data, previousHash) {
        const index = this.blocks.length + 1;
        const timestamp = new Date().toISOString();
        const hash = this.calculateHash(index, timestamp, data, previousHash);
        
        const newBlock = {
            index,
            timestamp,
            data,
            previousHash,
            hash
        };

        this.blocks.push(newBlock);
        return newBlock;
    }

    calculateHash(index, timestamp, data, previousHash) {
        return require('crypto')
            .createHash('sha256')
            .update(index + timestamp + JSON.stringify(data) + previousHash)
            .digest('hex');
    }

    getBlock(index) {
        return this.blocks[index - 1] || null;
    }

    validateBlock(block) {
        if (!block || !block.hash) return false;

        const { index, timestamp, data, previousHash } = block;
        const calculatedHash = this.calculateHash(index, timestamp, data, previousHash);
        return block.hash === calculatedHash;
    }

    getAllBlocks() {
        return this.blocks;
    }
}

module.exports = BlockService;