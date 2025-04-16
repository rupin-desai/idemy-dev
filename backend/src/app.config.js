require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  blockchain: {
    difficulty: process.env.BLOCKCHAIN_DIFFICULTY || 4,
    miningReward: process.env.BLOCKCHAIN_MINING_REWARD || 100,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
};
