# Idemy Blockchain Backend

## Overview

This project implements a blockchain-based backend system for the Idemy platform, facilitating the creation and management of digital student identification cards as NFTs. The application follows the MVC architecture pattern to maintain a clean separation of concerns, making the codebase scalable and maintainable. The blockchain implementation provides immutable record-keeping of student data, ID cards, and associated transactions.

## Features

- Blockchain implementation with proof-of-work consensus
- NFT minting and management for digital ID cards
- Student record management with blockchain verification
- Authentication system with JWT
- Comprehensive logging system
- RESTful API endpoints for all operations
- Error handling middleware
- CORS support

## Project Structure

```
idemy-backend
├── src
│   ├── app.js                  # Application entry point
│   ├── app.config.js           # Configuration settings
│   ├── controllers
│   │   ├── auth.controller.js  # Authentication controller
│   │   ├── blockchain.controller.js
│   │   ├── nft.controller.js   # NFT operations controller
│   │   ├── student.controller.js
│   │   └── transaction.controller.js
│   ├── services
│   │   ├── auth.service.js
│   │   ├── blockchain.service.js
│   │   ├── block.service.js
│   │   ├── nft.service.js
│   │   ├── student.service.js
│   │   ├── transaction.service.js
│   │   └── validation.service.js
│   ├── middleware
│   │   ├── auth.middleware.js  # JWT authentication middleware
│   │   ├── error.middleware.js # Centralized error handling
│   │   └── logger.middleware.js # Request/response logging
│   ├── models
│   │   ├── block.model.js      # Blockchain block model
│   │   ├── blockchain.model.js # Main blockchain implementation
│   │   ├── nft.model.js        # NFT data structure
│   │   ├── student.model.js
│   │   └── transaction.model.js
│   ├── utils
│   │   ├── crypto.utils.js     # Cryptographic utilities
│   │   ├── idGenerator.utils.js # Unique ID generation
│   │   └── logger.utils.js     # Advanced logging system
│   └── routes
│       ├── auth.routes.js      # Authentication routes
│       ├── blockchain.routes.js
│       ├── nft.routes.js       # NFT management routes
│       ├── student.routes.js
│       └── transaction.routes.js
├── data                        # Data storage directory
│   └── *.json                  # JSON storage files
├── logs                        # Application logs
│   ├── combined                # Combined logs of all levels
│   ├── error                   # Error-level logs
│   ├── warn                    # Warning-level logs
│   ├── info                    # Info-level logs
│   └── debug                   # Debug-level logs
├── package.json
├── .env                        # Environment variables
├── .gitignore
└── README.md
```

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **JWT**: JSON Web Tokens for authentication
- **BCrypt**: Password hashing
- **Firebase Admin**: Authentication services
- **Canvas**: For generating digital ID cards
- **Crypto**: For cryptographic operations
- **Morgan**: HTTP request logging
- **CORS**: Cross-Origin Resource Sharing

## Setup Instructions

1. **Clone the repository:**

   ```
   git clone <repository-url>
   cd idemy-dev/backend
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory with the following variables:

   ```
   # Server configuration
   PORT=3000
   NODE_ENV=development  # or production

   # JWT settings
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRY=24h

   # Blockchain settings
   BLOCKCHAIN_DIFFICULTY=4
   MINING_REWARD=100

   # Logging settings
   LOG_LEVEL=INFO  # ERROR, WARN, INFO, or DEBUG
   LOG_TO_FILE=true
   LOG_TO_CONSOLE=true

   # Firebase configuration (if using Firebase)
   FIREBASE_SERVICE_ACCOUNT_PATH=path/to/serviceAccountKey.json
   ```

4. **Create data directory:**

   ```
   mkdir -p data
   ```

5. **Run the application:**

   ```
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login and receive JWT token
- **GET /api/auth/profile** - Get user profile (requires authentication)

### Blockchain

- **GET /api/blockchain** - Get the entire blockchain
- **GET /api/blockchain/validate** - Validate the blockchain integrity
- **GET /api/blockchain/block/:index** - Get block by index
- **GET /api/blockchain/block/hash/:hash** - Get block by hash
- **GET /api/blockchain/student-by-email/:email** - Get student records by email

### Transactions

- **POST /api/transactions** - Create a new transaction
- **GET /api/transactions** - Get all transactions
- **GET /api/transactions/:id** - Get transaction by ID
- **POST /api/transactions/mine** - Mine pending transactions

### Students

- **POST /api/students/register** - Register a new student
- **GET /api/students** - Get all students
- **GET /api/students/:studentId** - Get student by ID
- **PUT /api/students/:studentId** - Update student information
- **DELETE /api/students/:studentId** - Delete a student

### NFTs

- **POST /api/nft/mint/:studentId** - Mint NFT for student ID card
- **GET /api/nft/student/:studentId** - Get NFTs owned by a student
- **GET /api/nft/idcards/:studentId** - Get ID cards for a student

## Logging System

The application implements a sophisticated logging system with the following features:

- **Multiple Log Levels**: ERROR, WARN, INFO, DEBUG
- **File Rotation**: Automatic log file rotation when size exceeds limit
- **Separate Log Files**: Different files for each log level
- **Combined Logs**: Consolidated log files with all levels
- **Request/Response Logging**: HTTP request and response details
- **Performance Monitoring**: Timing utilities for performance measurement
- **Context-Rich Logs**: Additional context for better debugging

Log files are stored in the `logs` directory with the following structure:

```
logs/
├── combined/
│   └── combined-YYYY-MM-DD.log
├── error/
│   └── error-YYYY-MM-DD.log
├── warn/
│   └── warn-YYYY-MM-DD.log
├── info/
│   └── info-YYYY-MM-DD.log
└── debug/
    └── debug-YYYY-MM-DD.log
```

## Blockchain Implementation

The blockchain implementation includes:

- **Proof-of-Work**: Mining mechanism with adjustable difficulty
- **Block Structure**: Index, timestamp, transactions, previous hash, and metadata
- **Transaction Validation**: Ensures all transactions are valid
- **Chain Validation**: Verifies the integrity of the entire blockchain
- **Mining Rewards**: Automatic rewards for mining new blocks
- **Pending Transactions**: Queue for transactions waiting to be mined

## Troubleshooting

Common issues and their solutions:

1. **Connection refused errors**: Ensure the server is running on the correct port
2. **Authentication failures**: Verify JWT token validity and expiration
3. **Missing fonts error**: If you see the font registration error in logs, create an `assets` directory at `backend/src/assets`
4. **404 errors**: Ensure you're using the correct API endpoint paths
5. **Validation errors**: Check the request payload structure against API requirements

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
