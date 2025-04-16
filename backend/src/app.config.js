module.exports = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/blockchain',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    STUDENT_ID_PREFIX: 'STU',
    TRANSACTION_FEE: 0.01,
    BLOCKCHAIN_NAME: 'StudentBlockchain',
    MAX_BLOCK_SIZE: 1e6, // 1 MB
};