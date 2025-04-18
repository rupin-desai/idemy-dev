# Idemy - Blockchain-Verified Digital Student ID System

Idemy is a comprehensive platform for creating, managing, and verifying digital student identification cards using blockchain technology. The system provides secure, tamper-proof student credentials that can be verified instantly by authorized institutions.

## System Overview

Idemy integrates traditional student identification systems with blockchain technology to create a secure and verifiable digital identity system for educational institutions. The platform allows students to register, create digital ID cards, and have these credentials minted as NFTs (Non-Fungible Tokens) on a blockchain for immutable record-keeping and easy verification.

## Key Features

- **Student Registration**: Easy self-registration process for students
- **Digital ID Cards**: Generate personalized digital student ID cards
- **Blockchain Verification**: All student records and ID cards are recorded on blockchain
- **NFT Integration**: ID cards are minted as NFTs for ownership and transferability
- **Admin Management**: Administrative interface for managing students and credentials
- **Version Control**: Support for updating and versioning ID cards
- **Verification System**: Simple verification process for third parties

## Architecture

The system follows a modern web architecture consisting of:

- **Frontend**: React-based user interface for students
- **Admin Panel**: Separate React application for administrators
- **Backend API**: Node.js REST API service
- **Blockchain Layer**: Custom blockchain implementation for record integrity

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │     │ Admin Panel │     │  Verifiers  │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
    │                   │                   │
    └───────────┬───────┴───────────┬───────┘
             │                   │
      ┌─────────▼───────────────────▼─────────┐
      │             Backend API               │
      └─────────────────┬───────────────────┬─┘
                  │                   │
         ┌───────────▼────────┐  ┌───────▼────────┐
         │  Student Records   │  │   Blockchain   │
         └────────────────────┘  └────────────────┘
```

## Components

### Frontend

The student-facing application built with React, allowing students to:

- Register as a student
- Create and view their digital ID cards
- Manage their NFT-based credentials
- View blockchain verification status

### Admin Panel

A separate React application providing administrators with tools to:

- Manage student records
- Issue and review ID cards
- Monitor NFT transactions
- Verify credential authenticity

### Backend

A Node.js-based service providing:

- REST API for frontend and admin panel
- Student management services
- ID card generation using canvas
- Authentication and authorization
- Blockchain integration

### Blockchain Layer

A custom blockchain implementation that:

- Maintains immutable records of student registrations
- Tracks ID card issuance and updates
- Provides verification endpoints
- Supports NFT minting and transfers

## Technologies Used

- **Frontend**: React, Framer Motion, TailwindCSS
- **Backend**: Node.js, Express
- **Authentication**: Firebase Authentication
- **Image Generation**: Canvas API
- **Storage**: File-based JSON storage
- **Blockchain**: Custom implementation

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Firebase account (for authentication)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-organization/idemy.git
cd idemy
```

2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install admin panel dependencies
cd ../admin
npm install
```

3. Configure environment variables:
   Create `.env` files in each directory with the required configuration.

4. Start the services:

```bash
# Start backend
cd backend
npm start

# Start frontend
cd ../frontend
npm run dev

# Start admin panel
cd ../admin
npm run dev
```

## API Endpoints

Key API endpoints include:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Student Management**: `/api/students/register`, `/api/students/:studentId`
- **ID Cards**: `/api/nft/idcards/:studentId`
- **NFTs**: `/api/nft/mint/:studentId`, `/api/nft/student/:studentId`
- **Blockchain**: `/api/blockchain/student-by-email/:email`

## License

[MIT License](LICENSE)

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.
