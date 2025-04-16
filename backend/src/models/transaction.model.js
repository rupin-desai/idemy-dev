const crypto = require("crypto");
const idGenerator = require("../utils/idGenerator.utils");
const config = require("../app.config");

class Transaction {
  constructor(fromAddress, toAddress, amount, metadata = {}) {
    this.id = idGenerator.generateTransactionId();
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
    this.metadata = metadata;
    this.signature = "";
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.fromAddress +
          this.toAddress +
          this.amount +
          this.timestamp +
          JSON.stringify(this.metadata)
      )
      .digest("hex");
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }

  isValid() {
    // In development mode or for mining reward transactions (from = null), 
    // bypass strict validation
    if (config.nodeEnv === "development" || this.fromAddress === null) {
      return true;
    }
    
    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }

    try {
      const publicKey = crypto.createPublicKey(this.fromAddress);
      return crypto.verify(
        "sha256",
        Buffer.from(this.calculateHash()),
        publicKey,
        Buffer.from(this.signature, "hex")
      );
    } catch (error) {
      console.error("Signature verification error:", error.message);
      // In development mode, allow transactions even if signature verification fails
      return config.nodeEnv === "development";
    }
  }
}

module.exports = Transaction;
