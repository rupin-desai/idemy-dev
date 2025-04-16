const crypto = require("crypto");

class Block {
  constructor(
    index,
    timestamp,
    transactions,
    previousHash = "",
    metadata = {}
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.metadata = metadata;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.previousHash +
          JSON.stringify(this.transactions) +
          this.timestamp +
          JSON.stringify(this.metadata) +
          this.nonce
      )
      .digest("hex");
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join("0");
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    return this.hash;
  }
}

module.exports = Block;
